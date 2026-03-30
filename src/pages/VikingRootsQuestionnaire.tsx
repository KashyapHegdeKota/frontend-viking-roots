import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { SiteHeader } from '../components/site-header';
import '../styles/AuthPages.css';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export default function VikingRootsQuestionnaire() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.START, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to start interview.');
        return;
      }
      setMessages([{ role: 'model', content: data.message, timestamp: new Date() }]);
      setHasStarted(true);
    } catch {
      alert('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = { role: 'user', content: inputMessage, timestamp: new Date() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.MESSAGE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: userMessage.content, chat_history: nextMessages }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to send message.');
        return;
      }
      setMessages([...nextMessages, { role: 'model', content: data.message, timestamp: new Date() }]);
    } catch {
      alert('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <SiteHeader />
      <main className="chat-main">
        {!hasStarted ? (
          <section className="auth-card">
            <h1>Viking Roots Questionnaire</h1>
            <p>Discover and preserve your heritage through a guided interview.</p>
            <button onClick={startInterview} disabled={isLoading}>
              {isLoading ? 'Starting...' : 'Begin'}
            </button>
          </section>
        ) : (
          <section className="chat-card">
            <div className="chat-body">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.role}`}>
                  {m.content}
                </div>
              ))}
              {isLoading ? <div className="chat-bubble model">...</div> : null}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="chat-form">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message"
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !inputMessage.trim()}>
                Send
              </button>
            </form>

            <div className="auth-links">
              <button className="link-like" onClick={() => navigate('/profile')}>Continue to profile</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
