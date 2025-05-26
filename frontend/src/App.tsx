import { useState, useRef, useEffect } from "react";
import axios from "axios";
import React from "react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post<{ reply: string }>("http://localhost:5000/chat", { text: input });
      const botMessage: Message = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Nurse Assistant is not available now, please contact admin kiran - 9611929845." }]);
    }

    setInput("");
  };
  
  const [hover, setHover] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[80vh] bg-white shadow-2xl rounded-lg flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 font-semibold text-lg rounded-t-lg flex items-center justify-between">
          <span>
            Nurse Assistant Developed by{" "}
            <a
            href="https://kiranrajbadakambi.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: hover ? "red" : "inherit", textDecoration: "none", transition: "color 0.3s" }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            >
            Kiran Badakambi
            </a>
          </span>
        </div>
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
        <span className="block text-center text-sm mb-2 text-gray-600">
          Designed & Developed by{" "}
          <a
          href="https://kiranrajbadakambi.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: hover ? "red" : "inherit", textDecoration: "none", transition: "color 0.3s" }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          >
          Kiran Badakambi
          </a>
        </span>
      </div>
    </div>
  );
}

export default App;
