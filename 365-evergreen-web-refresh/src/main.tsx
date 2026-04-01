import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FluentProvider>
  </StrictMode>
);
