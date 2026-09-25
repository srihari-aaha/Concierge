import React, { useState } from 'react';
import { Send, UserCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import './MessageCenter.css';

export default function MessageCenter() {
  const { messages, sendMessage, currentUser, currentRole } = useApp();
  const [activeConvId, setActiveConvId] = useState(messages[0]?.id || 'conv-1');
  const [inputText, setInputText] = useState('');

  const activeConv = messages.find((c) => c.id === activeConvId) || messages[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="message-center-card">
      {/* Sidebar: Conversation List */}
      <div className="message-sidebar">
        <div className="message-sidebar-header">
          <MessageSquare size={16} className="header-icon" />
          <h3 className="message-sidebar-title">Stay Conversations</h3>
        </div>
        <div className="conversations-list">
          {messages.map((c) => (
            <div
              key={c.id}
              className={`conv-item ${c.id === activeConvId ? 'active' : ''}`}
              onClick={() => setActiveConvId(c.id)}
            >
              <div className="conv-item-top">
                <span className="conv-property-tag">{c.property}</span>
                <span className="conv-time">
                  {c.messages[c.messages.length - 1]?.time || 'Today'}
                </span>
              </div>
              <div className="conv-participants">{c.participants.join(' • ')}</div>
              <p className="conv-last-msg">
                {c.messages[c.messages.length - 1]?.text || 'No messages yet'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Thread */}
      <div className="message-main">
        {activeConv ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-title-row">
                  <h4 className="chat-partner-name">{activeConv.property}</h4>
                  <span className="online-badge">
                    <span className="online-dot" /> Online Concierge
                  </span>
                </div>
                <span className="chat-participants-sub">
                  {activeConv.participants.join(' and ')}
                </span>
              </div>
            </div>

            <div className="chat-bubbles-container">
              {activeConv.messages.map((m) => {
                const isMe = m.senderRole === currentRole;
                return (
                  <div
                    key={m.id}
                    className={`message-bubble-row ${isMe ? 'row-me' : 'row-them'}`}
                  >
                    <div className={`message-bubble ${isMe ? 'bubble-me' : 'bubble-them'}`}>
                      {!isMe && m.senderRole && (
                        <div className="bubble-sender-name" style={{ textTransform: 'capitalize' }}>
                          {m.senderRole}
                        </div>
                      )}
                      <p className="bubble-text">{m.text}</p>
                      <div className="bubble-timestamp">{m.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSend} className="chat-input-bar">
              <input
                type="text"
                className="chat-input"
                placeholder={`Message as ${currentRole}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Button variant="primary" size="md" type="submit" icon={Send}>
                Send
              </Button>
            </form>
          </>
        ) : (
          <div className="chat-empty">No conversation selected</div>
        )}
      </div>
    </div>
  );
}
