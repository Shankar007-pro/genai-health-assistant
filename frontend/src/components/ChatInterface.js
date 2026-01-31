import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown, { uriTransformer } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { FaRobot, FaUser, FaPaperPlane, FaStethoscope, FaMicrophone, FaCamera, FaTimes } from 'react-icons/fa';
import '../styles/ChatInterface.css'; 

const API_BASE_URL = " ";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      content: "Hello! I am **Aarogya-AI**. \n\nHow can I assist you today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // ✅ UPDATED: Added Kannada and Tamil to the state
  const [language, setLanguage] = useState('English');
  
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null); 
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const urlTransform = (url) => url.startsWith('data:') ? url : uriTransformer(url);

  // --- FEATURE 1: VOICE HANDLERS ---
  const handleMicPress = (e) => {
    startRecording();
  };

  const handleMicRelease = () => {
    stopRecording();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; 
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => audioChunks.push(event.data);
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('language', language);

        setLoading(true);
        try {
          const response = await axios.post(`${API_BASE_URL}/transcribe-voice`, formData);
          if (response.data.text) {
             sendMessage(response.data.text);
          }
        } catch (error) {
          console.error("Voice Error:", error);
        }
        setLoading(false);
        streamRef.current.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- CORE CHAT LOGIC ---
  const sendMessage = async (overrideInput = null) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() && !selectedImage) return;
    
    // Instruction to force the AI to respond in the selected language
    const languageInstruction = ` (Please respond in ${language})`;
    
    let displayContent = textToSend;
    if (selectedImage) {
      displayContent = `![Image](${selectedImage})\n\n${textToSend}`;
    }

    setMessages(prev => [...prev, { role: 'user', content: displayContent }]);
    
    const currentInput = textToSend;
    const currentImage = selectedImage;

    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const endpoint = currentImage ? `${API_BASE_URL}/analyze-image` : `${API_BASE_URL}/chat`;
      const payload = currentImage 
        ? { image: currentImage, text: currentInput + languageInstruction } 
        : { message: currentInput + languageInstruction, history: messages.map(m => ({
            role: m.role === 'model' ? 'assistant' : 'user',
            content: m.content
          }))};

      const response = await axios.post(endpoint, payload);
      
      const botReply = { 
        role: 'model', 
        content: currentImage ? response.data.analysis : response.data.reply 
      };
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "⚠️ Error connecting to server." }]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="avatar bot-avatar">
          <FaStethoscope size={24} />
        </div>
        <div className="header-info">
          <h2>Aarogya-AI</h2>
          <span><div className="online-dot"></div> Always Active </span>
        </div>

        {/* ✅ UPDATED: Added Kannada and Tamil to the dropdown */}
        <select 
          className="language-select" 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Telugu">తెలుగు (Telugu)</option>
          <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
          <option value="Hindi">हिन्दी (Hindi)</option>
          <option value="Tamil">தமிழ் (Tamil)</option>
        </select>
      </div>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.role === 'user' ? 'user' : 'bot'}`}>
            <div className={`avatar ${msg.role === 'user' ? 'user-avatar' : 'bot-avatar'}`}>
              {msg.role === 'user' ? <FaUser /> : <FaRobot />}
            </div>
            <div className="message-content">
              <ReactMarkdown urlTransform={urlTransform} remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="online-dot" style={{margin: '10px'}}>...</div>}
        <div ref={bottomRef} />
      </div>

      {selectedImage && (
        <div className="image-preview-bar">
          <img src={selectedImage} alt="preview" />
          <div className="preview-info">Photo attached ({language}).</div>
          <button className="remove-img-btn" onClick={() => setSelectedImage(null)}><FaTimes /></button>
        </div>
      )}

      <div className="input-area">
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => setSelectedImage(reader.result);
          reader.readAsDataURL(file);
        }} />
        
        <div className="input-row">
          <div className="input-container">
            <button className="action-btn" onClick={() => fileInputRef.current.click()}><FaCamera /></button>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder={`Type symptoms in ${language}...`}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <button 
              className={`action-btn ${isRecording ? 'recording' : ''}`} 
              onMouseDown={handleMicPress} 
              onMouseUp={handleMicRelease}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
            >
              <FaMicrophone />
            </button>
          </div>
          <button className="send-btn" onClick={() => sendMessage()} disabled={loading}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;