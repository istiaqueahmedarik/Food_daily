// server.ts
import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';
import oracledb from 'oracledb';
import { runQuery } from '../db/connect/oracle';
import { jwt } from 'hono/jwt';

const app = new Hono();

const { upgradeWebSocket, websocket } = createBunWebSocket();




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
    const query = `INSERT INTO MESSAGES (CONVERSATION_ID,SENDER_ID,MESSAGE) VALUES (:conversationId, :senderId,:messageText)`;

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


                const c_ = await runQuery(`SELECT * FROM CONVERSATIONS WHERE USER_ID = :user1 AND DELIVERY_PARTNER_ID = :user2`, { user1, user2 });
                if (c_.length > 0) {
                    conversationId = c_[0].CONVERSATION_ID;
                }
                else {
                    await runQuery(`INSERT INTO CONVERSATIONS (USER_ID,DELIVERY_PARTNER_ID) VALUES (:user1,:user2)`, { user1, user2 });
                    const res = await runQuery(`SELECT * FROM CONVERSATIONS WHERE USER_ID = :user1 AND DELIVERY_PARTNER_ID = :user2`, { user1, user2 });
                    conversationId = res[0].CONVERSATION_ID;
                }
                const res = await runQuery(`SELECT DATE_ADDED AS timestamp, SENDER_ID AS sender, MESSAGE AS content FROM CONVERSATIONS,MESSAGES WHERE USER_ID = :user1 AND DELIVERY_PARTNER_ID = :user2 AND MESSAGES.CONVERSATION_ID = :conversationId`, { user1, user2, conversationId });
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

// Bun server setup
Bun.serve({
    fetch: app.fetch,
    websocket,
    port: 8080,
});


