import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export default function AIInterview() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (hasStarted && !isLoading) inputRef.current?.focus();
  }, [hasStarted, isLoading]);

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
      setSessionId(data.session_id);
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

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    const previousMessages = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.MESSAGE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: userMessage.content,
          chat_history: previousMessages,
          session_id: sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages(previousMessages);
        alert(data.error || 'Failed to send message.');
        return;
      }

      setMessages(prev => [
        ...prev,
        { role: 'model', content: data.message, timestamp: new Date() },
      ]);
    } catch {
      setMessages(previousMessages);
      alert('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .messages-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .messages-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .messages-scroll::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 999px;
        }
        .messages-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
      `}</style>

      <div className="fixed flex flex-col bg-background" style={{ top: '57px', left: 0, right: 0, bottom: 0 }}>
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col p-6 min-h-0">

          {!hasStarted ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-3xl">
                📜
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Viking Roots Questionnaire
                </h1>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Discover and preserve your heritage through a guided interview with our AI storyteller.
                </p>
              </div>
              <button
                onClick={startInterview}
                disabled={isLoading}
                className="rounded-lg bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? 'Starting...' : 'Begin Interview'}
              </button>
            </div>
          ) : (
            <div className="flex flex-1 flex-col min-h-0">

              {/* Header */}
              <div className="flex-shrink-0 flex items-center gap-3 border-b border-border pb-4 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-lg">
                  📜
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Keeper of Tales</p>
                  <p className="text-xs text-primary">AI Heritage Storyteller</p>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-scroll flex-1 overflow-y-auto flex flex-col gap-4 pr-2 min-h-0 mb-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-card border border-border text-foreground rounded-tl-none'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-xl rounded-tl-none px-4 py-3">
                      <div className="flex gap-1.5 items-center h-4">
                        {[0, 1, 2].map(i => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input — always visible */}
              <div className="flex-shrink-0 border-t border-border pt-4 flex flex-col gap-3">
                <form onSubmit={sendMessage} className="flex gap-3">
                  <input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    placeholder="Share your memory..."
                    disabled={isLoading}
                    className="flex-1 h-11 rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="h-11 w-11 rounded-lg bg-primary text-primary-foreground flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-40"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors text-center"
                >
                  Continue to profile →
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}