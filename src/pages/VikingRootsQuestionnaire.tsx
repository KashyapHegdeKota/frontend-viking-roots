import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react'; // Added import

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ENDPOINTS = {
  START: `${API_BASE_URL}/api/ai_interview/start/`,
  MESSAGE: `${API_BASE_URL}/api/ai_interview/message/`,
};

const VikingRootsQuestionnaire = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startInterview = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.START, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setMessages([{ role: 'model', content: data.message, timestamp: new Date() }]);
        setHasStarted(true);
      } else {
        alert(data.error || 'Failed to start interview. Please try again.');
      }
    } catch (error) {
      alert('Failed to start interview. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = { role: 'user', content: inputMessage, timestamp: new Date() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.MESSAGE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ message: inputMessage, chat_history: newMessages }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages([...newMessages, { role: 'model', content: data.message, timestamp: new Date() }]);
      } else {
        alert(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      alert('Failed to send message. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (index: number, content: string) => {
    setEditingIndex(index);
    setEditedContent(content);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedContent('');
  };

  const saveEdit = async (index: number) => {
    if (!editedContent.trim()) return;
    const messagesBeforeEdit = messages.slice(0, index);
    const editedMessage: Message = { role: 'user', content: editedContent, timestamp: new Date() };
    const newMessages = [...messagesBeforeEdit, editedMessage];
    
    setMessages(newMessages);
    setEditingIndex(null);
    setEditedContent('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.MESSAGE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ message: editedContent, chat_history: newMessages }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages([...newMessages, { role: 'model', content: data.message, timestamp: new Date() }]);
      } else {
        alert(data.error || 'Failed to resend message.');
      }
    } catch (error) {
      alert('Failed to resend message.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f9fafb' // Matching light theme
    }}>
      {/* Header */}
      <header style={{ padding: '20px', borderBottom: '1px solid #e5e5e5', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={() => navigate('/profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '14px', padding: 0 }}
            >
              <ArrowLeft size={16} />
            </button>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#111' }}>
              Viking Roots Skald
            </h1>
          </div>
          
          {hasStarted && (
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '8px 16px', fontSize: '14px', fontWeight: '500',
                backgroundColor: '#f5f5f5', color: '#111', border: '1px solid #e5e5e5',
                borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s'
              }}
            >
              View Dashboard →
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        flex: 1, display: 'flex', flexDirection: 'column',
        maxWidth: '800px', width: '100%', margin: '0 auto', padding: '0 20px'
      }}>
        {!hasStarted ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            <p style={{ fontSize: '16px', color: '#666', margin: 0, textAlign: 'center' }}>
              Discover and preserve your family's heritage through conversation.
            </p>
            <button 
              onClick={startInterview}
              disabled={isLoading}
              style={{
                padding: '12px 32px', fontSize: '15px', fontWeight: '600',
                backgroundColor: '#8b5cf6', color: 'white', border: 'none',
                borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1, transition: 'all 0.2s'
              }}
            >
              {isLoading ? 'Summoning the Skald...' : 'Begin the Saga'}
            </button>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '24px 0',
              display: 'flex', flexDirection: 'column', gap: '16px'
            }}>
              {messages.map((msg, index) => (
                <div key={index} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {editingIndex === index ? (
                    <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        style={{
                          padding: '12px 16px', fontSize: '15px', borderRadius: '12px',
                          border: '2px solid #8b5cf6', outline: 'none', resize: 'vertical',
                          minHeight: '60px', fontFamily: 'inherit', backgroundColor: '#fff'
                        }}
                        autoFocus
                      />
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={cancelEdit} disabled={isLoading} style={{ padding: '6px 16px', fontSize: '13px', fontWeight: '500', backgroundColor: '#fff', color: '#666', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}>
                          Cancel
                        </button>
                        <button onClick={() => saveEdit(index)} disabled={isLoading || !editedContent.trim()} style={{ padding: '6px 16px', fontSize: '13px', fontWeight: '500', backgroundColor: '#111', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                          {isLoading ? 'Saving...' : 'Save & Resend'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      maxWidth: '80%', 
                      padding: '12px 16px', 
                      // This creates the "chat tail" effect (sharp bottom-right for user, sharp bottom-left for AI)
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: msg.role === 'user' ? '#8b5cf6' : '#fff',
                      color: msg.role === 'user' ? '#fff' : '#111',
                      border: msg.role === 'user' ? 'none' : '1px solid #e5e5e5',
                      fontSize: '15px', 
                      lineHeight: '1.5', 
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      // These two lines prevent text from overflowing or getting cut off by curves
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '14px 18px', borderRadius: '16px', backgroundColor: '#fff', border: '1px solid #e5e5e5', color: '#666', fontSize: '15px' }}>
                    Typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div style={{ padding: '20px 0', borderTop: '1px solid #e5e5e5', backgroundColor: '#f9fafb' }}>
              <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Tell the Skald about your family..."
                  disabled={isLoading}
                  style={{
                    flex: 1, padding: '14px 16px', fontSize: '15px',
                    borderRadius: '8px', border: '1px solid #ccc', outline: 'none',
                    backgroundColor: '#fff', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  style={{
                    padding: '0 24px', fontSize: '15px', fontWeight: '600',
                    backgroundColor: '#111', color: 'white', border: 'none',
                    borderRadius: '8px', cursor: (isLoading || !inputMessage.trim()) ? 'not-allowed' : 'pointer',
                    opacity: (isLoading || !inputMessage.trim()) ? 0.5 : 1, transition: 'background-color 0.2s'
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VikingRootsQuestionnaire;