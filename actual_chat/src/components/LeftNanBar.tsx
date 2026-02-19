import { useEffect, useState } from 'react';
import { NavBarItem } from './NavBarItem';
import { get_chat_sessions_of_particular_client } from '../api/chat_session_manager';
import './LeftNavBar.css';

interface Session {
  SessionID: string;
  Title: string;
  CreatedAt: string;
  LastMessageAt: string;
}

interface LeftNavBarProps {
  onSessionSelect: (sessionId: string) => void;
  activeSessionId: string | null;
  onNewChat: () => void;
}

const LeftNavBar = ({ onSessionSelect, activeSessionId, onNewChat }: LeftNavBarProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      const data = await get_chat_sessions_of_particular_client('client-001');
      setSessions(data);
    };
    loadSessions();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / 3_600_000;

    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <aside className="left-navbar">
      <div className="navbar-header">
        <span className="navbar-title">チャット履歴</span>
      </div>

      <button className="new-chat-button" onClick={onNewChat}>
        <span className="plus-icon">＋</span>
        New Chat
      </button>

      <div className="sessions-list">
        {sessions.length === 0 ? (
          <p className="no-sessions">履歴なし</p>
        ) : (
          sessions.map(session => (
            <NavBarItem
              key={session.SessionID}
              title={session.Title}
              isActive={activeSessionId === session.SessionID}
              onClick={() => onSessionSelect(session.SessionID)}
              timestamp={formatTimestamp(session.LastMessageAt)}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default LeftNavBar;
