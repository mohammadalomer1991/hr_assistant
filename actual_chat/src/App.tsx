import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Database, DollarSign, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { fetchData } from './api/bedrock';
import { put_item_into_dynamodb_table } from './api/dynamodb_integration';
import LeftNavBar from './components/LeftNanBar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

interface Citation {
  source: string;
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
    loadChatHistory(sessionId);
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const loadChatHistory = async (sessionId: string) => {
    console.log('Loading session:', sessionId);
    // TODO: fetch messages for this session and call setMessages()
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const answer = await fetchData(currentInput);
      put_item_into_dynamodb_table(
        currentInput,
        answer,
        activeSessionId ?? 'default-session',
        new Date().toISOString(),
        'createdAt'
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        citations: [],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `エラーが発生しました: ${err instanceof Error ? err.message : '不明なエラー'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app-container">
      {/* ── Header ── */}
      <header className="chat-header">
        <div className="header-content">
          <div className="header-left">
            <Database className="header-logo" />
            <div>
              <h1 className="header-title">人事アシスタント</h1>
              <p className="header-status">
                <span className="status-dot" />
                オンライン
              </p>
            </div>
          </div>

          <div className="header-right">
            <button onClick={() => navigate('/costs')} className="header-btn">
              <DollarSign className="btn-icon" />
              <span className="btn-text">コスト</span>
            </button>
            <button onClick={() => navigate('/upload')} className="header-btn">
              <span className="btn-text">Upload</span>
            </button>
            <button onClick={() => navigate('/sandbox')} className="header-btn">
              <span className="btn-text">SandBox</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Body: sidebar + chat ── */}
      <div className="body-layout">
        <LeftNavBar
          onSessionSelect={handleSessionSelect}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
        />

        {/* ── Chat panel ── */}
        <div className="chat-panel">
          {/* Scrollable messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-screen">
                <Database className="welcome-icon" />
                <h2 className="welcome-title">Knowledge Baseへようこそ</h2>
                <p className="welcome-subtitle">ドキュメントについて質問してください</p>
                <div className="example-questions">
                  <p className="example-label">質問例:</p>
                  <button className="example-btn" onClick={() => setInput('喫煙所はどこですか？')}>
                    喫煙所はどこですか？
                  </button>
                  <button className="example-btn" onClick={() => setInput('オフィスの営業時間は？')}>
                    オフィスの営業時間は？
                  </button>
                  <button className="example-btn" onClick={() => setInput('会議室の予約方法は？')}>
                    会議室の予約方法は？
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
                  >
                    <div className="message-avatar">
                      {message.role === 'user' ? (
                        <User className="avatar-icon" />
                      ) : (
                        <Bot className="avatar-icon" />
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-role">
                          {message.role === 'user' ? 'あなた' : 'アシスタント'}
                        </span>
                        <span className="message-time">
                          {message.timestamp.toLocaleTimeString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="message-text">{message.content}</div>
                      {message.citations && message.citations.length > 0 && (
                        <div className="message-citations">
                          <p className="citations-title">📚 参照元:</p>
                          {message.citations.map((citation, idx) => (
                            <div key={idx} className="citation-item">
                              {citation.source}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* ✅ Fixed: only show when loading is true */}
                {loading && (
                  <div className="message message-assistant">
                    <div className="message-avatar">
                      <Bot className="avatar-icon" />
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Fixed input bar */}
          <div className="chat-input-bar">
            <div className="chat-input-inner">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力..."
                className="chat-input"
                rows={1}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="send-button"
              >
                {loading ? (
                  <Loader2 className="send-icon spinning" />
                ) : (
                  <Send className="send-icon" />
                )}
              </button>
            </div>
            <p className="input-hint">Shift + Enter で改行 | Enter で送信</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
