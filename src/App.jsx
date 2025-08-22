import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file

function App() {
    const [userInput, setUserInput] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load chat history from local storage on component mount
    useEffect(() => {
        const storedChatLog = localStorage.getItem('chatLog');
        if (storedChatLog) {
            setChatLog(JSON.parse(storedChatLog));
        }
    }, []);

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!userInput.trim()) return;  // Prevent submitting empty messages
        const userMessage = { type: 'user', text: userInput };
        setChatLog(prevChatLog => [...prevChatLog, userMessage]);
        setUserInput(''); // Clear input immediately
        setLoading(true);

        try {
            const response = await fetch('https://chatbot-backend-uyne.onrender.com/chat', { // Replace with your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_message: userInput }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const botMessage = { type: 'bot', text: data.bot_response };
            setChatLog(prevChatLog => [...prevChatLog, botMessage]);
            // Save chat log to local storage
            localStorage.setItem('chatLog', JSON.stringify([...chatLog, userMessage, botMessage]));
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = { type: 'error', text: 'An error occurred. Please try again.' };
            setChatLog(prevChatLog => [...prevChatLog, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>Simple AI Chatbot</h1>
            <div className="chat-window">
                {chatLog.map((message, index) => (
                    <div key={index} className={`message ${message.type}`}>
                        {message.text}
                    </div>
                ))}
                {loading && <div className="message bot">Loading...</div>}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                />
                <button type="submit" disabled={loading}>Send</button>
            </form>
        </div>
    );
}

export default App;