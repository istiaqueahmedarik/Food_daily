// components/Chat.js
"use client"
import { useEffect, useState } from 'react';

const Chat = ({ user1, user2 }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState({
        message: '',
        sender: '',
    });
    const [ws, setWs] = useState(null);
    useEffect(() => {
        // Create WebSocket connection
        const socket = new WebSocket(`ws://localhost:8080/ws/${user1}/${user2}`);

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            console.log('Message from server ', event.data);
            // json string to json object
            const data = JSON.parse(event.data);
            console.log(data)
        };

        socket.onclose = () => {
            console.log('WebSocket closed');
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, [user1, user2]);

    const sendMessage = () => {
        if (input && ws) {
            ws.send(JSON.stringify(input));
            console.log('Sent message');
            setInput('');
        }
    };

    return (
        <div>
            <h2>Chat between {user1} and {user2}</h2>
            <input type="text" value={input.message} onChange={(e) => {
                setInput({
                    message: e.target.value,
                    sender: user1,
                })
            }} />


            <input type="text" value={input.message} onChange={(e) => {
                setInput({
                    message: e.target.value,
                    sender: user2,
                })
            }} />

            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
