import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './index.css';
import Providers from '@/providers';
import { router } from '@/Router';
import RecoilManager from '@/components/RecoilManager';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilManager />
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </RecoilRoot>
  </React.StrictMode>
);
