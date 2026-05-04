import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

const AiChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([
        { role: 'assistant', content: 'Hello! I am your school AI assistant. How can I help you today?' }
    ]);
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState('gemini'); // Default to gemini
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = { role: 'user', content: message };
        setChat((prev) => [...prev, userMessage]);
        setMessage('');
        setLoading(true);

        try {
            const res = await axios.post('/ai/chat', { 
                message: message,
                provider: provider
            });

            const aiMessage = { role: 'assistant', content: res.data.reply };
            setChat((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI Error:', error);
            setChat((prev) => [...prev, { 
                role: 'assistant', 
                content: 'Sorry, I am having trouble connecting right now. Please check your API keys.' 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-widget-container">
            {/* Toggle Button */}
            <button 
                className={`ai-toggle-btn ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="ai-chat-window glass-card">
                    <div className="ai-chat-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles size={20} color="var(--accent-neon)" />
                            <span>School AI</span>
                        </div>
                        <select 
                            value={provider} 
                            onChange={(e) => setProvider(e.target.value)}
                            className="ai-provider-select"
                        >
                            <option value="gemini">Gemini</option>
                            <option value="gpt">GPT-4o</option>
                        </select>
                    </div>

                    <div className="ai-chat-messages" ref={scrollRef}>
                        {chat.map((msg, idx) => (
                            <div key={idx} className={`ai-message-wrapper ${msg.role}`}>
                                <div className="ai-avatar">
                                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div className="ai-message-content">
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="ai-message-wrapper assistant">
                                <div className="ai-avatar ai-loading">
                                    <Sparkles size={16} />
                                </div>
                                <div className="ai-message-content">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    <form className="ai-chat-input" onSubmit={handleSend}>
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading || !message.trim()}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AiChatWidget;
