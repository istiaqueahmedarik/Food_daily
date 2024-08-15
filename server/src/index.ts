import { Hono } from 'hono/quick'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import * as dotenv from 'dotenv'
import { runQuery } from '../db/connect/oracle'
import { uuidv7 } from 'uuidv7'
import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'
var jwt_ = require('jsonwebtoken');
dotenv.config()
const SSLCommerzPayment = require('sslcommerz-lts')



type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()
app.use(prettyJSON())
app.use('/*', cors())
app.use(
  '/jwt/*',
  jwt({
    secret: process.env.JWT_SECRET || 'secret',
  })
)
// const payload = c.get('jwtPayload') 
app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.get('/ping', async (c) => {
  const result = await runQuery('SELECT * FROM PING', {});
  if (result !== undefined && result.length)
    return c.text(result[0]['COLUMN1'] + ' (from Oracle)');
  return c.text('PONG (DB Error But Still Alive)');
})

const randomStringGenerator = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}
const randomIntGenerator = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

app.get('/randomInfo', async (c) => {
  const firstName = randomStringGenerator(randomIntGenerator(5, 10));
  const lastName = randomStringGenerator(randomIntGenerator(5, 10));
  const dob = `${randomIntGenerator(1, 31)}-${randomIntGenerator(1, 12)}-${randomIntGenerator(1950, 2000)}`;
  const address = randomStringGenerator(randomIntGenerator(10, 20));
  const mobile = `+91${randomIntGenerator(6000000000, 9999999999)}`;
  const cityCode = randomIntGenerator(1, 10);
  const email = `${firstName}.${lastName}@${randomStringGenerator(randomIntGenerator(5, 10))}.com`;
  const password = randomStringGenerator(randomIntGenerator(8, 15));
  const uid = uuidv7();
  const token = jwt_.sign({ uid, email }, process.env.JWT_SECRET)
  return c.json({ firstName, lastName, dob, address, mobile, cityCode, email, password, uid, token });
})


interface Signup { firstName: string, lastName: string, dob: string, address: string, mobileNumber: string, cityCode: string, email: string, password: string, [key: string]: string }
app.post('/signup', async (c) => {
  try {
    const { firstName, lastName, dob, address, mobileNumber, cityCode, email, password } = await c.req.json<Signup>();
    const checkUser = await runQuery('SELECT * FROM USERS WHERE EMAIL = :email', { email });

    if (checkUser !== undefined && checkUser.length) {
      return c.json({ error: 'User Already Exists' });
    }

    const token = jwt_.sign({ email }, process.env.JWT_SECRET);
    const formattedDob = new Date(dob).toISOString().split('T')[0];

    try {
      const result = await runQuery(`INSERT INTO USERS (FIRST_NAME, LAST_NAME, DOB, ADDRESS, MOBILE, CITY_CODE, EMAIL, PASSWORD, TYPE) VALUES(:firstName, :lastName, TO_DATE(:formattedDob, 'YYYY-MM-DD'), :address, :mobile, :cityCode, :email, :password, :type)`, { firstName, lastName, formattedDob, address, mobile: mobileNumber, cityCode, email, password, type: 'USER' });
      return c.json({ result, token, email });
    } catch (error) {
      return c.json({ error, token, email });
    }
  } catch (error) {
    return c.json({ error });
  }
});

interface Login { email: string, password: string, [key: string]: string }
app.post('/login', async (c) => {
  const { email, password } = await c.req.json<Login>()
  const result = await runQuery('SELECT * FROM USERS WHERE EMAIL = :email AND PASSWORD = :password', { email, password });
  if (result !== undefined && result.length) {
    const token = jwt_.sign({ id: result[0]['ID'], email: result[0]['EMAIL'] }, process.env.JWT_SECRET)
    return c.json({ result, token });
  }
  return c.json({ error: 'Invalid Credentials' });
})


app.get('/jwt/Profile', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload

  const result = await runQuery('SELECT FIRST_NAME, LAST_NAME, DOB, ADDRESS, MOBILE, CITY_CODE, EMAIL, TYPE, PROFILE_IMAGE, CHEF.ID AS CHEF_ID, SPECIALITY, RATING FROM USERS,CHEF WHERE USERS.ID = :id AND USERS.EMAIL = :email AND CHEF.USER_ID(+) = USERS.ID', { id, email });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.post('/jwt/updateProfile', async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = payload;
  const { firstName, lastName, dob, address, mobileNumber, cityCode, email } = await c.req.json<Signup>();
  if (payload.email !== email) {

    return c.json({ error: 'Invalid Token' });
  }

  const formattedDob = new Date(dob).toISOString().split('T')[0];
  const result = await runQuery('UPDATE USERS SET FIRST_NAME = :firstName, LAST_NAME = :lastName, DOB = TO_DATE(:formattedDob, \'YYYY-MM-DD\'), ADDRESS = :address, MOBILE = :mobileNumber, CITY_CODE = :cityCode WHERE ID = :id AND EMAIL = :email', { id, email, firstName, lastName, formattedDob, address, mobileNumber, cityCode });
  return c.json({ result });
})

app.post('/jwt/updateProfileImage', async (c) => {
  const payload = c.get('jwtPayload');
  const { id, email } = payload;
  const { profile_image_url } = await c.req.json<{ profile_image_url: string }>();

  const result = await runQuery('UPDATE USERS SET PROFILE_IMAGE = :profileImage WHERE ID = :id AND EMAIL = :email', { id, email, profileImage: profile_image_url });

  return c.json({ result });
})

interface ChefRequest { speciality: string, experience: string, [key: string]: string }
app.post('/jwt/applyChef', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { speciality, experience } = await c.req.json<ChefRequest>()
  // 
  // return c.json({ speciality, experience });
  const result = await runQuery('INSERT INTO CHEF(USER_ID,SPECIALITY,EXPERIENCE) VALUES(:id,:speciality, :experience)', { id, speciality, experience });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/getChef', async (c) => {
  const payload = c.get('jwtPayload')
  const { id } = payload
  const result = await runQuery('SELECT FIRST_NAME, LAST_NAME, DOB, ADDRESS, MOBILE, CITY_CODE, EMAIL,  PROFILE_IMAGE, CHEF.ID AS CHEF_ID, SPECIALITY, RATING FROM USERS ,CHEF WHERE USERS.ID = CHEF.USER_ID AND CHEF.USER_ID = :id', { id });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/chefDetails', async (c) => {
  const payload = c.get('jwtPayload')
  const { id } = payload
  const result = await runQuery(`
    SELECT 
      USERS.FIRST_NAME, 
      USERS.LAST_NAME, 
      USERS.DOB, 
      USERS.ADDRESS, 
      USERS.MOBILE, 
      USERS.CITY_CODE, 
      USERS.EMAIL, 
      USERS.PROFILE_IMAGE, 
      CHEF.ID AS CHEF_ID, 
      CHEF.SPECIALITY, 
      CHEF.RATING, 
      CHEF.EXPERIENCE, 
      KITCHEN.ID AS KITCHEN_ID, 
      KITCHEN.ADDRESS AS KITCHEN_ADDRESS, 
      KITCHEN.RATING AS KITCHEN_RATING, 
      APPROVED, 
      (SELECT IMAGE FROM KITCHEN_IMAGES WHERE KITCHEN_IMAGES.KITCHEN_ID = KITCHEN.ID AND ROWNUM = 1) AS KITCHEN_IMAGE, 
      KITCHEN.NAME AS KITCHEN_NAME, 
      KITCHEN.CITY_NAME 
    FROM 
      USERS, 
      CHEF, 
      KITCHEN 
    WHERE 
      USERS.ID = CHEF.USER_ID(+) 
      AND USERS.ID = :id 
      AND CHEF.ID = KITCHEN.CHEF_ID(+)
  `, { id });

  if (result !== undefined)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/amIAChef', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const result = await runQuery('SELECT * FROM CHEF WHERE USER_ID = :uid', { uid });
  if (result !== undefined && result.length)
    return c.json({ message: 'Chef' });
  return c.json({ message: 'No Chef' });
})

app.get('/jwt/chefProfile', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const result = await runQuery('SELECT * FROM CHEF WHERE USER_ID = :uid', { uid });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

interface KitchenRequest { KICHEN_NAME: string, KITCHEN_ADDRESS: string, KITCHEN_CITY_NAME: string }
app.post('/jwt/addKitchen', async (c) => {
  const { id, email } = c.get('jwtPayload')
  const { KICHEN_NAME, KITCHEN_ADDRESS, KITCHEN_CITY_NAME } = await c.req.json<KitchenRequest>()
  const result = await runQuery('SELECT ID FROM CHEF WHERE USER_ID = :id', { id });
  const chefId = result[0]['ID'];
  try {
    await runQuery('INSERT INTO KITCHEN (NAME, ADDRESS, CITY_NAME, CHEF_ID) VALUES(:KICHEN_NAME, :KITCHEN_ADDRESS, :KITCHEN_CITY_NAME, :chefId)', { KICHEN_NAME, KITCHEN_ADDRESS, KITCHEN_CITY_NAME, chefId });
    return c.json({ message: 'Kitchen Added' });
  } catch (error) {
    return c.json({ error });
  }
})

app.post('/jwt/editKitchen', async (c) => {
  const { id, email } = c.get('jwtPayload')
  const { kitchenId, KICHEN_NAME, KITCHEN_ADDRESS, KITCHEN_CITY_NAME } = await c.req.json<{ kitchenId: string, KICHEN_NAME: string, KITCHEN_ADDRESS: string, KITCHEN_CITY_NAME: string }>()

  try {
    await runQuery('UPDATE KITCHEN SET NAME = :KICHEN_NAME, ADDRESS = :KITCHEN_ADDRESS, CITY_NAME = :KITCHEN_CITY_NAME WHERE ID = :kitchenId', { KICHEN_NAME, KITCHEN_ADDRESS, KITCHEN_CITY_NAME, kitchenId });
    return c.json({ message: 'Kitchen Updated' });
  } catch (error) {
    return c.json({ error });
  }

})

app.post('/jwt/addKitchenImage', async (c) => {
  const { id, email } = c.get('jwtPayload')
  const { kitchenId, image } = await c.req.json<{ kitchenId: string, image: string }>()
  const result = await runQuery('SELECT ID FROM CHEF WHERE USER_ID = :id', { id });
  const chefId = result[0]['ID'];
  try {
    await runQuery('INSERT INTO KITCHEN_IMAGES (KITCHEN_ID, IMAGE) VALUES(:kitchenId, :image)', { kitchenId, image });
    return c.json({ message: 'Image Added' });
  } catch (error) {
    return c.json({ error });
  }

})

app.post('/getKitchen', async (c) => {
  let { kitchenId } = await c.req.json<{ kitchenId: string }>()
  kitchenId = kitchenId.toUpperCase();


  const result = await runQuery('SELECT CHEF.ID AS CHEF_ID,   USERS.ID, USERS.FIRST_NAME, USERS.LAST_NAME, KITCHEN.ID AS KITCHEN_ID, KITCHEN.ADDRESS AS KITCHEN_ADDRESS,KITCHEN.CITY_NAME AS KITCHEN_CITY_NAME, KITCHEN.RATING AS KICHEN_RATING, KITCHEN.APPROVED AS KITCHEN_APPROVED, KITCHEN.NAME AS KICHEN_NAME FROM KITCHEN, USERS, CHEF WHERE KITCHEN.ID = :kitchenId AND KITCHEN.CHEF_ID = CHEF.ID AND CHEF.USER_ID = USERS.ID', { kitchenId });
  const image = await runQuery('SELECT IMAGE FROM KITCHEN_IMAGES WHERE KITCHEN_ID = :kitchenId', { kitchenId });
  if (result !== undefined)
    return c.json({ result, image });
  return c.json({ error: 'Invalid Token' });
})

app.post('/jwt/getKitchenImage', async (c) => {

  const { kitchenId } = await c.req.json<{ kitchenId: string }>()
  const image = await runQuery('SELECT ID,IMAGE FROM KITCHEN_IMAGES WHERE KITCHEN_ID = :kitchenId ORDER BY KITCHEN_IMAGES.DATE_ADDED', { kitchenId });
  return c.json({ image });

})

app.post('/jwt/deleteKitchenImage', async (c) => {
  const { imageId } = await c.req.json<{ imageId: string }>()
  const result = await runQuery('DELETE FROM KITCHEN_IMAGES WHERE ID = :imageId', { imageId });
  return c.json({ result });
})

interface CertificationRequest { certification: string, issueDate: string, expiryDate: string, link: string, name: string, [key: string]: string }
app.post('/jwt/addCertification', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { certification, issueDate, expiryDate, link, name } = await c.req.json<CertificationRequest>()
  const f_issue_date = new Date(issueDate).toISOString().split('T')[0];
  const f_expiry_date = new Date(expiryDate).toISOString().split('T')[0];
  let result = await runQuery('SELECT * FROM CHEF WHERE USER_ID = :id', { id });

  if (result !== undefined && result.length) {
    const chef_id = result[0]['ID'];
    if (expiryDate === '') {
      result = await runQuery('INSERT INTO CERTIFICATION(CHEF_ID, CERTIFICATION, ISSUE_DATE, LINK,CERTIFICATE_IMAGE) VALUES(:chef_id, :name, TO_DATE(:f_issue_date, \'YYYY-MM-DD\'), :link,:certification)', { chef_id, certification, f_issue_date, link, name })
    }
    else {
      result = await runQuery('INSERT INTO CERTIFICATION(CHEF_ID, CERTIFICATION, ISSUE_DATE, EXPIRY_DATE, LINK,CERTIFICATE_IMAGE) VALUES(:chef_id, :name, TO_DATE(:f_issue_date, \'YYYY-MM-DD\'), TO_DATE(:f_expiry_date, \'YYYY-MM-DD\'), :link,:certification)', { chef_id, certification, f_issue_date, f_expiry_date, link, name })
    }
    return c.json({ result });
  }
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/getCertifications', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT * FROM CHEF C JOIN CERTIFICATION CE ON C.ID = CE.CHEF_ID WHERE C.USER_ID = :id ORDER BY CE.ISSUE_DATE', { id });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})



interface KitchenRequest { name: string, address: string, cityCode: string, rating: string, [key: string]: string }
app.post('/jwt/applyKitchen', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const { name, address, cityCode, rating } = await c.req.json<KitchenRequest>()
  let result = await runQuery('SELECT * FROM CHEF WHERE USER_ID = :uid', { uid });
  if (result !== undefined && result.length) {
    const chef_id = result[0]['ID'];
    const kitchen_id = uuidv7();
    result = await runQuery('INSERT INTO KITCHEN VALUES(:kitchen_id, :name, :address, :cityCode, :rating, :chef_id, 0)', { kitchen_id, name, address, cityCode, rating, chef_id });
    if (result !== undefined && result.length)
      return c.json({ result });
  }
  return c.json({ error: 'Invalid Token' });
})

app.post('/jwt/approveKitchen', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { kitchen_id } = await c.req.json<{ st: number, kitchen_id: string }>()
  const user = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (user[0]['APPROVED'] !== 1)
    return c.json({ error: 'Invalid Token' });
  const result = await runQuery('UPDATE KITCHEN SET APPROVED = 1 WHERE ID = :kitchen_id', { kitchen_id });
  return c.json({ result });

})

app.post('/jwt/disapproveKitchen', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { kitchen_id } = await c.req.json<{ st: number, kitchen_id: string }>()
  const user = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (user[0]['APPROVED'] !== 1)
    return c.json({ error: 'Invalid Token' });

  const res = await runQuery('DELETE FROM KITCHEN_IMAGES WHERE KITCHEN_ID = :kitchen_id', { kitchen_id });
  const result = await runQuery('DELETE FROM KITCHEN WHERE ID = :kitchen_id', { kitchen_id });
  return c.json({ result });
})

app.post('/jwt/getKitchenImages', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { kitchen_id } = await c.req.json<{ kitchen_id: string }>()
  const user = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (user[0]['APPROVED'] !== 1)
    return c.json({ error: 'Invalid Token' });
  const result = await runQuery('SELECT * FROM KITCHEN_IMAGES WHERE KITCHEN_ID = :kitchen_id', { kitchen_id });
  return c.json({ result });

})

app.get('/jwt/verifyKitchens', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const user = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (user[0]['APPROVED'] !== 1)
    return c.json({ error: 'Invalid Token' });
  const result = await runQuery('SELECT * FROM KITCHEN WHERE APPROVED = 0', {});
  if (result !== undefined)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/getKitchens', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const result = await runQuery('SELECT * FROM KITCHEN WHERE CHEF_ID = (SELECT ID FROM CHEF WHERE USER_ID = :uid)', { uid });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

interface QAofficerRequest { ACADEMIC_QUALIFICATION: string, CV_LINK: string, [key: string]: string }
app.post('/jwt/applyQAofficer', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { ACADEMIC_QUALIFICATION, CV_LINK } = await c.req.json<QAofficerRequest>()
  const check = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (check !== undefined && check.length)
    return c.json({ error: 'Already Applied' });
  let result = await runQuery('INSERT INTO QA_OFFICER(USER_ID, ACADEMIC_QUALIFICATION, CV_LINK) VALUES(:id, :ACADEMIC_QUALIFICATION, :CV_LINK)', { id, ACADEMIC_QUALIFICATION, CV_LINK });
  return c.json({ result });
})

app.get('/jwt/getQAofficer', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})


app.get('/jwt/getQAofficers', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const user = await runQuery('SELECT * FROM USERS WHERE ID = :id', { id });
  if (user[0]['TYPE'] !== 'ADMIN')
    return c.json({ error: 'Invalid Token' });
  const result = await runQuery('SELECT * FROM QA_OFFICER, USERS WHERE USERS.ID = QA_OFFICER.USER_ID', {});
  if (result !== undefined)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})


app.post('/jwt/approveQA', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { st, qa_id } = await c.req.json<{ st: number, qa_id: string }>()

  if (st === 1) {
    // const result = await runQuery('UPDATE QA_OFFICER SET APPROVED = 1 WHERE ID = :qa_id', { qa_id });
    // set approved to 1 and DATE_OF_JOINING to sysdate
    const result = await runQuery('UPDATE QA_OFFICER SET APPROVED = 1, DATE_OF_JOINING = SYSDATE WHERE ID = :qa_id', { qa_id });

    return c.json({ result });
  }
  else {
    const result = await runQuery('DELETE FROM QA_OFFICER WHERE ID = :qa_id', { qa_id });
    return c.json({ result });
  }
})

// CREATE TABLE FOOD(
//   ID VARCHAR2(36) PRIMARY KEY,
//   NAME VARCHAR2(255) NOT NULL,
//   DESCRIPTION VARCHAR2(300) NOT NULL,
//   PRICE NUMBER NOT NULL,
//   RATING NUMBER DEFAULT 0,
//   CATEGORY_ID VARCHAR2(36) NOT NULL,
//   FOOD_IMAGE VARCHAR2(255) DEFAULT 'https://placehold.co/600x400',
//   FOREIGN KEY(CATEGORY_ID) REFERENCES CATEGORY(ID)
// );
interface FoodRequest { kitchen_id: string, category_id: string, name: string, foodImage: string, description: string, price: string, image: string, [key: string]: string }
app.post('/jwt/addDish', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const { kitchen_id, category_id, name, description, price, image } = await c.req.json<FoodRequest>()

  const check = await runQuery('SELECT * FROM KITCHEN,USERS, CHEF WHERE KITCHEN.ID = :kitchen_id AND :id = CHEF.USER_ID AND KITCHEN.CHEF_ID = CHEF.ID', { id, kitchen_id });
  if (check === undefined || check.length === 0)
    return c.json({ error: 'Invalid Token' });
  const result = await runQuery('INSERT INTO FOOD(NAME,DESCRIPTION,PRICE,CATEGORY_ID,FOOD_IMAGE) VALUES(:name, :description, :price, :category_id, :image)', { name, description, price, category_id, image });

  const fid = await runQuery('SELECT ID FROM FOOD WHERE NAME = :name AND DESCRIPTION = :description AND PRICE = :price AND CATEGORY_ID = :category_id AND FOOD_IMAGE = :image', { name, description, price, category_id, image });

  return c.json({ result, fid });

})

app.get('/getFoods/:cid', async (c) => {
  const payload = c.get('jwtPayload')
  const { cid } = c.req.param();
  const result = await runQuery('SELECT * FROM FOOD WHERE CATEGORY_ID = :cid', { cid });

  const others = await runQuery('SELECT CATEGORY.ID AS CATEGORY_ID, CATEGORY.KITCHEN_ID AS KITCHEN_ID, CATEGORY.NAME, CATEGORY.DESCRIPTION, CATEGORY_IMAGE, KITCHEN.NAME AS KITCHEN_NAME, KITCHEN.ADDRESS AS KITCHEN_ADDRESS, KITCHEN.RATING AS KITCHEN_RATING, KITCHEN.CITY_NAME AS KITCHEN_CITY_NAME, KITCHEN.CHEF_ID FROM CATEGORY,KITCHEN WHERE CATEGORY.ID = :cid AND CATEGORY.KITCHEN_ID = KITCHEN.ID', { cid });


  if (result !== undefined)
    return c.json({ result, others });
  return c.json({ error: 'Invalid Token' });
})


app.get('/getFood/:fid', async (c) => {
  const { fid } = c.req.param();
  const result = await runQuery('SELECT * FROM FOOD WHERE ID = :fid', { fid });
  const ingr = await runQuery('SELECT * FROM INGREDIENT WHERE FOOD_ID = :fid', { fid });
  let sm = await runQuery('SELECT SUM(CALORIES) AS CALORIES FROM INGREDIENT WHERE FOOD_ID = :fid', { fid });
  if (sm[0]['CALORIES'] === null)
    sm[0]['CALORIES'] = 0;
  if (result !== undefined)
    return c.json({ result, ingr, sm });
  return c.json({ error: 'Invalid Token' });
})


// CREATE TABLE CATEGORY(
//   ID VARCHAR2(36) PRIMARY KEY,
//   KITCHEN_ID VARCHAR2(36) NOT NULL,
//   NAME VARCHAR2(100) NOT NULL,
//   DESCRIPTION VARCHAR2(300) NOT NULL,
//   CATEGORY_IMAGE VARCHAR2(300) DEFAULT 'https://placehold.co/600x400',
//   FOREIGN KEY(KITCHEN_ID) REFERENCES KITCHEN(ID)
// );
interface CategoryRequest { name: string, description: string, category_image: string, kitchen_id: string, [key: string]: string }
app.post('/jwt/addCategory', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { name, description, category_image, kitchen_id } = await c.req.json<CategoryRequest>()

  const check = await runQuery('SELECT * FROM KITCHEN,USERS, CHEF WHERE KITCHEN.ID = :kitchen_id AND :id = CHEF.USER_ID AND KITCHEN.CHEF_ID = CHEF.ID', { id, kitchen_id });
  if (check === undefined || check.length === 0)
    return c.json({ error: 'Invalid Token' });
  const result = await runQuery('INSERT INTO CATEGORY(KITCHEN_ID, NAME, DESCRIPTION, CATEGORY_IMAGE) VALUES(:kitchen_id, :name, :description, :category_image)', { kitchen_id, name, description, category_image });
  return c.json({ result });

})

app.get('/getCategories/:kid', async (c) => {
  const { kid } = c.req.param();

  const result = await runQuery('SELECT * FROM CATEGORY WHERE KITCHEN_ID = :kid', { kid });
  if (result !== undefined)
    return c.json({ result });
  return c.json({
    error: 'Invalid Token'
  })

})

/** 
 * CREATE TABLE INGREDIENT (
    ID VARCHAR2(36) PRIMARY KEY,
    FOOD_ID VARCHAR2(36) NOT NULL,
    NAME VARCHAR2(255) NOT NULL,
    QUANTITY NUMBER NOT NULL,
    CALORIES NUMBER NOT NULL,
    FOREIGN KEY (FOOD_ID) REFERENCES FOOD(ID)
);
 */
interface IngredientRequest { food_id: string, name: string, quantity: string, calories: string }
app.post('/jwt/addIngredient', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { food_id, name, quantity, calories } = await c.req.json<IngredientRequest>()


  const result = await runQuery('INSERT INTO INGREDIENT(FOOD_ID, NAME, QUANTITY, CALORIES) VALUES(:food_id, :name, :quantity, :calories)', { food_id, name, quantity, calories });
  return c.json({ result });

})

app.get('/getIngredients/:fid', async (c) => {
  const { fid } = c.req.param();
  const ingr = await runQuery('SELECT * FROM INGREDIENT WHERE FOOD_ID = :fid', { fid });
  const food = await runQuery('SELECT * FROM FOOD WHERE ID = :fid', { fid });
  if (ingr !== undefined)
    return c.json({ ingr, food });
  return c.json({ error: 'Invalid Token' });
})


app.post('/jwt/deleteIngredient', async (c) => {
  const { iid } = await c.req.json<{ iid: string }>()

  const result = await runQuery('DELETE FROM INGREDIENT WHERE ID = :iid', { iid });
  return c.json({ result });
})


/**
 * 
 * CREATE TABLE CART (
    ID VARCHAR2(36) PRIMARY KEY,
    USER_ID VARCHAR2(36) NOT NULL,
    FOOD_ID VARCHAR2(36) NOT NULL,
    QUANTITY NUMBER NOT NULL,
    DATE_ADDED DATE DEFAULT SYSDATE,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    FOREIGN KEY (FOOD_ID) REFERENCES FOOD(ID)
);
 */

interface CartRequest { food_id: string, quantity: string }
app.post('/jwt/addToCart', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { food_id, quantity } = await c.req.json<CartRequest>()
  const result = await runQuery('INSERT INTO CART(USER_ID, FOOD_ID, QUANTITY) VALUES(:id, :food_id, :quantity)', { id, food_id, quantity });
  return c.json({ result });
})

app.post('/jwt/deleteFromCart', async (c) => {
  const { food_id } = await c.req.json<{ food_id: string }>()

  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('DELETE FROM CART WHERE USER_ID = :id AND FOOD_ID = :food_id', { id, food_id });
  return c.json({ result });
})

app.get('/jwt/getCart', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT FOOD.ID, FOOD.NAME, CART.QUANTITY, DATE_ADDED, FOOD.DESCRIPTION, FOOD.PRICE, FOOD_IMAGE FROM CART,FOOD WHERE USER_ID = :id AND CART.FOOD_ID = FOOD.ID AND CART.DELETED = 0', { id });
  const sm = await runQuery('SELECT SUM(FOOD.PRICE * CART.QUANTITY) AS TOTAL FROM CART,FOOD WHERE USER_ID = :id AND CART.FOOD_ID = FOOD.ID AND CART.DELETED = 0', { id });

  return c.json({ result, sm });
})

app.get('/jwt/getOrder', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT * FROM ORDERS WHERE USER_ID = :id ORDER BY DATE_ADDED DESC FETCH FIRST 1 ROWS ONLY', { id });
  return c.json({ result });
})


app.post('/sslcommerz/success', async (c) => {
  const data = await c.req.formData();
  const tran_id = data.get('tran_id');
  const val_id = data.get('val_id');
  const store_id = process.env.SSL_STORE_ID || 'mrs6579e610249a7'
  const store_passwd = process.env.SSL_PASS || 'mrs6579e610249a7@ssl'
  const is_live = false
  const response = await fetch(`https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`);
  const res = await response.json();
  const valid = res['status'] === 'VALID';
  const validated = res['validated'] === 'VALIDATED';
  if (validated)
    return c.redirect('http://localhost:3000/success_payment');
  const token = res.value_a;
  const { id, email } = jwt_.verify(token, process.env.JWT_SECRET);
  const address = res.value_b;
  const name = res.value_d;
  const mobile = res.value_c;
  const ammount = res.amount;
  const ord_id = res.tran_id;
  if (valid) {
    await runQuery('INSERT INTO ORDERS(ID,USER_ID, TOTAL, SHIPPING_ADD, SHIPPING_PHONE,SHIPPING_NAME) VALUES(:ord_id, :id, :ammount, :address, :mobile,:name)', { ord_id, id, ammount, address, mobile, name });
    const cart = await runQuery('SELECT CART.ID as CART_ID, FOOD.ID, FOOD.NAME, CART.QUANTITY, DATE_ADDED, FOOD.DESCRIPTION, FOOD.PRICE, FOOD_IMAGE FROM CART,FOOD WHERE USER_ID = :id AND CART.FOOD_ID = FOOD.ID AND CART.DELETED = 0', { id });
    const placeOrderId = uuidv7();
    for (const element of cart) {
      console.log("element", element);
      const cid = element['CART_ID'];
      await runQuery('UPDATE CART SET DELETED = 1, DELETED_ID = :placeOrderId WHERE ID = :cid', { placeOrderId, cid });
    }
    return c.redirect('http://localhost:3000/success_payment');

  }
  return c.json({ res });

})


export default {
  port: process.env.PORT,
  fetch: app.fetch,
} 