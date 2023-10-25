import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './index.css';
import Providers from '@/providers';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <Providers>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Providers>
    </RecoilRoot>
  </React.StrictMode>
);
