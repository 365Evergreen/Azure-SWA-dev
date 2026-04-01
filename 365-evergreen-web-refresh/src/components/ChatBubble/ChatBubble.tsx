import React from 'react';
import './ChatBubble.css';

export const ChatBubble: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button className="chatBubble" onClick={onClick} title="Chat with Copilot">
    <span role="img" aria-label="chat">💬</span>
  </button>
);
