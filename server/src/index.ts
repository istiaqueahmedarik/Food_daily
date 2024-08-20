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

  const result = await runQuery('SELECT FIRST_NAME, LAST_NAME, DOB, ADDRESS, MOBILE, CITY_CODE, EMAIL, TYPE, PROFILE_IMAGE, CHEF.ID AS CHEF_ID, SPECIALITY FROM USERS,CHEF WHERE USERS.ID = :id AND USERS.EMAIL = :email AND CHEF.USER_ID(+) = USERS.ID', { id, email });
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

interface ChefRequest { name: string, speciality: string, experience: string, [key: string]: string }
app.post('/jwt/applyChef', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { name, speciality, experience } = await c.req.json<ChefRequest>()
  // 
  // return c.json({ speciality, experience });
  const check = await runQuery('SELECT * FROM CHEF WHERE CHEF_NAME = :name', { name });
  if (check !== undefined && check.length)
    return c.json({ error: 'Name Must be Unique' });
  const result = await runQuery('INSERT INTO CHEF(USER_ID,CHEF_NAME, SPECIALITY,EXPERIENCE) VALUES(:id,:name,:speciality, :experience)', { id, name, speciality, experience });
  if (result !== undefined)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/getChef', async (c) => {
  const payload = c.get('jwtPayload')
  const { id } = payload
  const result = await runQuery('SELECT FIRST_NAME, LAST_NAME, CHEF.CHEF_NAME, DOB, ADDRESS, MOBILE, CITY_CODE, EMAIL,  PROFILE_IMAGE, CHEF.ID AS CHEF_ID, SPECIALITY FROM USERS ,CHEF WHERE USERS.ID = CHEF.USER_ID AND CHEF.USER_ID = :id', { id });
  if (result !== undefined)
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
      CHEF_NAME,
      CHEF.ID AS CHEF_ID, 
      CHEF.SPECIALITY, 
      CHEF.EXPERIENCE, 
      KITCHEN.ID AS KITCHEN_ID, 
      KITCHEN.ADDRESS AS KITCHEN_ADDRESS, 
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

app.get('/getChef/:cid', async (c) => {
  const { cid } = c.req.param();
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
      CHEF_NAME,
      CHEF.ID AS CHEF_ID, 
      CHEF.SPECIALITY, 
      CHEF.EXPERIENCE, 
      KITCHEN.ID AS KITCHEN_ID, 
      KITCHEN.ADDRESS AS KITCHEN_ADDRESS, 
      APPROVED, 
      (SELECT IMAGE FROM KITCHEN_IMAGES WHERE KITCHEN_IMAGES.KITCHEN_ID = KITCHEN.ID AND ROWNUM = 1) AS KITCHEN_IMAGE, 
      KITCHEN.NAME AS KITCHEN_NAME, 
      KITCHEN.CITY_NAME 
    FROM 
      USERS, 
      CHEF, 
      KITCHEN 
    WHERE 
      USERS.ID = CHEF.USER_ID 
      AND CHEF.ID = :cid 
      AND CHEF.ID = KITCHEN.CHEF_ID(+)
  `, { cid });

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

app.post('/jwt/deleteKitchen', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { kitchenId } = await c.req.json<{ kitchenId: string }>()
  await runQuery('DELETE FROM KITCHEN_IMAGES WHERE KITCHEN_ID = :kitchenId', { kitchenId });
  await runQuery("DELETE FROM INGREDIENT WHERE FOOD_ID IN (SELECT ID FROM FOOD WHERE CATEGORY_ID IN (SELECT ID FROM CATEGORY WHERE KITCHEN_ID = :kitchenId))", { kitchenId });
  await runQuery("DELETE FROM CART WHERE FOOD_ID IN (SELECT ID FROM FOOD WHERE CATEGORY_ID IN (SELECT ID FROM CATEGORY WHERE KITCHEN_ID = :kitchenId))", { kitchenId });
  await runQuery("DELETE FROM FOOD WHERE CATEGORY_ID IN (SELECT ID FROM CATEGORY WHERE KITCHEN_ID = :kitchenId)", { kitchenId });
  await runQuery("DELETE FROM CATEGORY WHERE KITCHEN_ID = :kitchenId", { kitchenId });
  await runQuery("DELETE FROM KITCHEN WHERE ID = :kitchenId", { kitchenId });

  return c.json({ message: 'Kitchen Deleted' });
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


  const result = await runQuery('SELECT CHEF.ID AS CHEF_ID,   USERS.ID, USERS.FIRST_NAME, USERS.LAST_NAME, KITCHEN.ID AS KITCHEN_ID, KITCHEN.ADDRESS AS KITCHEN_ADDRESS,KITCHEN.CITY_NAME AS KITCHEN_CITY_NAME, KITCHEN.APPROVED AS KITCHEN_APPROVED, KITCHEN.NAME AS KICHEN_NAME FROM KITCHEN, USERS, CHEF WHERE KITCHEN.ID = :kitchenId AND KITCHEN.CHEF_ID = CHEF.ID AND CHEF.USER_ID = USERS.ID', { kitchenId });
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

app.get('/getCertifications/:cid', async (c) => {
  const { cid } = c.req.param();
  const result = await runQuery('SELECT * FROM CHEF C, CERTIFICATION CE WHERE  C.ID = :cid AND CE.CHEF_ID = C.ID ORDER BY CE.ISSUE_DATE', { cid });

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



app.post('/jwt/approveDelivery', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { delivery_id } = await c.req.json<{ st: number, delivery_id: string }>()
  const user = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (user[0]['APPROVED'] !== 1)
    return c.json({ error: 'Invalid Token' });
  const result = await runQuery('UPDATE DELIVERY_PARTNER SET VERIFIED = 1 WHERE ID = :delivery_id', { delivery_id });
  return c.json({ result });

})

app.post('/jwt/disapproveDelivery', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { delivery_id } = await c.req.json<{ st: number, delivery_id: string }>()
  const user = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (user[0]['APPROVED'] !== 1)
    return c.json({ error: 'Invalid Token' });

  const result = await runQuery('DELETE FROM DELIVERY_PARTNER WHERE ID = :delivery_id CASCADE CONSTRAINTS', { delivery_id });
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

app.get('/jwt/verifyDelivery', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const user = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (user[0]['APPROVED'] !== 1)
    return c.json({ error: 'Invalid Token' });
  const result = await runQuery('SELECT USERS.ID AS USER_ID, DELIVERY_PARTNER.ID AS DELIVERY_ID, LICENSE, VEHICLE, FIRST_NAME, LAST_NAME FROM DELIVERY_PARTNER,USERS WHERE USERS.ID = DELIVERY_PARTNER.USER_ID AND VERIFIED = 0', {});
  console.log(result)
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

  const others = await runQuery('SELECT CATEGORY.ID AS CATEGORY_ID, CATEGORY.KITCHEN_ID AS KITCHEN_ID, CATEGORY.NAME, CATEGORY.DESCRIPTION, CATEGORY_IMAGE, KITCHEN.NAME AS KITCHEN_NAME, KITCHEN.ADDRESS AS KITCHEN_ADDRESS, KITCHEN.CITY_NAME AS KITCHEN_CITY_NAME, KITCHEN.CHEF_ID FROM CATEGORY,KITCHEN WHERE CATEGORY.ID = :cid AND CATEGORY.KITCHEN_ID = KITCHEN.ID', { cid });


  if (result !== undefined)
    return c.json({ result, others });
  return c.json({ error: 'Invalid Token' });
})


app.get('/getFood/:fid', async (c) => {
  const { fid } = c.req.param();
  const result = await runQuery('SELECT * FROM FOOD, CATEGORY WHERE FOOD.ID = :fid AND CATEGORY.ID = FOOD.CATEGORY_ID', { fid });
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

app.get('/jwt/getOrders', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery("SELECT * FROM ( SELECT C.DELETED_ID, K.ID, LISTAGG(F.NAME,  ', ') WITHIN GROUP(ORDER BY F.NAME) AS FOOD_NAMES FROM CART C JOIN FOOD F   ON C.FOOD_ID = F.ID JOIN CATEGORY CAT ON F.CATEGORY_ID = CAT.ID JOIN KITCHEN K             ON CAT.KITCHEN_ID = K.ID WHERE C.DELETED_ID IS NOT NULL GROUP BY C.DELETED_ID, K.ID )      Q, ORDERS O, KITCHEN KI WHERE KI.ID = Q.ID AND Q.DELETED_ID = O.ID AND O.STATUS = 'PREPEARED' AND O.DATE_SHIPPED IS NULL  AND O.DATE_PREPARED IS NOT NULL   AND O.DATE_DELIVERED IS NULL AND O.DATE_ADDED <= SYSDATE ORDER BY O.DATE_ADDED", {});
  return c.json({ result });
})


app.get('/jwt/activeOrders', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery("SELECT * FROM ( SELECT C.DELETED_ID, K.ID, LISTAGG(F.NAME,  ', ') WITHIN GROUP(ORDER BY F.NAME) AS FOOD_NAMES FROM CART C JOIN FOOD F   ON C.FOOD_ID = F.ID JOIN CATEGORY CAT ON F.CATEGORY_ID = CAT.ID JOIN KITCHEN K             ON CAT.KITCHEN_ID = K.ID WHERE C.DELETED_ID IS NOT NULL GROUP BY C.DELETED_ID, K.ID )      Q, ORDERS O, KITCHEN KI,     ACTIVE_DELIVERY ACD WHERE ACD.DELIVERY_PARTNER_ID = :id AND ACD.ORDER_ID = O.ID AND KI.ID = Q.ID AND Q.DELETED_ID = O.ID AND O.STATUS = 'SHIPPED' AND O.DATE_DELIVERED IS NULL AND O.DATE_ADDED <= SYSDATE ORDER BY O.DATE_ADDED", { id });
  return c.json({ result });
})




app.get('/jwt/orderHistory', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery("SELECT * FROM ( SELECT C.DELETED_ID, K.ID, LISTAGG(F.NAME,  ', ') WITHIN GROUP(ORDER BY F.NAME) AS FOOD_NAMES FROM CART C JOIN FOOD F   ON C.FOOD_ID = F.ID JOIN CATEGORY CAT ON F.CATEGORY_ID = CAT.ID JOIN KITCHEN K             ON CAT.KITCHEN_ID = K.ID WHERE C.DELETED_ID IS NOT NULL GROUP BY C.DELETED_ID, K.ID )      Q, ORDERS O, KITCHEN KI,     ACTIVE_DELIVERY ACD WHERE ACD.DELIVERY_PARTNER_ID = :id AND ACD.ORDER_ID = O.ID AND KI.ID = Q.ID AND Q.DELETED_ID = O.ID AND O.STATUS = 'DELIVERED' ORDER BY O.DATE_ADDED DESC", { id });
  return c.json({ result });

})



app.post('/jwt/acceptOrder', async (c) => {
  const { oid } = await c.req.json<{ oid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery("UPDATE ORDERS SET DATE_SHIPPED = SYSDATE, STATUS = 'SHIPPED' WHERE ID = :oid", { oid });

  await runQuery("INSERT INTO ACTIVE_DELIVERY(ORDER_ID, DELIVERY_PARTNER_ID) VALUES(:oid, :id)", { oid, id });

  return c.json({ result });
})



app.post('/jwt/completeOrder', async (c) => {
  const { oid } = await c.req.json<{ oid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery("UPDATE ORDERS SET DATE_DELIVERED = SYSDATE, STATUS = 'DELIVERED' WHERE ID = :oid", { oid });
  await runQuery("UPDATE ACTIVE_DELIVERY SET STATUS = 'COMPLETED' WHERE ORDER_ID = :oid", { oid });
  return c.json({ result });
})

app.post('/jwt/cancelOrder', async (c) => {
  const { oid } = await c.req.json<{ oid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery("UPDATE ORDERS SET STATUS = 'CANCELLED' WHERE ID = :oid", { oid });
  await runQuery("UPDATE ACTIVE_DELIVERY SET STATUS = 'REJECTED' WHERE ORDER_ID = :oid", { oid });
  return c.json({ result });
})


app.get('/jwt/deliverySummary', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload


  const totalOrder = await runQuery('SELECT COUNT(*) AS TOTAL_ORDER FROM ORDERS WHERE STATUS = \'DELIVERED\'', {});

  const totalEarning = await runQuery('SELECT SUM(TOTAL) AS TOTAL_EARNING FROM ORDERS WHERE STATUS = \'DELIVERED\'', {});

  const avgDeliveryTime = await runQuery('SELECT AVG(DATE_DELIVERED - DATE_SHIPPED) AS AVG_DELIVERY_TIME FROM ORDERS WHERE STATUS = \'DELIVERED\'', {});


  return c.json({ totalOrder, totalEarning, avgDeliveryTime });

})


app.get('/jwt/earningByDay/:days', async (c) => {
  const { days } = c.req.param();
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery("SELECT SUM(TOTAL) AS TOTAL_EARNING, TRUNC(DATE_ADDED) AS DAY FROM ORDERS WHERE DATE_ADDED >= TRUNC(SYSDATE) - :days  AND ORDERS.USER_ID = :id AND ORDERS.STATUS = 'DELIVERED' GROUP BY TRUNC(DATE_ADDED) ORDER BY TRUNC(DATE_ADDED)", { days, id });
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

    await runQuery('UPDATE CART SET DELETED = 1, DELETED_ID = :ord_id WHERE USER_ID = :id AND DELETED=0', { ord_id, id });

    return c.redirect('http://localhost:3000/success_payment');

  }
  return c.json({ res });

})

/**
 * CREATE TABLE DELIVERY_PARTNER (
    ID VARCHAR2(36) PRIMARY KEY,
    USER_ID VARCHAR2(36) NOT NULL,
    LICENCE VARCHAR2(255) NOT NULL,
    VEHICLE VARCHAR2(255) NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);
 */
app.post('/jwt/applyDelivery', async (c) => {
  const { license, vehicle } = await c.req.json<{ license: string, vehicle: string }>();
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('INSERT INTO DELIVERY_PARTNER(USER_ID, LICENSE, VEHICLE) VALUES(:id, :license, :vehicle)', { id, license, vehicle });
  return c.json({ result });
})

app.post('/jwt/getDelivery', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT D.ID, D.LICENSE, D.VEHICLE, U.FIRST_NAME, U.LAST_NAME, U.ADDRESS, U.MOBILE, U.CITY_CODE, U.EMAIL, U.PROFILE_IMAGE  FROM DELIVERY_PARTNER  D,USERS U WHERE USER_ID = :id AND USER_ID = U.ID', { id });
  return c.json({ result });
})


interface SearchRequest { search: string, city: string, chef: string, kitchen: string, price: string, rating: string, sort: string, page: string }
app.post('/search', async (c) => {
  const { search, city, chef, kitchen, price, rating, sort, page } = await c.req.json<SearchRequest>();


  const searchVals = search ? search.split(' ') : [];
  const cityVals = city ? city.split(',') : [];
  const chefVals = chef ? chef.split(',') : [];
  const kitchenVals = kitchen ? kitchen.split(',') : [];
  let query = 'SELECT  FOOD.ID AS FOOD_ID, CHEF.ID AS CHEF_ID, CHEF_NAME, KITCHEN.ID AS KITCHEN_ID, FOOD.NAME,FOOD.PRICE,  COALESCE(FOOD_RATING.RATING,0) as RATING, FOOD.FOOD_IMAGE, KITCHEN.CITY_NAME, KITCHEN.NAME AS KITCHEN_NAME, CATEGORY.NAME AS CATEGORY_NAME, USERS.PROFILE_IMAGE FROM FOOD, KITCHEN, CATEGORY, CHEF, USERS, FOOD_RATING WHERE FOOD_RATING.FOOD_ID(+) = FOOD.ID AND  FOOD.CATEGORY_ID = CATEGORY.ID AND CATEGORY.KITCHEN_ID = KITCHEN.ID AND KITCHEN.APPROVED = 1 AND KITCHEN.CHEF_ID = CHEF.ID AND CHEF.USER_ID = USERS.ID  :where';


  let where = '';
  if (searchVals.length > 0) {
    // where += ` AND UTL_MATCH.JARO_WINKLER_SIMILARITY(FOOD.NAME, :search0) > 60`;
    // for (let i = 1; i < searchVals.length; i++) {
    //   where += ` OR UTL_MATCH.JARO_WINKLER_SIMILARITY(FOOD.NAME, :search${i}) > 60`;
    // }
    where += ` AND ( UPPER(FOOD.NAME) LIKE UPPER('%' || :search0 || '%')`;
    for (let i = 1; i < searchVals.length; i++) {
      where += ` OR UPPER(FOOD.NAME) LIKE UPPER('%' || :search${i} || '%')`;
    }
    where += ')';
  }
  if (cityVals !== undefined && cityVals.length > 0) {
    where += ` AND ( UPPER(KITCHEN.CITY_NAME) LIKE UPPER('%' || :city0 || '%')`;
    for (let i = 1; i < cityVals.length; i++) {
      where += ` OR UPPER(KITCHEN.CITY_NAME) LIKE UPPER('%' || :city${i} || '%')`;
    }
    where += ')';
  }
  if (chefVals !== undefined && chefVals.length > 0) {
    where += ` AND ( USERS.FIRST_NAME || ' ' || USERS.LAST_NAME = :chef0`;
    for (let i = 1; i < chefVals.length; i++) {
      where += ` OR USERS.FIRST_NAME || ' ' || USERS.LAST_NAME = :chef${i}`;
    }
    where += ')';
  }

  if (kitchenVals !== undefined && kitchenVals.length > 0) {
    where += ` AND ( KITCHEN.NAME = :kitchen0`;
    for (let i = 1; i < kitchenVals.length; i++) {
      where += ` OR KITCHEN.NAME = :kitchen${i}`;
    }
    where += ')';
  }

  let priceWhere1 = price === undefined ? 0 : price.split(',')[0];
  let priceWhere2 = price === undefined ? Infinity : price.split(',')[1];

  where += ` AND FOOD.PRICE >= :price1 AND FOOD.PRICE <= :price2`;


  if (rating !== undefined) { where += ` AND RATING >= :rating`; }


  const vals: { [key: string]: string | number } = {

  }
  if (searchVals.length > 0) {
    for (let i = 0; i < searchVals.length; i++) {
      vals[`search${i}`] = searchVals[i];
    }
  }
  if (cityVals !== undefined && cityVals.length > 0) {
    for (let i = 0; i < cityVals.length; i++) {
      vals[`city${i}`] = cityVals[i];
    }
  }
  if (chefVals !== undefined && chefVals.length > 0) {
    for (let i = 0; i < chefVals.length; i++) {
      vals[`chef${i}`] = chefVals[i];
    }
  }
  if (kitchenVals !== undefined && kitchenVals.length > 0) {
    for (let i = 0; i < kitchenVals.length; i++) {
      vals[`kitchen${i}`] = kitchenVals[i];
    }
  }
  vals['price1'] = priceWhere1;
  vals['price2'] = priceWhere2;
  if (rating !== undefined)
    vals['rating'] = rating;

  let sortWhere = '';
  if (sort === 'price-low-to-high') {
    sortWhere = ' ORDER BY FOOD.PRICE ASC';
  }
  else if (sort === 'price-high-to-low') {
    sortWhere = ' ORDER BY FOOD.PRICE DESC';
  }
  else if (sort === 'rating-high-to-low') {
    sortWhere = ' ORDER BY RATING DESC';
  }
  else {
    // if (searchVals.length > 0) {
    //   sortWhere = ' ORDER BY UTL_MATCH.JARO_WINKLER_SIMILARITY(FOOD.NAME, :search0) DESC';
    //   for (let i = 1; i < searchVals.length; i++) {
    //     sortWhere += ` , UTL_MATCH.JARO_WINKLER_SIMILARITY(FOOD.NAME, :search${i}) DESC`;
    //   }
    // }
    // else {
    //   sortWhere = ' ORDER BY FOOD.RATING DESC';
    // }

    sortWhere = ' ORDER BY RATING DESC';


  }
  query += sortWhere;
  const offset = 12;
  const pageQ = page === undefined ? 0 : parseInt(page);
  const limit = offset * pageQ;
  query += ` OFFSET :limit ROWS FETCH NEXT :offset ROWS ONLY`;
  vals['limit'] = limit;
  vals['offset'] = offset;


  const q = query.replace(':where', where);
  const result = await runQuery(q, vals);
  // const result = []



  return c.json({ result });


})

app.get('/getAllKitchens', async (c) => {
  const result = await runQuery('SELECT NAME FROM KITCHEN WHERE APPROVED = 1', {});
  const names = result.map((r: any) => r['NAME']) || []
  return c.json(names);
});

app.get('/getChefs', async (c) => {
  const result = await runQuery('SELECT CHEF_NAME AS NAME FROM CHEF', {});
  // create array of names from result
  const names = result.map((r: any) => r['NAME']) || []
  return c.json(names);
})

app.get('/getCities', async (c) => {
  const result = await runQuery('SELECT DISTINCT UPPER(CITY_NAME) AS CITY_NAME FROM KITCHEN WHERE APPROVED = 1', {});
  const cities = result.map((r: any) => r['CITY_NAME']) || [];
  return c.json(cities);
})

app.get('/getPriceRange', async (c) => {
  const result = await runQuery('SELECT MIN(PRICE) AS MIN, MAX(PRICE) AS MAX FROM FOOD', {});
  const min = result[0]['MIN'];
  const max = result[0]['MAX'];
  return c.json([min, max]);
})


app.post('/jwt/isOrder', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { fid } = await c.req.json<{ fid: string }>();
  const result = await runQuery('SELECT * FROM CART WHERE USER_ID = :id AND FOOD_ID = :fid', { id, fid });
  if (result !== undefined && result.length)
    return c.json({ status: true });
  return c.json({ status: false });
})

// CREATE TABLE FOOD_RATING(
//   ID VARCHAR2(36) PRIMARY KEY,
//   FOOD_ID VARCHAR2(36) NOT NULL,
//   USER_ID VARCHAR2(36) NOT NULL,
//   RATING NUMBER DEFAULT 0,
//   REVIEW VARCHAR2(255) DEFAULT '',
//   FOREIGN KEY(FOOD_ID) REFERENCES FOOD(ID),
//   FOREIGN KEY(USER_ID) REFERENCES USERS(ID)
// );

interface RatingRequest { food_id: string, rating: string, review: string }
app.post('/jwt/addRating', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { food_id, rating, review } = await c.req.json<RatingRequest>();
  const already = await runQuery('SELECT * FROM FOOD_RATING WHERE FOOD_ID = :food_id AND USER_ID = :id', { food_id, id });
  if (already !== undefined && already.length) {
    const result = await runQuery('UPDATE FOOD_RATING SET RATING = :rating, REVIEW = :review WHERE FOOD_ID = :food_id AND USER_ID = :id', { food_id, id, rating, review });
    return c.json({ result });
  }
  const result = await runQuery('INSERT INTO FOOD_RATING(FOOD_ID, USER_ID, RATING, REVIEW) VALUES(:food_id, :id, :rating, :review)', { food_id, id, rating, review });
  return c.json({ result });
})

app.get('/getRating/:fid', async (c) => {
  const { fid } = c.req.param();
  const result = await runQuery('SELECT FOOD_ID, USER_ID, RATING, REVIEW, FIRST_NAME, LAST_NAME FROM FOOD_RATING, USERS WHERE FOOD_ID = :fid AND USERS.ID = FOOD_RATING.USER_ID ORDER BY DATE_ADDED', { fid });
  return c.json({ result });
})

app.post('/jwt/deleteRating', async (c) => {
  const { rid } = await c.req.json<{ rid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('DELETE FROM FOOD_RATING WHERE ID = :rid', { rid });
  return c.json({ result });
})

app.get('/jwt/getRating', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT * FROM FOOD_RATING WHERE USER_ID = :id', { id });
  return c.json({ result });
})

app.post('/jwt/getReview', async (c) => {
  const { fid } = await c.req.json<{ fid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT * FROM FOOD_RATING WHERE FOOD_ID = :fid AND USER_ID = :id', { fid, id });
  return c.json({ result });
})

app.post('/jwt/updateRating', async (c) => {
  const { rid, rating, review } = await c.req.json<{ rid: string, rating: string, review: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('UPDATE FOOD_RATING SET RATING = :rating, REVIEW = :review WHERE ID = :rid', { rid, rating, review });
  return c.json({ result });
})


app.get('/getFoodRating/:fid', async (c) => {
  const { fid } = await c.req.param();
  const result = await runQuery('SELECT COALESCE(AVG(RATING), 0) AS RATING FROM FOOD_RATING WHERE FOOD_ID = :fid', { fid });
  return c.json({ Rating: result[0]['RATING'] });
})

app.get('/getKitchenRating/:kid', async (c) => {
  const { kid } = await c.req.param();
  const result = await runQuery('SELECT COALESCE(AVG(RATING), 0) AS RATING FROM FOOD_RATING WHERE FOOD_ID IN (SELECT ID FROM FOOD WHERE CATEGORY_ID IN (SELECT ID FROM CATEGORY WHERE KITCHEN_ID = :kid))', { kid });

  return c.json({ Rating: result[0]['RATING'] });
})

app.get('/getChefRating/:cid', async (c) => {
  const { cid } = await c.req.param();
  const result = await runQuery('SELECT COALESCE(AVG(RATING), 0) AS RATING FROM FOOD_RATING WHERE FOOD_ID IN (SELECT ID FROM FOOD WHERE CATEGORY_ID IN (SELECT ID FROM CATEGORY WHERE KITCHEN_ID IN (SELECT ID FROM KITCHEN WHERE CHEF_ID = :cid)))', { cid });

  return c.json({ Rating: result[0]['RATING'] });
})




app.get('/bestSellingFood', async (c) => {
  const result = await runQuery('SELECT * FROM FOOD, (SELECT FOOD_ID, COUNT(FOOD_ID) AS COUNT FROM CART GROUP BY FOOD_ID ORDER BY COUNT DESC FETCH FIRST 10 ROWS ONLY) B WHERE B.FOOD_ID = FOOD.ID', {});
  return c.json({ result });
})

app.get('/bestSellingChef', async (c) => {
  const result = await runQuery('SELECT CHEF.ID AS CHEF_ID, CHEF_NAME, SPECIALITY, EXPERIENCE, B.COUNT, PROFILE_IMAGE FROM CHEF, (SELECT CHEF_ID, COUNT(CHEF_ID) AS COUNT FROM KITCHEN GROUP BY CHEF_ID ORDER BY COUNT DESC FETCH FIRST 10 ROWS ONLY) B, USERS WHERE B.CHEF_ID = CHEF.ID AND USERS.ID = CHEF.USER_ID', {});
  return c.json({ result });
})

app.get('/bestFoodCategory', async (c) => {
  const result = await runQuery('SELECT CATEGORY.ID AS CATEGORY_ID, CATEGORY.NAME, CATEGORY.DESCRIPTION, B.COUNT, CATEGORY_IMAGE FROM CATEGORY, (SELECT CATEGORY_ID, COUNT(CATEGORY_ID) AS COUNT FROM FOOD GROUP BY CATEGORY_ID ORDER BY COUNT DESC FETCH FIRST 10 ROWS ONLY) B WHERE B.CATEGORY_ID = CATEGORY.ID', {});
  return c.json({ result });
})

app.get('/bestFood/:cid', async (c) => {
  const { cid } = c.req.param();
  const result = await runQuery('SELECT * FROM FOOD, (SELECT FOOD_ID, COUNT(FOOD_ID) AS COUNT FROM CART WHERE FOOD_ID IN (SELECT ID FROM FOOD WHERE CATEGORY_ID IN (SELECT ID FROM CATEGORY WHERE KITCHEN_ID IN (SELECT ID FROM KITCHEN WHERE CHEF_ID = :cid))) GROUP BY FOOD_ID ORDER BY COUNT DESC FETCH FIRST 4 ROWS ONLY) B WHERE B.FOOD_ID = FOOD.ID', { cid });
  return c.json({ result });
})

app.get('/bestFoodCategory/:cid', async (c) => {
  const { cid } = c.req.param();
  const result = await runQuery('SELECT * FROM CATEGORY, (SELECT CATEGORY_ID, COUNT(CATEGORY_ID) AS COUNT FROM FOOD WHERE CATEGORY_ID IN (SELECT ID FROM CATEGORY WHERE KITCHEN_ID IN (SELECT ID FROM KITCHEN WHERE CHEF_ID = :cid)) GROUP BY CATEGORY_ID ORDER BY COUNT DESC FETCH FIRST 5 ROWS ONLY) B WHERE B.CATEGORY_ID = CATEGORY.ID', { cid });
  return c.json({ result });
})

app.get('/popularFood/:hour', async (c) => {
  const { hour } = c.req.param();
  const result = await runQuery('SELECT FOOD.NAME, FOOD.PRICE, USERS.ID AS USERS_ID, FOOD.ID AS ID, FIRST_NAME, PROFILE_IMAGE, CHEF_NAME, FOOD.DESCRIPTION, FOOD.FOOD_IMAGE AS FOOD_IMAGE FROM USERS, CHEF, CATEGORY, KITCHEN, FOOD, (SELECT FOOD_ID, COUNT(FOOD_ID) AS COUNT FROM CART WHERE DATE_ADDED >= SYSDATE - :hour/24 GROUP BY FOOD_ID ORDER BY COUNT DESC FETCH FIRST 10 ROWS ONLY) B WHERE B.FOOD_ID = FOOD.ID AND FOOD.CATEGORY_ID = CATEGORY.ID AND CATEGORY.KITCHEN_ID = KITCHEN.ID AND CHEF.ID = KITCHEN.CHEF_ID AND CHEF.USER_ID = USERS.ID', { hour });
  return c.json({ result });
})


app.get('/jwt/isDelivery', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT * FROM DELIVERY_PARTNER WHERE USER_ID = :id AND  VERIFIED = 1', { id });
  if (result !== undefined && result.length)
    return c.json({ status: true });
  return c.json({ status: false });
})

app.get('/jwt/isChef', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT * FROM CHEF,USERS WHERE CHEF.USER_ID = USERS.ID AND USERS.ID = :id', { id });
  if (result !== undefined && result.length)
    return c.json({ status: true });
  return c.json({ status: false });
})

app.get('/jwt/isQa', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id AND APPROVED = 1', { id });
  if (result !== undefined && result.length)
    return c.json({ status: true });
  return c.json({ status: false });
})

app.get('/jwt/isAdmin', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT * FROM USERS WHERE TYPE = \'ADMIN\' AND ID = :id', { id });
  if (result !== undefined && result.length)
    return c.json({ status: true });
  return c.json({ status: false });
})


/**
 * 
 * CREATE TABLE DELIVERY_PARTNER (
    ID VARCHAR2(36) PRIMARY KEY,
    USER_ID VARCHAR2(36) NOT NULL,
    LICENSE VARCHAR2(255) NOT NULL,
    VEHICLE VARCHAR2(255) NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);

CREATE TABLE ORDERS (
    ID VARCHAR2(255) PRIMARY KEY,
    USER_ID VARCHAR2(36) NOT NULL,
    TOTAL NUMBER DEFAULT 0,
    DATE_ADDED DATE DEFAULT SYSDATE,
    DATE_PREPARED DATE,
    DATE_SHIPPED DATE,
    DATE_DELIVERED DATE,
    SHIPPING_ADD VARCHAR2(3255) NOT NULL,
    SHIPPING_PHONE VARCHAR2(255) NOT NULL,
    SHIPPING_NAME VARCHAR2(255) NOT NULL,
    STATUS VARCHAR2(255) DEFAULT 'PAID' NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);

CREATE TABLE ACTIVE_DELIVERY (
    ID VARCHAR2(36) PRIMARY KEY,
    ORDER_ID VARCHAR2(36) NOT NULL,
    DELIVERY_PARTNER_ID VARCHAR2(36) NOT NULL,
    STATUS VARCHAR2(255) DEFAULT 'PENDING' NOT NULL,
    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ID),
    FOREIGN KEY (DELIVERY_PARTNER_ID) REFERENCES USERS(ID)
);
 */

app.post('/jwt/orderDetails', async (c) => {
  const { oid } = await c.req.json<{ oid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  // get delivery partner details as well as users details as well as delivery status together
  // delivert partner details's user id also point the delivery man's personal details
  // get userID, username, Delivery Partner's name, both of their profile images, order details, order status

  const result = await runQuery('SELECT O.ID, O.TOTAL, O.DATE_ADDED, O.DATE_PREPARED, O.DATE_SHIPPED, O.DATE_DELIVERED, O.SHIPPING_ADD, O.SHIPPING_PHONE, O.SHIPPING_NAME, O.STATUS, U.ID AS USER_ID, U.FIRST_NAME, U.LAST_NAME, U.PROFILE_IMAGE, DP.ID AS DELIVERY_ID, DP.LICENSE, DP.VEHICLE, DP.USER_ID AS DELIVERY_USER_ID, DP.PROFILE_IMAGE AS DELIVERY_IMAGE FROM ORDERS O, USERS U, DELIVERY_PARTNER DP, ACTIVE_DELIVERY AD WHERE O.ID = :oid AND O.USER_ID = U.ID AND O.ID = AD.ORDER_ID AND AD.DELIVERY_PARTNER_ID = DP.USER_ID', { oid });
})


app.post('/jwt/chefOrder', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { kid } = await c.req.json<{ kid: string }>()
  console.log(kid)
  const result = await runQuery(`SELECT KI.ID AS KITCHEN_ID,  ORDER_ID, FOOD_NAMES, TOTAL, DATE_ADDED, DATE_SHIPPED, DATE_DELIVERED, SHIPPING_ADD, SHIPPING_PHONE, SHIPPING_NAME, 
    CASE WHEN ORD.STATUS = 'DELIVERED' THEN 'DELIVERED' WHEN ORD.STATUS = 'PREPEARED' THEN 'PREPEARED' WHEN ORD.STATUS = 'SHIPPED' THEN 'SHIPPED' WHEN ORD.STATUS = 'CANCELLED' THEN 'CANCELLED'  ELSE 'PENDING' END AS ORDER_STATUS  FROM (SELECT
    C.DELETED_ID AS ORDER_ID,
    K.ID,
    LISTAGG(F.NAME
            || ' x'
            || C.QUANTITY, ', ') WITHIN GROUP(ORDER BY F.NAME) AS FOOD_NAMES
    
FROM
    CART     C
    JOIN FOOD F
    ON C.FOOD_ID = F.ID
    JOIN CATEGORY CAT
    ON F.CATEGORY_ID = CAT.ID
    JOIN KITCHEN K
    ON CAT.KITCHEN_ID = K.ID
WHERE
    C.DELETED_ID IS NOT NULL
GROUP BY
    C.DELETED_ID,
    K.ID) Q, ORDERS ORD, KITCHEN KI,CHEF, USERS WHERE Q.ID = KI.ID AND CHEF.ID = KI.CHEF_ID AND USERS.ID = CHEF.USER_ID AND Q.ORDER_ID = ORD.ID AND CHEF.USER_ID = :id AND KI.ID = :kid ORDER BY CASE WHEN ORD.STATUS = 'DELIVERED' THEN 1 ELSE 0 END ASC, ORD.DATE_ADDED ASC`, { kid, id })

  return c.json({ result });
})

app.post('/jwt/accptOrderChef', async (c) => {
  const { oid } = await c.req.json<{ oid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('UPDATE ORDERS SET DATE_PREPARED = SYSDATE, STATUS = \'PREPEARED\' WHERE ID = :oid', { oid });
  return c.json({ result });
})




export default {
  port: process.env.PORT,
  fetch: app.fetch,
}