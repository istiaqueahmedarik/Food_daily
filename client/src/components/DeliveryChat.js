"use client";
import { useEffect, useRef, useState } from 'react'
import { Button3 } from "@/components/ui/button3"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SendIcon, PhoneIcon, PackageIcon, TruckIcon, HomeIcon } from 'lucide-react'

export default function DeliveryChat(props) {
    const [messages, setMessages] = useState([
       
    ])

    const topPart = props.type==='user'?props.delivery:props.user
    
    const [newMessage, setNewMessage] = useState('')
    const messageEndRef = useRef(null);
    console.log(props.type)
    useEffect(() => {
        scrollToBottom();
     }, [messages])
    const [ws, setWs] = useState(null);
    useEffect(() => {
        scrollToBottom();

        // Create WebSocket connection
        const socket = new WebSocket(`ws://localhost:5001/ws/${props.delivery[0]['ID']}/${props.user[0]['ID']}`);

        socket.onopen = (event) => {
            // const data = JSON.parse(event.data);
            console.log(event)
            console.log("Connected")
            scrollToBottom();
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (Array.isArray(data)) {
                setMessages(data);
            } else {
                console.log("Data: ", data)
                setMessages((prev) => [...prev, data]);
            }
            scrollToBottom();
        };

        socket.onclose = () => {

        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

   
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        console.log("Scrolling")
    };
    const handleSendMessage = (e) => {
        e.preventDefault()
        if (newMessage.trim() && ws) {
            
            ws.send(JSON.stringify({
                SENDER: props.type==='user'?props.user[0]['ID']:props.delivery[0]['ID'],
                CONTENT: newMessage,
                TIMESTAMP: new Date().toUTCString()
            }))
            setNewMessage('')
        }
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={topPart[0]['PROFILE_IMAGE']} alt="Delivery Person" />
                        <AvatarFallback>{topPart[0]['NAME']['FIRST_NAME'][0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-lg font-semibold">{topPart[0]['NAME']['FIRST_NAME']} (Delivery Person - {topPart[0]['CITY_CODE']} {topPart[0]['MOBILE']})</h2>
                    </div>
                </div>
                
            </div>
            <ScrollArea className="flex-1 p-4">
                {messages.map((message,idx) => (
                    <div key={idx} className={`flex ${message.SENDER === (props.type === 'user' ? props.user[0]['ID'] : props.delivery[0]['ID']) ? 'justify-end' : 'justify-start'} mb-4`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${message.SENDER === (props.type === 'user' ? props.user[0]['ID'] : props.delivery[0]['ID']) ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            <p>{message.CONTENT}</p>
                            <span className="text-xs opacity-50 mt-1 block">{new Date(message.TIMESTAMP).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex">
                <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 mr-2"
                />
                <Button3 type="submit" size="icon">
                    <SendIcon className="h-5 w-5" />
                    <span className="sr-only">Send message</span>
                </Button3>
            </form>
        </div>
    )
}