import React, { useState } from 'react';
import './CopilotChat.css';

export const CopilotChat: React.FC<{ open?: boolean; onClose?: () => void }> = ({ open = true, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your Copilot agent. Ask me anything about 365 Evergreen.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    // Placeholder: Here you would call Azure AI/Bot API
    setTimeout(() => {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'This is a placeholder response using WordPress knowledge.' }]);
    }, 600);
  };

  if (!open) return null;

  return (
    <div className="chatRoot">
      <div className="chatHeader">Copilot Chat (Azure AI)</div>
      <div className="chatMessages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? 'userMsg' : 'botMsg'}>
            {msg.text}
          </div>
        ))}
      </div>
      <form className="chatForm" onSubmit={handleSend}>
        <input
          className="chatInput"
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="appButton chatBtn">Send</button>
      </form>
      <div className="chatFooter">
        <small>Knowledge: WordPress content | Write: Dataverse (coming soon)</small>
      </div>
      {onClose && (
        <button className="appButton chatCloseBtn" onClick={onClose} title="Close chat">×</button>
      )}
    </div>
  );
};
