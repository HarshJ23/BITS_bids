import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useSession } from 'next-auth/react';

const ChatModal = ({ isChatOpen, toggleChatModal, sellerEmail, buyerEmail, productId , isSold }) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const roomId = `${productId}${sellerEmail}${buyerEmail}`;
    const { data: session } = useSession();

  
    useEffect(() => {
        if (!isChatOpen || !roomId) return;
    
        // Function to fetch chat history from the server
        const fetchChatHistory = async () => {
            try {
                // Encoding the roomId to ensure special characters are handled correctly in the URL
                const encodedRoomId = encodeURIComponent(roomId);
                const response = await fetch(`https://bitsbids.azurewebsites.net/api/chat/getAllMessagesForRoomId?roomId=${encodedRoomId}` , {
                    headers:{
                        "Baby" : "123",
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const chatHistory = await response.json();
    
                // Assuming the API returns an array of messages in the correct order
                setMessages(chatHistory.map(msg => ({
                    message: msg.content,
                    sender: msg.senderUserEmail
                })));
            } catch (error) {
                console.error("Fetching chat history failed:", error);
            }
        };
    
        // Fetch chat history when the modal opens
        fetchChatHistory();
    
        // WebSocket logic to handle new messages...
        const socket = new SockJS('https://bitsbids.azurewebsites.net/ws');
        const client = Stomp.over(socket);
    
        client.connect({}, frame => {
            console.log('Connected: ' + frame);
            client.subscribe(`/topic/chat/${roomId}`, message => {
                const receivedMessage = JSON.parse(message.body);
                console.log('Received Message:', receivedMessage); // Debugging log
                if(receivedMessage.content && receivedMessage.content.trim() !== '') {
                    displayMessage(receivedMessage.content, receivedMessage.senderUserEmail);
                }
            });
        }, error => {
            console.error('Connection Error: ' + error);
        });
    
        setStompClient(client);
    
        // Cleanup function to disconnect WebSocket when component unmounts
        return () => {
            if (client) {
                client.disconnect();
                console.log('Disconnected');
            }
        };
    }, [isChatOpen, roomId]);

    
    const sendMessage = () => {
        if (currentMessage.trim() !== "" && stompClient && roomId && session?.user?.email) {
            const chatMessage = {
                content: currentMessage,
                senderUserEmail: session.user.email, // This is the email of the current user
                receiverUserEmail: session.user.email === sellerEmail ? buyerEmail : sellerEmail,
                forProductId: productId,
                roomId: roomId,
                type: 'CHAT'
            };
            console.log('Sending Message:', chatMessage);
            stompClient.send(`/app/chat/${roomId}/send`, {}, JSON.stringify(chatMessage));
            setCurrentMessage(''); // Clear the input after sending the message
        }
    };

    const displayMessage = (messageContent, senderEmail) => {
        setMessages(prevMessages => [...prevMessages, { message: messageContent, sender: senderEmail }]);
    };



    const isMessageSentByCurrentUser = (senderEmail) => {
        return session?.user?.email && senderEmail === session.user.email;
    };

    if (!isChatOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center p-4 transition duration-300 ease-in-out">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-2">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-t-2xl flex justify-between items-center">
                    <p className="text-white text-xl font-semibold">Chat </p>
     {isSold == 1 ?  (<div className='mx-3'>
    <p className='text-xs my-1  text-white'>Buyer: <span>{buyerEmail}</span></p>
    <p className='text-xs my-1  text-white'>Seller: <span>{sellerEmail}</span></p>
</div>) : (<p></p>
)}               

                    <Button 
                        onClick={toggleChatModal}
                        className="text-white hover:text-blue-300 transition duration-200 text-2xl">
                        &#10005; {/* Unicode for 'X' Close Button */}
                    </Button>
                </div>
                <div className="p-4 bg-gray-50">
                    <div className="overflow-y-auto h-60 mb-4 space-y-2">
                    {messages.map((msg, index) => (
        <div key={index} className={`p-3 rounded-lg max-w-xs ${
            isMessageSentByCurrentUser(msg.sender) 
                ? "bg-blue-500 text-white float-right clear-both" // Blue for sent messages
                : "bg-green-500 text-white float-left clear-both" // Green for received messages
        }`}>
            <p className="text-sm">{msg.message}</p>
        </div>
    ))}
                    </div>
                    <div className="flex border-t border-gray-200 pt-4">
                        <Input
                            type="text"
                            className="flex-grow rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-600 transition duration-200 bg-white"
                            placeholder="Type a message..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <Button
                            className="ml-2 text-white rounded-lg p-3 hover:bg-blue-700 transition duration-200"
                            onClick={sendMessage}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;