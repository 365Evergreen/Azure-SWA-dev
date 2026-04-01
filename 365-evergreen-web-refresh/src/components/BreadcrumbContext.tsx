import React, { createContext, useContext, useState } from 'react';
import { Breadcrumb, BreadcrumbItem } from '@fluentui/react-components';

export type BreadcrumbEntry = { text: string; href: string };

type BreadcrumbContextType = {
  items: BreadcrumbEntry[];
  setItems: (items: BreadcrumbEntry[]) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BreadcrumbEntry[]>([]);
  return (
    <BreadcrumbContext.Provider value={{ items, setItems }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  return ctx;
};

export const BreadcrumbBar: React.FC = () => {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) return null;
  const { items } = ctx;
  if (!items || items.length === 0) return null;
  return (
    <div className="global-breadcrumb-wrap" style={{ padding: '1rem' }}>
      <Breadcrumb className="global-breadcrumb">
        {items.map((item, idx) => (
          <BreadcrumbItem key={item.href + '-' + idx}>
            {idx < items.length - 1 ? (
              <a href={item.href} style={{ color: 'inherit', textDecoration: 'none' }}>{item.text}</a>
            ) : (
              <span>{item.text}</span>
            )}
            {idx < items.length - 1 && <span style={{ margin: '0 0.5em', color: '#888' }}>/</span>}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbContext;
