import React, { useState } from 'react';
import '../Tabs.css';

export interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="tabs-root">
      <div className="tabs-list">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`tabs-tab${selected === idx ? ' tabs-tab--active' : ''}`}
            onClick={() => setSelected(idx)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs[selected]?.content}
      </div>
    </div>
  );
};
