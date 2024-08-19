// server.ts
import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';
import oracledb from 'oracledb';
import { runQuery } from '../db/connect/oracle';
import { jwt } from 'hono/jwt';

const app = new Hono();

const { upgradeWebSocket, websocket } = createBunWebSocket();

// Oracle DB Config
const dbConfig = {
    user: "system",
    password: "oracle",
    connectString: "localhost:1521/oracle",
}

/**
 * CREATE TABLE CONVERSATIONS (
    CONVERSATION_ID VARCHAR2(36) PRIMARY KEY,
    USER_ID VARCHAR2(36) NOT NULL,
    DELIVERY_PARTNER_ID VARCHAR2(36) NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    FOREIGN KEY (DELIVERY_PARTNER_ID) REFERENCES DELIVERY_PARTNER(ID)
);

CREATE TABLE MESSAGES (
    MESSAGE_ID VARCHAR2(36) PRIMARY KEY,
    CONVERSATION_ID VARCHAR2(36) NOT NULL,
    SENDER_ID VARCHAR2(36) NOT NULL,
    MESSAGE VARCHAR2(255) NOT NULL,
    DATE_ADDED DATE DEFAULT SYSDATE,
    FOREIGN KEY (CONVERSATION_ID) REFERENCES CONVERSATIONS(CONVERSATION_ID),
    FOREIGN KEY (SENDER_ID) REFERENCES USERS(ID)
);
 */

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
    const messageText = data.message;
    const senderId = data.sender;
    const query = `INSERT INTO MESSAGES (CONVERSATION_ID,SENDER_ID,MESSAGE) VALUES (:conversationId, :senderId,:messageText)`;

    const res = await runQuery(query, { conversationId, senderId, messageText });
    console.log(res);
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
                console.log('Connection opened');
                const { user1, user2 } = c.req.param();
                console.log(user1, user2);

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
                const res = await runQuery(`SELECT * FROM CONVERSATIONS,MESSAGES WHERE USER_ID = :user1 AND DELIVERY_PARTNER_ID = :user2 AND MESSAGES.CONVERSATION_ID = :conversationId`, { user1, user2, conversationId });
                console.log(res);
                ws.send(JSON.stringify(res));

            },
            onMessage: async (event, ws) => {
                const { user1, user2 } = c.req.param();
                console.log(user1, user2);
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

                console.log('Connection closed')
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

console.log('Server is running on http://localhost:8080');
