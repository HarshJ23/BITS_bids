// // ChatModal.jsx
// import { useState, useEffect } from 'react';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';


// const ChatModal = ({ isChatOpen, toggleChatModal , sellerEmail , buyerEmail, productId }) => {
//     const [stompClient, setStompClient] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [currentMessage, setCurrentMessage] = useState("");
//     const roomId = `${productId}${sellerEmail}${buyerEmail}`;

//     useEffect(() => {
//         if (!roomId) return;

//         const socket = new SockJS('https://bitsbids.azurewebsites.net/ws');
//         const client = Stomp.over(socket);

//         client.connect({}, frame => {
//             console.log('Connected: ' + frame);
//             client.subscribe(`/topic/chat/${roomId}`, message => {
//                 const receivedMessage = JSON.parse(message.body);
//                 displayMessage(receivedMessage); // Ensure the format is consistent
//             });
//         }, error => {
//             console.error('Connection Error: ' + error);
//         });

//         setStompClient(client);

//         return () => client && client.disconnect();
//     }, [roomId]);

//     const sendMessage = () => {
//         if (currentMessage.trim() !== "" && stompClient && roomId) {
//             const chatMessage = {
//                 sender: "You",
//                 message: currentMessage, // Ensure the field name is 'message'
//                 roomId: roomId,
//                 type: 'CHAT'
//             };
//             stompClient.send(`/app/chat/${roomId}/send`, {}, JSON.stringify(chatMessage));
//             displayMessage(chatMessage); // Display the message you send
//             setCurrentMessage('');
//         }
//     };

//     const displayMessage = (newMessage) => {
//         setMessages(prevMessages => [...prevMessages, newMessage]);
//     };

//     if (!isChatOpen) return null;


//     // const sendMessage = () => {
//     //     if (currentMessage.trim() !== "") {
//     //         setMessages([...messages, { sender: "You", message: currentMessage }]);
//     //         setCurrentMessage("");
//     //     }
//     // };

//     // if (!isChatOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center p-4 transition duration-300 ease-in-out">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-2">
//                 <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-t-2xl flex justify-between items-center">
//                     <p className="text-white text-xl font-semibold">Chat </p>
//                     <Button 
//                         onClick={toggleChatModal}
//                         className="text-white hover:text-blue-300 transition duration-200 text-2xl"
//                     >
//                         &#10005; {/* Unicode for 'X' Close Button */}
//                     </Button>
//                 </div>
//                 <div className="p-4 bg-gray-50">
//                     <div className="overflow-y-auto h-60 mb-4 space-y-2">
//                         {messages.map((msg, index) => (
//                             <div key={index} className={`p-3 rounded-xl ${msg.sender === "You" ? "bg-blue-100 ml-auto" : "bg-gray-200"}`}>
//                                 <p className="text-sm">{msg.message}</p>
//                             </div>
//                         ))}
//                     </div>
//                     <div className="flex border-t border-gray-200 pt-4">
//                         <Input
//                             type="text"
//                             className="flex-grow rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-600 transition duration-200 bg-white"
//                             placeholder="Type a message..."
//                             value={currentMessage}
//                             onChange={(e) => setCurrentMessage(e.target.value)}
//                             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                         />
//                         <Button
//                             className="ml-2  text-white rounded-lg p-3 hover:bg-blue-700 transition duration-200"
//                             onClick={sendMessage}
//                         >
//                             Send
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChatModal;


import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useSession } from 'next-auth/react';

const ChatModal = ({ isChatOpen, toggleChatModal, sellerEmail, buyerEmail, productId }) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const roomId = `${productId}${sellerEmail}${buyerEmail}`;
    const { data: session } = useSession();

  
    useEffect(() => {
        if (!roomId) return;

        const socket = new SockJS('https://bitsbids.azurewebsites.net/ws');
        const client = Stomp.over(socket);

        client.connect({}, frame => {
            console.log('Connected: ' + frame);
            client.subscribe(`/topic/chat/${roomId}`, message => {
                const receivedMessage = JSON.parse(message.body);
                console.log('Received Message:', receivedMessage); // Debugging log
                if(receivedMessage.content && receivedMessage.content.trim() !== '') {
                    displayMessage(receivedMessage.content, receivedMessage.senderUserEmail); // Adjusted to use content and senderUserEmail
                }
            });
        }, error => {
            console.error('Connection Error: ' + error);
        });

        setStompClient(client);

        return () => client && client.disconnect();
    }, [roomId]);

    // const sendMessage = () => {
    //     if (currentMessage.trim() !== "" && stompClient && roomId && session?.user?.email) {
    //         const chatMessage = {
    //             content: currentMessage,
    //             senderUserEmail: session.user.email,
    //             receiverUserEmail: session.user.email === sellerEmail ? buyerEmail : sellerEmail,
    //             forProductId: productId,
    //             roomId: roomId,
    //             type: 'CHAT'
    //         };
    //         console.log('Sending Message:', chatMessage);
    //         stompClient.send(`/app/chat/${roomId}/send`, {}, JSON.stringify(chatMessage));
    //         displayMessage(currentMessage, session.user.email);
    //         setCurrentMessage('');
    //     }
    // };

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


    const displayMessage = (message, sender) => {
        setMessages(prevMessages => [...prevMessages, { message, sender }]);
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
                    <Button 
                        onClick={toggleChatModal}
                        className="text-white hover:text-blue-300 transition duration-200 text-2xl"
                    >
                        &#10005; {/* Unicode for 'X' Close Button */}
                    </Button>
                </div>
                <div className="p-4 bg-gray-50">
                    <div className="overflow-y-auto h-60 mb-4 space-y-2">
                    {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`p-3 rounded-lg ${
                                    isMessageSentByCurrentUser(msg.sender) 
                                        ? "bg-blue-500 text-white float-right clear-both" // Blue for sent messages
                                        : "bg-green-500 text-white float-left clear-both" // Green for received messages
                                }`}>
                                <p className="text-sm">{msg.message}</p>
                                {/* Clear float for next message */}
                                <div className="clear-both"></div> 
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
