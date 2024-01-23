import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ActiveRouteProvider } from './utils/providers/ActiveRouteContext';

const rootElement = document.getElementById('root');

const appRoot = ReactDOM.createRoot(rootElement);

appRoot.render(
  <BrowserRouter>
    <ActiveRouteProvider>
      <App />
    </ActiveRouteProvider>
  </BrowserRouter>
);
