import { Hono } from 'hono/quick'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import * as dotenv from 'dotenv'
import { runCursorQuery, runQuery } from '../db/connect/oracle'
import { uuidv7 } from 'uuidv7'
import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'
import { createBunWebSocket } from 'hono/bun'
var jwt_ = require('jsonwebtoken');
dotenv.config()
const SSLCommerzPayment = require('sslcommerz-lts')
const { upgradeWebSocket, websocket } = createBunWebSocket();



type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()
app.use(prettyJSON())
app.use('/*', cors())


let conversationId = '';
let clients: any = {};
const checkConnection = (a: any, b: any) => {
  return `Connection is ${a} and ${b}`;
}

const saveMessage = async (message: any, user1: any, user2: any, ws: any) => {
  // const conversationId = '123';
  // const messageId = '123';
  // const senderId = user1;
  // const dateAdded = new Date();
  // const query = `INSERT INTO MESSAGES (MESSAGE_ID,CONVERSATION_ID,SENDER_ID,MESSAGE,DATE_ADDED) VALUES (:messageId,:conversationId,:senderId,:message,:dateAdded)`;
  const data = JSON.parse(message);
  const messageText = data.CONTENT;
  const senderId = data.SENDER;
  const query = `BEGIN SEND_MESSAGE(:conversationId, :senderId,:messageText); END;`;

  const res = await runQuery(query, { conversationId, senderId, messageText });

  let mn: string = "";
  let mx: string = "";
  if (user1 < user2) {
    mn = user1;
    mx = user2;
  }
  else {
    mn = user2;
    mx = user1;
  }

  for (let i = 0; i < clients[mn + '_' + mx].length; i++) {
    clients[mn + '_' + mx][i].send(JSON.stringify(data));
  }
}

app.get('/', (c) => {
  return c.text('WebSocket chat server is running.');
});



app.get(
  '/ws/:user1/:user2',
  upgradeWebSocket((c) => {
    return {
      onOpen: async (_event, ws) => {

        const { user1, user2 } = c.req.param();


        let mn: string = "";
        let mx: string = "";
        if (user1 < user2) {
          mn = user1;
          mx = user2;
        }
        else {
          mn = user2;
          mx = user1;
        }

        // push all the ws to {mn,mx}
        if (!clients[mn + '_' + mx]) {
          clients[mn + '_' + mx] = [];
        }
        clients[mn + '_' + mx].push(ws);


        const c_ = await runCursorQuery(`BEGIN GET_CONVERSATIONS(:mn, :mx, :cursor); END;`, { mn, mx });
        if (c_.length > 0) {
          conversationId = c_[0].CONVERSATION_ID;
        }
        else {
          await runQuery(`INSERT INTO CONVERSATIONS (USER_ID,DELIVERY_PARTNER_ID) VALUES (:mn,:mx)`, { mn, mx });
          const res = await runQuery(`SELECT * FROM CONVERSATIONS WHERE USER_ID = :mn AND DELIVERY_PARTNER_ID = :mx`, { mn, mx });
          conversationId = res[0].CONVERSATION_ID;
        }

        const res = await runCursorQuery(`BEGIN GET_CONVERSATION_MESSAGES(:mn, :mx, :conversationId, :cursor); END;`, { mn, mx, conversationId });

        ws.send(JSON.stringify(res));
      },
      onMessage: async (event, ws) => {
        const { user1, user2 } = c.req.param();

        await saveMessage(event.data, user1, user2, ws);
        // const msg = checkConnection(user1, user2);
      },
      onClose(event, ws) {
        const { user1, user2 } = c.req.param();
        let mn: string = "";
        let mx: string = "";
        if (user1 < user2) {
          mn = user1;
          mx = user2;
        }
        else {
          mn = user2;
          mx = user1;
        }

        clients[mn + '_' + mx] = clients[mn + '_' + mx].filter((client: any) => client !== ws);


      },
    }
  })
)

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
  // const result = await runQuery('SELECT * FROM PING', {});
  // if (result !== undefined && result.length)
  //   return c.text(result[0]['COLUMN1'] + ' (from Oracle)');
  const result = await runCursorQuery('BEGIN GET_ALL_USERS(:cursor); END;', {});
  if (result !== undefined && result.length)
    return c.json(result);
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
      const result = await runQuery(`BEGIN REGISTER_USER(:firstName, :lastName, TO_DATE(:formattedDob, 'YYYY-MM-DD'), :address, :mobile, :cityCode, :email, :password, :type); END;`, { firstName, lastName, formattedDob, address, mobile: mobileNumber, cityCode, email, password, type: 'USER' });
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
  // const result = await runQuery('SELECT * FROM USERS WHERE EMAIL = :email AND PASSWORD = :password', { email, password });
  const result = await runCursorQuery('BEGIN GET_USER_WITH_PASSWORD(:email, :password, :cursor); END;', { email, password });
  if (result !== undefined && result.length) {
    const token = jwt_.sign({ id: result[0]['ID'], email: result[0]['EMAIL'] }, process.env.JWT_SECRET)
    return c.json({ result, token });
  }
  return c.json({ error: 'Invalid Credentials' });
})


app.get('/jwt/Profile', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload

  const result = await runCursorQuery('BEGIN GET_USER_DETAILS(:id, :email, :cursor); END;', { id, email });
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
  const result = await runQuery('BEGIN UPDATE_USER(:id ,:email,:firstName,:lastName,TO_DATE(:formattedDob, \'YYYY-MM-DD\'), :address, :mobileNumber, :cityCode); END;', { id, email, firstName, lastName, formattedDob, address, mobileNumber, cityCode });
  return c.json({ result });
})

app.post('/jwt/updateProfileImage', async (c) => {
  const payload = c.get('jwtPayload');
  const { id, email } = payload;
  const { profile_image_url } = await c.req.json<{ profile_image_url: string }>();

  const result = await runQuery(`BEGIN UPDATE_PROFILE_IMAGE(:id,:email,:profileImage); END;`, { id, email, profileImage: profile_image_url });

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
  const result = await runQuery('BEGIN REGISTER_CHEF(:id,:name,:speciality, :experience); END;', { id, name, speciality, experience });
  if (result !== undefined)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/getChef', async (c) => {
  const payload = c.get('jwtPayload')
  const { id } = payload
  const result = await runQuery('SELECT NAME, CHEF.CHEF_NAME, DOB, ADDRESS, MOBILE, CITY_CODE, EMAIL,  PROFILE_IMAGE, CHEF.ID AS CHEF_ID, SPECIALITY FROM USERS ,CHEF WHERE USERS.ID = CHEF.USER_ID AND CHEF.USER_ID = :id', { id });
  if (result !== undefined)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/jwt/chefDetails', async (c) => {
  const payload = c.get('jwtPayload')
  const { id } = payload

  const result = await runCursorQuery('BEGIN GET_USER_CHEF_KITCHEN_DETAILS(:id,:cursor); END;', { id })

  if (result !== undefined)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/getChefOfKitchen/:kid', async (c) => {
  const { kid } = c.req.param();
  const result = await runQuery('SELECT * FROM CHEF WHERE ID = (SELECT CHEF_ID FROM KITCHEN WHERE ID = :kid)', { kid });
  if (result !== undefined)
    return c.json({ result });
  return c.json({ error: 'Invalid Token' });
})

app.get('/getChef/:cid', async (c) => {
  const { cid } = c.req.param();

  const result = await runCursorQuery('BEGIN GET_CHEF_DETAILS(:cid, :cursor); END;', { cid });

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
    await runQuery('BEGIN REGISTER_KITCHEN(:KICHEN_NAME, :KITCHEN_ADDRESS, :KITCHEN_CITY_NAME, :chefId); END;', { KICHEN_NAME, KITCHEN_ADDRESS, KITCHEN_CITY_NAME, chefId });
    return c.json({ message: 'Kitchen Added' });
  } catch (error) {
    return c.json({ error });
  }
})

app.post('/jwt/deleteKitchen', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { kitchenId } = await c.req.json<{ kitchenId: string }>()
  await runQuery('BEGIN DELETE_KITCHEN(:kitchenId); END;', { kitchenId });
  return c.json({ message: 'Kitchen Deleted' });
})

app.post('/jwt/editKitchen', async (c) => {
  const { id, email } = c.get('jwtPayload')
  const { kitchenId, KICHEN_NAME, KITCHEN_ADDRESS, KITCHEN_CITY_NAME } = await c.req.json<{ kitchenId: string, KICHEN_NAME: string, KITCHEN_ADDRESS: string, KITCHEN_CITY_NAME: string }>()

  try {
    await runQuery('BEGIN UPDATE_KITCHEN(:KICHEN_NAME, :KITCHEN_ADDRESS, :KITCHEN_CITY_NAME, :kitchenId); END;', { KICHEN_NAME, KITCHEN_ADDRESS, KITCHEN_CITY_NAME, kitchenId });
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
    await runQuery('BEGIN ADD_KITCHEN_IMAGE(:kitchenId, :image); END;', { kitchenId, image });
    return c.json({ message: 'Image Added' });
  } catch (error) {
    return c.json({ error });
  }

})

app.post('/getKitchen', async (c) => {
  let { kitchenId } = await c.req.json<{ kitchenId: string }>()
  kitchenId = kitchenId.toUpperCase();


  const result = await runCursorQuery('BEGIN GET_KITCHEN_DETAILS(:kitchenId,:cursor); END;', { kitchenId });
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
  const result = await runQuery('BEGIN DELETE_KITCHEN_IMAGE(:imageId); END;', { imageId });
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
      result = await runQuery('BEGIN ADD_CERTIFICATION(:chef_id, :name, TO_DATE(:f_issue_date, \'YYYY-MM-DD\'), :link,:certification); END;', { chef_id, certification, f_issue_date, link, name })
    }
    else {
      result = await runQuery('BEGIN ADD_CERTIFICATION_WITH_EXPIRY(:chef_id, :name, TO_DATE(:f_issue_date, \'YYYY-MM-DD\'), TO_DATE(:f_expiry_date, \'YYYY-MM-DD\'), :link,:certification); END;', { chef_id, certification, f_issue_date, f_expiry_date, link, name })
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


app.post('/jwt/approveKitchen', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { kitchen_id } = await c.req.json<{ st: number, kitchen_id: string }>()
  const user = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (user[0]['APPROVED'] !== 1)
    return c.json({ error: 'Invalid Token' });
  const result = await runQuery('BEGIN APPROVE_KITCHEN(:kitchen_id); END;', { kitchen_id });
  return c.json({ result });

})

app.post('/jwt/disapproveKitchen', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { kitchen_id } = await c.req.json<{ st: number, kitchen_id: string }>()
  const user = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (user[0]['APPROVED'] !== 1)
    return c.json({ error: 'Invalid Token' });

  const result = await runQuery('BEGIN DELETE_KITCHEN_WITH_IMAGES(:kitchen_id); END;', { kitchen_id });
  return c.json({ result });
})



app.post('/jwt/approveDelivery', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { delivery_id } = await c.req.json<{ st: number, delivery_id: string }>()
  const user = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (user[0]['APPROVED'] !== 1)
    return c.json({ error: 'Invalid Token' });
  const result = await runQuery('BEGIN VERIFY_DELIVERY_PARTNER(:delivery_id); END;', { delivery_id });
  return c.json({ result });

})

app.post('/jwt/disapproveDelivery', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { delivery_id } = await c.req.json<{ st: number, delivery_id: string }>()
  const user = await runQuery('SELECT * FROM QA_OFFICER WHERE USER_ID = :id', { id });
  if (user[0]['APPROVED'] !== 1)
    return c.json({ error: 'Invalid Token' });

  const result = await runQuery('BEGIN DELETE_DELIVERY_PARTNER(:delivery_id); END;', { delivery_id });
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
  const result = await runQuery('SELECT USERS.ID AS USER_ID, DELIVERY_PARTNER.ID AS DELIVERY_ID, LICENSE, VEHICLE, NAME FROM DELIVERY_PARTNER,USERS WHERE USERS.ID = DELIVERY_PARTNER.USER_ID AND VERIFIED = 0', {});

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
  let result = await runQuery('BEGIN ADD_QA_OFFICER(:id, :ACADEMIC_QUALIFICATION, :CV_LINK); END;', { id, ACADEMIC_QUALIFICATION, CV_LINK });
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
    const result = await runQuery('BEGIN APPROVE_QA_OFFICER(:qa_id); END;', { qa_id });

    return c.json({ result });
  }
  else {
    const result = await runQuery('BEGIN DELETE_QA_OFFICER(:qa_id); END;', { qa_id });
    return c.json({ result });
  }
})


interface FoodRequest { kitchen_id: string, category_id: string, name: string, foodImage: string, description: string, price: string, image: string, [key: string]: string }
app.post('/jwt/addDish', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const { kitchen_id, category_id, name, description, price, image } = await c.req.json<FoodRequest>()

  const check = await runQuery('SELECT * FROM KITCHEN,USERS, CHEF WHERE KITCHEN.ID = :kitchen_id AND :id = CHEF.USER_ID AND KITCHEN.CHEF_ID = CHEF.ID', { id, kitchen_id });
  if (check === undefined || check.length === 0)
    return c.json({ error: 'Invalid Token' });
  const result = await runQuery('BEGIN ADD_FOOD(:name, :description, :price, :category_id, :image); END;', { name, description, price, category_id, image });

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


interface CategoryRequest { name: string, description: string, category_image: string, kitchen_id: string, [key: string]: string }
app.post('/jwt/addCategory', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { name, description, category_image, kitchen_id } = await c.req.json<CategoryRequest>()

  const check = await runQuery('SELECT * FROM KITCHEN,USERS, CHEF WHERE KITCHEN.ID = :kitchen_id AND :id = CHEF.USER_ID AND KITCHEN.CHEF_ID = CHEF.ID', { id, kitchen_id });
  if (check === undefined || check.length === 0)
    return c.json({ error: 'Invalid Token' });
  const result = await runQuery('BEGIN ADD_CATEGORY(:kitchen_id, :name, :description, :category_image); END;', { kitchen_id, name, description, category_image });
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

interface IngredientRequest { food_id: string, name: string, quantity: string, calories: string }
app.post('/jwt/addIngredient', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { food_id, name, quantity, calories } = await c.req.json<IngredientRequest>()


  const result = await runQuery('BEGIN ADD_INGREDIENT(:food_id, :name, :quantity, :calories); END;', { food_id, name, quantity, calories });
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

  const result = await runQuery('BEGIN DELETE_INGREDIENT(:iid); END;', { iid });
  return c.json({ result });
})


interface CartRequest { food_id: string, quantity: string }
app.post('/jwt/addToCart', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { food_id, quantity } = await c.req.json<CartRequest>()
  const result = await runQuery('BEGIN ADD_TO_CART(:id, :food_id, :quantity); END;', { id, food_id, quantity });
  return c.json({ result });
})
function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}
app.post('/jwt/addToCartScheduled', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { kid, fid, orders } = await c.req.json<{ kid: string, fid: string, orders: any[] }>()

  for (let i = 0; i < orders.length; i++) {
    const dt = orders[i].date;
    const quantity = orders[i].quantity;
    const time = orders[i].time;
    const combineDate = dt + ' ' + time;
    const converted = formatDate(new Date(combineDate));

    await runQuery('BEGIN ADD_TO_CART_SCHEDULED(:id, :fid, :quantity, TO_DATE(:converted, \'DD-MM-YYYY HH24:MI:SS\')); END;', { id, fid, quantity, converted });
  }
  return c.json({ result: 'ok' });
})

app.post('/jwt/deleteFromCart', async (c) => {
  const { cart_id } = await c.req.json<{ cart_id: string }>()

  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('BEGIN DELETE_FROM_CART(:id ,:cart_id); END;', { id, cart_id });
  return c.json({ result });
})

app.get('/jwt/getCart', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT CART.ID AS CART_ID,  FOOD.ID, FOOD.NAME, CART.QUANTITY, DATE_ADDED, FOOD.DESCRIPTION, FOOD.PRICE, FOOD_IMAGE FROM CART,FOOD WHERE USER_ID = :id AND CART.FOOD_ID = FOOD.ID AND CART.DELETED = 0', { id });
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
  const result = await runQuery("SELECT * FROM ( SELECT C.DELETED_ID, K.ID, GET_FOOD_NAMES(C.DELETED_ID) AS FOOD_NAMES FROM CART C JOIN FOOD F   ON C.FOOD_ID = F.ID JOIN CATEGORY CAT ON F.CATEGORY_ID = CAT.ID JOIN KITCHEN K             ON CAT.KITCHEN_ID = K.ID WHERE C.DELETED_ID IS NOT NULL GROUP BY C.DELETED_ID, K.ID )      Q, ORDERS O, KITCHEN KI WHERE KI.ID = Q.ID AND Q.DELETED_ID = O.ID AND O.STATUS = 'PREPEARED' AND O.DATE_SHIPPED IS NULL  AND O.DATE_PREPARED IS NOT NULL   AND O.DATE_DELIVERED IS NULL AND O.DATE_ADDED <= SYSDATE ORDER BY O.DATE_ADDED", {});
  return c.json({ result });
})


app.get('/jwt/activeOrders', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery("SELECT * FROM ( SELECT C.DELETED_ID, K.ID, GET_FOOD_NAMES(C.DELETED_ID) AS FOOD_NAMES FROM CART C JOIN FOOD F   ON C.FOOD_ID = F.ID JOIN CATEGORY CAT ON F.CATEGORY_ID = CAT.ID JOIN KITCHEN K             ON CAT.KITCHEN_ID = K.ID WHERE C.DELETED_ID IS NOT NULL GROUP BY C.DELETED_ID, K.ID )      Q, ORDERS O, KITCHEN KI,     ACTIVE_DELIVERY ACD WHERE ACD.DELIVERY_PARTNER_ID = :id AND ACD.ORDER_ID = O.ID AND KI.ID = Q.ID AND Q.DELETED_ID = O.ID AND O.STATUS = 'SHIPPED' AND O.DATE_DELIVERED IS NULL AND O.DATE_ADDED <= SYSDATE ORDER BY O.DATE_ADDED", { id });
  return c.json({ result });
})




app.get('/jwt/orderHistory', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery("SELECT * FROM ( SELECT C.DELETED_ID, K.ID, GET_FOOD_NAMES(C.DELETED_ID) AS FOOD_NAMES FROM CART C JOIN FOOD F   ON C.FOOD_ID = F.ID JOIN CATEGORY CAT ON F.CATEGORY_ID = CAT.ID JOIN KITCHEN K             ON CAT.KITCHEN_ID = K.ID WHERE C.DELETED_ID IS NOT NULL GROUP BY C.DELETED_ID, K.ID )      Q, ORDERS O, KITCHEN KI,     ACTIVE_DELIVERY ACD WHERE ACD.DELIVERY_PARTNER_ID = :id AND ACD.ORDER_ID = O.ID AND KI.ID = Q.ID AND Q.DELETED_ID = O.ID AND O.STATUS = 'DELIVERED' ORDER BY O.DATE_ADDED DESC", { id });
  return c.json({ result });

})



app.post('/jwt/acceptOrder', async (c) => {
  const { oid } = await c.req.json<{ oid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload;

  const result = await runQuery("BEGIN SHIP_ORDER(:oid, :id); END;", { oid, id });

  return c.json({ result });
})



app.post('/jwt/completeOrder', async (c) => {
  const { oid } = await c.req.json<{ oid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery("BEGIN DELIVER_ORDER(:oid); END;", { oid });
  return c.json({ result });
})

app.post('/jwt/cancelOrder', async (c) => {
  const { oid } = await c.req.json<{ oid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery("BEGIN CANCEL_ORDER(:oid); END;", { oid });
  return c.json({ result });
})

app.get('/jwt/deliverySummary', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload


  const totalOrder = await runQuery('SELECT COUNT(*) AS TOTAL_ORDER FROM ORDERS, ACTIVE_DELIVERY WHERE ORDERS.STATUS = \'DELIVERED\' AND ACTIVE_DELIVERY.DELIVERY_PARTNER_ID = :id AND ACTIVE_DELIVERY.ORDER_ID = ORDERS.ID', { id });

  const totalSold = await runQuery('SELECT COALESCE(SUM(TOTAL),0) AS TOTAL_SOLD FROM ORDERS, ACTIVE_DELIVERY WHERE ORDERS.STATUS = \'DELIVERED\' AND ACTIVE_DELIVERY.DELIVERY_PARTNER_ID = :id AND ACTIVE_DELIVERY.ORDER_ID = ORDERS.ID', { id });

  const totalEarning = await runQuery(`
    SELECT COALESCE(SUM(TOTAL*AMOUNT),0) AS TOTAL_EARNING FROM
    ORDERS,
    ACTIVE_DELIVERY,
    DELIVERY_COMMISION,
    DELIVERY_PARTNER
    WHERE ORDERS.STATUS = \'DELIVERED\'
    AND ACTIVE_DELIVERY.DELIVERY_PARTNER_ID = DELIVERY_PARTNER.USER_ID
    AND DELIVERY_COMMISION.DELIVERY_PARTNER_ID = DELIVERY_PARTNER.ID
    AND DELIVERY_PARTNER.USER_ID = :ID
    AND ACTIVE_DELIVERY.ORDER_ID = ORDERS.ID
  `, { id });
  const avgDeliveryTime = await runQuery('SELECT AVG(DATE_DELIVERED - DATE_SHIPPED) AS AVG_DELIVERY_TIME FROM ORDERS, ACTIVE_DELIVERY WHERE ORDERS.STATUS = \'DELIVERED\' AND ACTIVE_DELIVERY.DELIVERY_PARTNER_ID = :id AND ACTIVE_DELIVERY.ORDER_ID = ORDERS.ID', { id });


  return c.json({ totalOrder, totalSold, totalEarning, avgDeliveryTime });

})


app.get('/jwt/earningByDay/:days', async (c) => {
  const { days } = c.req.param();
  const payload = c.get('jwtPayload')
  const { id, email } = payload

  const result = await runCursorQuery('BEGIN GET_TOTAL_EARNINGS_BY_DELIVERY_PARTNER(:id, :days, :cursor); END;', { id, days });
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

    await runQuery('BEGIN CHECKOUT(:ord_id, :id, :ammount, :address, :mobile,:name); END;', { ord_id, id, ammount, address, mobile, name });

    return c.redirect('http://localhost:3000/success_payment');

  }
  return c.json({ res });

})


app.post('/jwt/applyDelivery', async (c) => {
  const { license, vehicle } = await c.req.json<{ license: string, vehicle: string }>();
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('BEGIN REGISTER_DELIVERY_PARTNER(:id, :license, :vehicle); END;', { id, license, vehicle });
  return c.json({ result });
})

app.post('/jwt/getDelivery', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('SELECT D.ID, D.LICENSE, D.VEHICLE, U.NAME.FIRST_NAME, U.NAME.LAST_NAME, U.ADDRESS, U.MOBILE, U.CITY_CODE, U.EMAIL, U.PROFILE_IMAGE  FROM DELIVERY_PARTNER  D,USERS U WHERE USER_ID = :id AND USER_ID = U.ID', { id });
  return c.json({ result });
})


interface SearchRequest { search: string, city: string, chef: string, kitchen: string, price: string, rating: string, sort: string, page: string }
app.post('/search', async (c) => {
  const { search, city, chef, kitchen, price, rating, sort, page } = await c.req.json<SearchRequest>();


  const searchVals = search ? search.split(' ') : [];
  const cityVals = city ? city.split(',') : [];
  const chefVals = chef ? chef.split(',') : [];
  const kitchenVals = kitchen ? kitchen.split(',') : [];
  let query = 'SELECT  FOOD.ID AS FOOD_ID, CHEF.ID AS CHEF_ID, CHEF_NAME, KITCHEN.ID AS KITCHEN_ID, FOOD.NAME,FOOD.PRICE,  COALESCE(FOOD_RATING.RATING,0) as RATING, FOOD.FOOD_IMAGE, KITCHEN.CITY_NAME, KITCHEN.NAME AS KITCHEN_NAME, CATEGORY.NAME AS CATEGORY_NAME, U.PROFILE_IMAGE FROM FOOD, KITCHEN, CATEGORY, CHEF, USERS U, FOOD_RATING WHERE FOOD_RATING.FOOD_ID(+) = FOOD.ID AND  FOOD.CATEGORY_ID = CATEGORY.ID AND CATEGORY.KITCHEN_ID = KITCHEN.ID AND KITCHEN.APPROVED = 1 AND KITCHEN.CHEF_ID = CHEF.ID AND CHEF.USER_ID = U.ID  :where';


  let where = '';
  if (searchVals.length > 0) {

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
    where += ` AND ( CHEF.CHEF_NAME = :chef0`;
    for (let i = 1; i < chefVals.length; i++) {
      where += ` OR CHEF.CHEF_NAME = :chef${i}`;
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


interface RatingRequest { food_id: string, rating: string, review: string }
app.post('/jwt/addRating', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { food_id, rating, review } = await c.req.json<RatingRequest>();
  const already = await runQuery('SELECT * FROM FOOD_RATING WHERE FOOD_ID = :food_id AND USER_ID = :id', { food_id, id });
  if (already !== undefined && already.length) {
    const result = await runQuery('BEGIN RATE_FOOD(:food_id, :id, :rating, :review); END;', { food_id, id, rating, review });
    return c.json({ result });
  }
  const result = await runQuery('BEGIN RATE_FOOD_NEW(:food_id, :id, :rating, :review); END;', { food_id, id, rating, review });
  return c.json({ result });
})

app.get('/getRating/:fid', async (c) => {
  const { fid } = c.req.param();
  const result = await runQuery('SELECT FOOD_ID, USER_ID, RATING, REVIEW, NAME FROM FOOD_RATING, USERS WHERE FOOD_ID = :fid AND USERS.ID = FOOD_RATING.USER_ID ORDER BY DATE_ADDED', { fid });
  return c.json({ result });
})

app.post('/jwt/deleteRating', async (c) => {
  const { rid } = await c.req.json<{ rid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('BEGIN DELETE_FOOD_RATING(:rid); END;', { rid });
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
  const result = await runCursorQuery('BEGIN GET_TOP_FOOD_ITEMS_BY_CHEF(:cid, :cursor); END;', { cid });
  return c.json({ result });
})

app.get('/bestFoodCategory/:cid', async (c) => {
  const { cid } = c.req.param();
  const result = await runCursorQuery('BEGIN GET_TOP_CATEGORIES_BY_CHEF(:cid, :cursor); END;', { cid });
  return c.json({ result });
})

app.get('/popularFood/:hour', async (c) => {
  const { hour } = c.req.param();
  const result = await runCursorQuery('BEGIN GET_TOP_FOOD_ITEMS(:hour, :cursor); END;', { hour });
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


app.post('/jwt/orderDetails', async (c) => {
  const { oid } = await c.req.json<{ oid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload

  const result = await runCursorQuery('BEGIN GET_ORDER_DETAILS(:oid, :cursor); END;', { oid });

  return c.json({ result });
})


app.post('/jwt/orderDetailsConnection', async (c) => {
  const { oid } = await c.req.json<{ oid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload

  const delivery = await runQuery('SELECT USERS.ID, USERS.CITY_CODE, USERS.MOBILE, USERS.NAME, USERS.PROFILE_IMAGE FROM ACTIVE_DELIVERY,USERS WHERE ORDER_ID = :oid AND USERS.ID = ACTIVE_DELIVERY.DELIVERY_PARTNER_ID', { oid });
  const user = await runQuery('SELECT USERS.ID, USERS.CITY_CODE, USERS.MOBILE, USERS.NAME, USERS.PROFILE_IMAGE FROM USERS,ORDERS WHERE USERS.ID = ORDERS.USER_ID AND ORDERS.ID = :oid', { oid });

  if (delivery.length === 0 || user.length === 0)
    return c.json({ status: false });
  let type = 'user';
  if (delivery[0]['ID'] === id)
    type = 'delivery';

  return c.json({ delivery, user, type });
})




app.post('/jwt/chefOrder', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { kid } = await c.req.json<{ kid: string }>()


  const result = await runCursorQuery('BEGIN GET_ORDER_DETAILS_BY_CHEF_AND_KITCHEN(:kid, :id, :cursor); END;', { kid, id });

  return c.json({ result });
})

app.post('/jwt/accptOrderChef', async (c) => {
  const { oid } = await c.req.json<{ oid: string }>()
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const result = await runQuery('BEGIN PREPARE_ORDER(:oid); END;', { oid });
  return c.json({ result });
})

app.post('/jwt/orderHistory', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload

  const result = await runCursorQuery('BEGIN GET_ORDER_DETAILS_BY_USER_ID(:id, :cursor); END;', { id });
  return c.json({ result });
})

app.post('/jwt/PersonalCancelOrder', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload
  const { oid } = await c.req.json<{ oid: string }>()
  const result = await runQuery('BEGIN CANCEL_ORDER_USER(:oid, :id); END;', { oid, id });
  return c.json({ result });
})


app.get('/jwt/logs', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const user = await runQuery('SELECT * FROM USERS WHERE ID = :id', { id });
  if (user.length === 0)
    return c.json({ status: false });
  const result = await runQuery('SELECT * FROM LOGS ORDER BY LOG_TIMESTAMP DESC', {});

  return c.json({ result });
})

app.get('/jwt/getTables', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const user = await runQuery('SELECT * FROM USERS WHERE ID = :id', { id });
  if (user.length === 0)
    return c.json({ status: false });

  const result = await runCursorQuery('BEGIN GET_TABLE_COLUMNS(:cursor); END;', {});
  return c.json({ result });
})

app.post('/jwt/runQuery', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  if (isAdmin.length === 0)
    return c.json({ result: [] });
  let { query } = await c.req.json<{ query: string }>();
  if (query.endsWith(';'))
    query = query.slice(0, -1);
  if (query.includes('INSERT') || query.includes('UPDATE') || query.includes('DELETE') || query.includes('ADMIN') || query.includes('DROP') || query.includes('TRUNCATE') || query.includes('ALTER') || query.includes('GRANT') || query.includes('REVOKE'))
    return c.json({ error: 'Invalid Query' });

  try {
    const startTime = Date.now();
    const result = await runQuery(query, {});
    const endTime = Date.now();
    const time = endTime - startTime;
    return c.json({ result, time });
  } catch (e) {

    return c.json({ error: (e as Error).message || e });
  }
})

app.post('/jwt/addReport', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const { report, fid } = await c.req.json<{ report: string, fid: string }>();
  const result = await runQuery('BEGIN ADD_REPORT_FOOD(:fid, :id, :report); END;', { fid, id, report });
  return c.json({ result });
})


app.get('/jwt/getReport', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const result = await runQuery('SELECT REPORT_FOOD.ID AS REPORT_FOOD_ID, USERS.ID, USERS.EMAIL, USERS.NAME, REPORT_FOOD.FOOD_ID, REPORT_FOOD.REASON, REPORT_FOOD.STATUS FROM REPORT_FOOD, USERS WHERE USERS.ID = REPORT_FOOD.USER_ID ORDER BY DATE_ADDED DESC ', {});
  return c.json({ result });
})


app.post('/jwt/investigateReport', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const { rid } = await c.req.json<{ rid: string }>();
  const result = await runQuery('BEGIN REPORT_UNDER_REVIEW(:rid); END;', { rid });
  return c.json({ result });
})

app.post('/jwt/resolveReport', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const { rid } = await c.req.json<{ rid: string }>();
  const result = await runQuery('BEGIN REPORT_RESOLVED(:rid); END;', { rid });
  return c.json({ result });
})

app.get('/jwt/allSummary', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  if (isAdmin.length === 0)
    return c.json({ result: [] });
  const response = {
    count_user: 0,
    count_chef: 0,
    total_order: 0,
    revenue: 0
  }
  let res = await runQuery('SELECT COUNT(*) AS COUNT_USER FROM USERS', {});
  response.count_user = res[0]['COUNT_USER'];
  res = await runQuery('SELECT COUNT(*) AS COUNT_CHEF FROM CHEF', {});
  response.count_chef = res[0]['COUNT_CHEF'];
  res = await runQuery('SELECT COUNT(*) AS TOTAL_ORDER FROM ORDERS', {});
  response.total_order = res[0]['TOTAL_ORDER'];
  res = await runQuery('SELECT COALESCE(SUM(TOTAL),0) AS REVENUE FROM ORDERS', {});
  response.revenue = res[0]['REVENUE'];
  return c.json(response);
})

app.get('/jwt/orderStatusSummary', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  if (isAdmin.length === 0)
    return c.json({ result: [] });
  const orderData = [
    { name: 'Pending', value: 15 },
    { name: 'Preparing', value: 10 },
    { name: 'Shipped', value: 5 },
    { name: 'Delivered', value: 70 },
  ]

  let res = await runQuery('SELECT COUNT(*) AS PENDING FROM ORDERS WHERE STATUS = \'PENDING\'', {});
  orderData[0].value = res[0]['PENDING'];
  res = await runQuery('SELECT COUNT(*) AS SHIPPED FROM ORDERS WHERE STATUS = \'SHIPPED\'', {});
  orderData[2].value = res[0]['SHIPPED'];
  res = await runQuery('SELECT COUNT(*) AS DELIVERED FROM ORDERS WHERE STATUS = \'DELIVERED\'', {});
  orderData[3].value = res[0]['DELIVERED'];
  res = await runQuery('SELECT COUNT(*) AS PREPEARING FROM ORDERS WHERE STATUS = \'PREPEARED\'', {});
  orderData[1].value = res[0]['PREPEARING'];
  return c.json(orderData);
})



app.get('/jwt/orderGrowth', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  if (isAdmin.length === 0)
    return c.json({ result: [] });
  const orderData = await runQuery('SELECT COUNT(*) AS COUNT, TRUNC(DATE_ADDED) AS DAY FROM ORDERS GROUP BY TRUNC(DATE_ADDED) ORDER BY TRUNC(DATE_ADDED)', {});
  return c.json(orderData);
})


app.get('/jwt/allChefs', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  if (isAdmin.length === 0)
    return c.json({ result: [] });
  const result = await runQuery('SELECT CHEF.ID,CHEF_NAME AS NAME, SPECIALITY, GET_RATING_CHEF(CHEF.ID) AS RATING, STATUS FROM CHEF,USERS WHERE USERS.ID = CHEF.USER_ID', {});

  return c.json({ result });
})

app.post('/jwt/banChef', async (c) => {
  const { cid } = await c.req.json<{ cid: string }>();
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  if (isAdmin.length === 0)
    return c.json({ result: [] });
  const result = await runQuery('BEGIN BAN_CHEF(:cid); END;', { cid });
  return c.json(result);
})

app.post('/jwt/unbanChef', async (c) => {
  const { cid } = await c.req.json<{ cid: string }>();
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  if (isAdmin.length === 0)
    return c.json({ result: [] });
  const result = await runQuery('BEGIN UNBAN_CHEF(:cid); END;', { cid });
  return c.json(result);
})


app.get('/jwt/allAdmin', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;
  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  if (isAdmin.length === 0)
    return c.json([]);
  const result = await runQuery('SELECT ID, EMAIL, REGISTERED FROM USERS WHERE TYPE = \'ADMIN\'', {});
  return c.json(result);
})


app.get('/jwt/allDeliveryPartner', async (c) => {
  const payload = c.get('jwtPayload')
  const { id, email } = payload;

  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  if (isAdmin.length === 0)
    return c.json([]);
  const result = await runQuery('SELECT DELIVERY_PARTNER.ID, EMAIL, VERIFIED FROM USERS,DELIVERY_PARTNER WHERE USERS.ID = DELIVERY_PARTNER.USER_ID', {});

  return c.json(result);
})

app.post('/jwt/banDelivery', async (c) => {
  const { did } = await c.req.json<{ did: string }>();

  const payload = c.get('jwtPayload')
  const { id, email } = payload;

  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  if (isAdmin.length === 0)
    return c.json({ result: [] });
  const result = await runQuery('BEGIN BAN_DELIVERY_PARTNER(:did); END;', { did });
  return c.json(result);
})

app.post('/jwt/unbanDelivery', async (c) => {
  const { did } = await c.req.json<{ did: string }>();
  const payload = c.get('jwtPayload')
  const { id, email } = payload;

  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  if (isAdmin.length === 0)
    return c.json({ result: [] });
  const result = await runQuery('BEGIN UNBAN_DELIVERY_PARTNER(:did); END;', { did });
  return c.json(result);
})




app.post('/jwt/addAdmin', async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = payload;
  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  const { email } = await c.req.json<{ email: string }>();
  if (isAdmin.length === 0)
    return c.json({ status: false });
  const result = await runQuery('BEGIN MAKE_ADMIN(:email); END;', { email });
  return c.json({ result });
})

app.post('/jwt/removeAdmin', async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = payload;
  const isAdmin = await runQuery('SELECT * FROM USERS WHERE ID = :id AND TYPE = \'ADMIN\'', { id });
  const { email } = await c.req.json<{ email: string }>();
  if (isAdmin.length === 0)
    return c.json({ status: false });
  const result = await runQuery('BEGIN REMOVE_ADMIN(:email); END;', { email });
  return c.json({ result });
})


app.get('/jwt/isItMyKitchen/:kid', async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = payload;
  const { kid } = c.req.param();
  const result = await runQuery('SELECT * FROM KITCHEN WHERE ID = :kid AND CHEF_ID = (SELECT ID FROM CHEF WHERE USER_ID = :id)', { kid, id });
  if (result.length === 0)
    return c.json({ status: false });
  return c.json({ status: true });
})

app.get('/jwt/allCategory/:kid', async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = payload;
  const { kid } = c.req.param();
  const result = await runQuery('SELECT * FROM CATEGORY WHERE KITCHEN_ID = :kid', { kid });
  return c.json(result);
})

/**
 * CREATE TABLE CATEGORY (
    ID VARCHAR2(36) PRIMARY KEY,
    KITCHEN_ID VARCHAR2(36) NOT NULL,
    NAME VARCHAR2(100) NOT NULL,
    DESCRIPTION VARCHAR2(300) NOT NULL,
    CATEGORY_IMAGE VARCHAR2(300) DEFAULT 'https://placehold.co/600x400',
    FOREIGN KEY (KITCHEN_ID) REFERENCES KITCHEN(ID)
);
 */
app.post('/jwt/updateCategory', async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = payload;
  const { cat_id, name, description, image } = await c.req.json<{ cat_id: string, name: string, description: string, image: string }>();
  const result = await runQuery('BEGIN UPDATE_CATEGORY(:cat_id, :name, :description, :image); END;', { cat_id, name, description, image });
  console.log(cat_id, name, description, image);
  return c.json(result);
})

app.post('/jwt/deleteCategory', async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = payload;
  const { cat_id } = await c.req.json<{ cat_id: string }>();
  const result = await runQuery('BEGIN DELETE_CATEGORY(:cat_id); END;', { cat_id });
  return c.json(result);
})
/**
 * 
CREATE OR REPLACE PROCEDURE UPDATE_FOOD(
    F_ID VARCHAR2,
    F_NAME VARCHAR2,
    F_DESCRIPTION VARCHAR2,
    F_PRICE NUMBER,
    F_IMAGE VARCHAR2
) IS
BEGIN
    UPDATE FOOD
    SET
        NAME = F_NAME,
        DESCRIPTION = F_DESCRIPTION,
        PRICE = F_PRICE,
        FOOD_IMAGE = F_IMAGE
    WHERE
        ID = F_ID;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'FOOD_UPDATE',
        'Food Updated - '
        || F_ID
        || ' '
        || F_NAME,
        'SUCCESS'
    );
END;
/

CREATE OR REPLACE PROCEDURE DELETE_FOOD(
    D_FOOD_ID VARCHAR2
) IS
BEGIN
    DELETE FROM INGREDIENT
    WHERE
        FOOD_ID = D_FOOD_ID;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'INGREDIENT DELETED BECAUSE OF FOOD',
        'Ingredients Deleted - '
        || D_FOOD_ID,
        'SUCCESS'
    );
    DELETE FROM CART
    WHERE
        FOOD_ID = D_FOOD_ID;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'CART DELETED BECAUSE OF FOOD',
        'Cart Deleted - '
        || D_FOOD_ID,
        'SUCCESS'
    );
    DELETE FROM FOOD_RATING
    WHERE
        FOOD_ID = D_FOOD_ID;
    COMMIT;
    DELETE FROM REPORT_FOOD
    WHERE
        FOOD_ID = D_FOOD_ID;
    COMMIT;
    DELETE FROM FOOD
    WHERE
        ID = D_FOOD_ID;
    COMMIT;
    INSERT INTO LOGS (
        TYPE,
        MESSAGE,
        STATUS
    ) VALUES (
        'FOOD_DELETE',
        'Food Deleted - '
        || D_FOOD_ID,
        'SUCCESS'
    );
END;
/
 */

app.post('/jwt/updateFood', async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = payload;
  const { fid, name, description, price, image } = await c.req.json<{ fid: string, name: string, description: string, price: number, image: string }>();
  console.log(fid, name, description, price, image);
  const result = await runQuery('BEGIN UPDATE_FOOD(:fid, :name, :description, :price, :image); END;', { fid, name, description, price, image });
  return c.json(result);
})

app.post('/jwt/deleteFood', async (c) => {
  const payload = c.get('jwtPayload');
  const { id } = payload;
  const { fid } = await c.req.json<{ fid: string }>();
  const result = await runQuery('BEGIN DELETE_FOOD(:fid); END;', { fid });
  return c.json(result);
})

export default {
  port: process.env.PORT,
  websocket,

  fetch: app.fetch,
}