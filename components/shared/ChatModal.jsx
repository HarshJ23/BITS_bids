// ChatModal.jsx
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ChatModal = ({ isChatOpen, toggleChatModal }) => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");

    const sendMessage = () => {
        if (currentMessage.trim() !== "") {
            setMessages([...messages, { sender: "You", message: currentMessage }]);
            setCurrentMessage("");
        }
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
                            <div key={index} className={`p-3 rounded-xl ${msg.sender === "You" ? "bg-blue-100 ml-auto" : "bg-gray-200"}`}>
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
                            className="ml-2  text-white rounded-lg p-3 hover:bg-blue-700 transition duration-200"
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
