import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { FaRobot, FaUser, FaPaperPlane, FaStethoscope } from 'react-icons/fa';

// CORRECT IMPORT: Pointing to the file that actually exists
import '../styles/ChatInterface.css'; 

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      content: "Hello! I am **Aarogya-AI**. \n\nI can help you with:\n* Symptom Check\n* Home Remedies\n* Emergency Advice\n\nHow are you feeling today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Using localhost for now based on your setup
    // Make sure it looks EXACTLY like this:
    const API_URL = 'https://aarogya-ai-zvt0.onrender.com/chat';

    try {
      const response = await axios.post(API_URL, {
        message: userMsg.content,
        history: messages
      });

      const botReply = { role: 'model', content: response.data.reply };
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "⚠️ **Connection Error:** I couldn't reach the server. Please check your internet or API Key." 
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="avatar bot-avatar" style={{width: '50px', height: '50px', background: '#00796b', color: 'white'}}>
          <FaStethoscope size={24} />
        </div>
        <div className="header-info">
          <h2>Aarogya-AI</h2>
          <span><div className="online-dot"></div> Always Active • Rural Health Assistant</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.role === 'user' ? 'user' : 'bot'}`}>
            <div className={`avatar ${msg.role === 'user' ? 'user-avatar' : 'bot-avatar'}`}>
              {msg.role === 'user' ? <FaUser /> : <FaRobot />}
            </div>
            <div className="message-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        
        {/* Loading Animation */}
        {loading && (
          <div className="message-wrapper bot">
            <div className="avatar bot-avatar"><FaRobot /></div>
            <div className="message-content" style={{padding: '10px 20px'}}>
              <div className="typing-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-container">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Type your symptoms here..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
        </div>
        <button className="send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;