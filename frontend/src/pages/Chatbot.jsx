import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! I am Travel Saathi. Ask me about fair prices, bargaining tips, or local travel advice for Indian cities.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { prompt: userMessage });
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: res.data.response,
        isMock: res.data.is_mock 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto w-full relative z-10 flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold flex items-center justify-center">
          <Bot className="mr-3 h-10 w-10 text-[var(--city-theme-color)]" /> Travel Saathi
        </h1>
        <p className="text-gray-400 mt-2">Your AI-powered local guide</p>
      </div>

      <div className="flex-grow glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/10 shadow-2xl h-[600px] max-h-[70vh]">
        
        {/* Messages Area */}
        <div className="flex-grow p-4 md:p-6 overflow-y-auto custom-scrollbar space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-white/10 ml-3' : 'bg-[var(--city-theme-color)]/20 mr-3'}`}>
                  {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5 text-[var(--city-theme-color)]" />}
                </div>
                
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[var(--city-theme-color)] text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  {msg.isMock && <span className="text-[10px] text-yellow-500 mt-2 block opacity-80">Fallback mode</span>}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-white/5 flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/40 border-t border-white/10">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about auto fares, shopping, or local food..."
              className="w-full bg-gray-800 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white focus:outline-none focus:border-[var(--city-theme-color)] transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`absolute right-2 p-2 rounded-full transition ${!input.trim() || loading ? 'text-gray-500 bg-transparent' : 'text-white bg-[var(--city-theme-color)] hover:opacity-90'}`}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
