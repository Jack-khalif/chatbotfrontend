import React, { useState } from "react";
import "./App.css"
function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Upload an image or type a message to begin." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const handleSend = async () => {
    if (!input && !image) return;

    const newMessage = { sender: "user", text: input, image: image ? URL.createObjectURL(image) : null };
    setMessages([...messages, newMessage]);
    setInput("");
    setImage(null);
    setLoading(true);

    try {
      const formData = new FormData();
      if (input) formData.append("message", input);
      if (image) formData.append("image", image);

      const response = await fetch("https://YOUR_RENDER_URL/chat", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error connecting to server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-xs shadow-md ${
                msg.sender === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800"
              }`}
            >
              {msg.image && (
                <img src={msg.image} alt="uploaded" className="rounded-lg mb-2 max-h-40 object-cover" />
              )}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-500">Bot is typing...</p>}
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-sm"
        />
        <input
          type="text"
          className="flex-1 border rounded-lg p-2 outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
