"use client";
import { useState } from 'react'
import { Button3 } from "@/components/ui/button3"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SendIcon, PhoneIcon, PackageIcon, TruckIcon, HomeIcon } from 'lucide-react'

export default function DeliveryChat() {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Delivery Person', content: 'Hello! I\'m on my way with your order.', timestamp: '14:30' },
        { id: 2, sender: 'You', content: 'Great! How long will it take?', timestamp: '14:31' },
        { id: 3, sender: 'Delivery Person', content: 'I should be there in about 15 minutes.', timestamp: '14:32' },
    ])
    const [newMessage, setNewMessage] = useState('')

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (newMessage.trim()) {
            setMessages([...messages, {
                id: messages.length + 1,
                sender: 'You',
                content: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])
            setNewMessage('')
        }
    }

    const orderStatus = 'In Transit' // This could be 'Preparing', 'In Transit', or 'Delivered'

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Delivery Person" />
                        <AvatarFallback>DP</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-lg font-semibold">John (Delivery Person - 0187544887152)</h2>
                        <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                </div>
                
            </div>
            <ScrollArea className="flex-1 p-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'} mb-4`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            <p>{message.content}</p>
                            <span className="text-xs opacity-50 mt-1 block">{message.timestamp}</span>
                        </div>
                    </div>
                ))}
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