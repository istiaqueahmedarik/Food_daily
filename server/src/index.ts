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
  console.log(payload)
  const result = await runQuery('SELECT * FROM USERS WHERE ID = :id AND EMAIL = :email', { id, email });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.post('/jwt/updateProfileImage', async (c) => {
  const payload = c.get('jwtPayload');
  const { id, email } = payload;
  const { profile_image_url } = await c.req.json<{ profile_image_url: string }>();

  const result = await runQuery('UPDATE USERS SET PROFILE_IMAGE = :profileImage WHERE ID = :id AND EMAIL = :email', { id, email, profileImage: profile_image_url });

  return c.json({ result });
})

/**
 * A chef is a user who applied to become a chef, so it will have a reference of the user id also it has its own chef id
 * 
 * now extra fields are added to the chef table will be
 * speciality: string,
 * experience: number,
 * rating: number,
 * 
 * now the certification table will have the following fields
 * chef_id: string,
 * certification: string,
 * issue_date: string,
 * expiry_date: string,
 * link: string,
 * 
 * first create the chef table and certification table
 * CREATE TABLE CHEF (
 * ID VARCHAR2(36) PRIMARY KEY,
 * USER_ID VARCHAR2(36) NOT NULL,
 * SPECIALITY VARCHAR2(100) NOT NULL,
 * EXPERIENCE NUMBER NOT NULL,
 * RATING NUMBER NOT NULL,
 * FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
 * );
 * 
 * CREATE TABLE CERTIFICATION (
 * ID VARCHAR2(36) PRIMARY KEY,
 * CHEF_ID VARCHAR2(36) NOT NULL,
 * CERTIFICATION VARCHAR2(100) NOT NULL,
 * ISSUE_DATE VARCHAR2(10) NOT NULL,
 * EXPIRY_DATE VARCHAR2(10) NOT NULL,
 * LINK VARCHAR2(100) NOT NULL,
 * FOREIGN KEY (CHEF_ID) REFERENCES CHEF(ID)
 * );
 * 
 */
interface ChefRequest { speciality: string, experience: string, rating: string, [key: string]: string }
app.post('/jwt/applyChef', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const { speciality, experience, rating } = await c.req.json<ChefRequest>()
  const chef_id = uuidv7();
  const result = await runQuery('INSERT INTO CHEF VALUES(:chef_id, :uid, :speciality, :experience, :rating)', { chef_id, uid, speciality, experience, rating });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/chefProfile', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const result = await runQuery('SELECT * FROM CHEF WHERE USER_ID = :uid', { uid });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

interface CertificationRequest { certification: string, issue_date: string, expiry_date: string, link: string, [key: string]: string }
app.post('/jwt/addCertification', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const { certification, issue_date, expiry_date, link } = await c.req.json<CertificationRequest>()
  let result = await runQuery('SELECT * FROM CHEF WHERE USER_ID = :uid', { uid });
  if (result !== undefined && result.length) {
    const chef_id = result[0]['ID'];
    const certification_id = uuidv7();
    result = await runQuery('INSERT INTO CERTIFICATION VALUES(:certification_id, :chef_id, :certification, :issue_date, :expiry_date, :link)', { certification_id, chef_id, certification, issue_date, expiry_date, link });
    if (result !== undefined && result.length)
      return c.json({ result });
  }
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/getCertifications', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const result = await runQuery('SELECT * FROM CHEF C JOIN CERTIFICATION CE ON C.ID = CE.CHEF_ID WHERE C.USER_ID = :uid', { uid });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

/**
 * 
 * kitchen is a place where the chef will work, so it will have a reference of the chef id also it has its own kitchen id, now a chef has to apply for a kitchen and it needs to be approved by the admin so the kitchen table will have the following fields
 * 
 * name: string,
 * address: string,
 * cityCode: number,
 * rating: number,
 * kitchenId: string,
 * chefId: string,
 * approved: boolean,
 * 
 * now kitchen will have certain food items so the food table will have the following fields
 * 
 * name: string,
 * price: number,
 * rating: number,
 * foodId: string,
 * kitchenId: string,
 * 
 * food is contained ingredients so the ingredient table will have the following fields
 * 
 * name: string,
 * quantity: number,
 * ingredientId: string,
 * foodId: string,
 * 
 * first create the kitchen table, food table, and ingredient table
 * 
CREATE TABLE KITCHEN (
    ID VARCHAR2(36) PRIMARY KEY,
    NAME VARCHAR2(100) NOT NULL,
    ADDRESS VARCHAR2(100) NOT NULL,
    CITY_CODE NUMBER NOT NULL,
    RATING NUMBER NOT NULL,
    CHEF_ID VARCHAR2(36) NOT NULL,
    APPROVED NUMBER(1) NOT NULL CHECK (APPROVED IN (0, 1)),
    FOREIGN KEY (CHEF_ID) REFERENCES CHEF(ID)
);
 * 
 * CREATE TABLE FOOD (
 * ID VARCHAR2(36) PRIMARY KEY,
 * NAME VARCHAR2(100) NOT NULL,
 * PRICE NUMBER NOT NULL,
 * RATING NUMBER NOT NULL,
 * KITCHEN_ID VARCHAR2(36) NOT NULL,
 * FOREIGN KEY (KITCHEN_ID) REFERENCES KITCHEN(ID)
 * );
 * 
 * CREATE TABLE INGREDIENT (
 * ID VARCHAR2(36) PRIMARY KEY,
 * NAME VARCHAR2(100) NOT NULL,
 * QUANTITY NUMBER NOT NULL,
 * FOOD_ID VARCHAR2(36) NOT NULL,
 * FOREIGN KEY (FOOD_ID) REFERENCES FOOD(ID)
 * );
 * 
 */

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

app.get('/jwt/getKitchens', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const result = await runQuery('SELECT * FROM KITCHEN WHERE CHEF_ID = (SELECT ID FROM CHEF WHERE USER_ID = :uid)', { uid });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

interface FoodRequest { name: string, price: string, rating: string, [key: string]: string }
app.post('/jwt/addFood', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const { name, price, rating } = await c.req.json<FoodRequest>()
  let result = await runQuery('SELECT * FROM KITCHEN WHERE CHEF_ID = (SELECT ID FROM CHEF WHERE USER_ID = :uid)', { uid });
  if (result !== undefined && result.length) {
    const kitchen_id = result[0]['ID'];
    const food_id = uuidv7();
    result = await runQuery('INSERT INTO FOOD VALUES(:food_id, :name, :price, :rating, :kitchen_id)', { food_id, name, price, rating, kitchen_id });
    if (result !== undefined && result.length)
      return c.json({ result });
  }
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/getFoods', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const result = await runQuery('SELECT * FROM FOOD WHERE KITCHEN_ID = (SELECT ID FROM KITCHEN WHERE CHEF_ID = (SELECT ID FROM CHEF WHERE USER_ID = :uid))', { uid });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

interface IngredientRequest { name: string, quantity: string, [key: string]: string }
app.post('/jwt/addIngredient', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const { name, quantity } = await c.req.json<IngredientRequest>()
  let result = await runQuery('SELECT * FROM FOOD WHERE KITCHEN_ID = (SELECT ID FROM KITCHEN WHERE CHEF_ID = (SELECT ID FROM CHEF WHERE USER_ID = :uid))', { uid });
  if (result !== undefined && result.length) {
    const food_id = result[0]['ID'];
    const ingredient_id = uuidv7();
    result = await runQuery('INSERT INTO INGREDIENT VALUES(:ingredient_id, :name, :quantity, :food_id)', { ingredient_id, name, quantity, food_id });
    if (result !== undefined && result.length)
      return c.json({ result });
  }
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/getIngredients', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const result = await runQuery('SELECT * FROM INGREDIENT WHERE FOOD_ID = (SELECT ID FROM FOOD WHERE KITCHEN_ID = (SELECT ID FROM KITCHEN WHERE CHEF_ID = (SELECT ID FROM CHEF WHERE USER_ID = :uid)))', { uid });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/getAllIngredients', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const result = await runQuery('SELECT * FROM INGREDIENT WHERE FOOD_ID IN (SELECT ID FROM FOOD WHERE KITCHEN_ID IN (SELECT ID FROM KITCHEN WHERE CHEF_ID IN (SELECT ID FROM CHEF WHERE USER_ID = :uid)))', { uid });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/getAllFoods', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const result = await runQuery('SELECT * FROM FOOD WHERE KITCHEN_ID IN (SELECT ID FROM KITCHEN WHERE CHEF_ID IN (SELECT ID FROM CHEF WHERE USER_ID = :uid))', { uid });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/getAllKitchens', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const result = await runQuery('SELECT * FROM KITCHEN WHERE CHEF_ID IN (SELECT ID FROM CHEF WHERE USER_ID = :uid)', { uid });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/getAllChefs', async (c) => {
  const payload = c.get('jwtPayload')
  const { uid, email } = payload
  const result = await runQuery('SELECT * FROM CHEF WHERE USER_ID = :uid', { uid });
  if (result !== undefined && result.length)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})





export default {
  port: process.env.PORT,
  fetch: app.fetch,
} 