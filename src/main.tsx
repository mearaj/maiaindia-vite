import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './index.css';
import Providers from '@/providers';
import FirebaseProvider from '@/providers/firebase';
import { router } from '@/Router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <FirebaseProvider>
        <Providers>
          <RouterProvider router={router} />
        </Providers>
      </FirebaseProvider>
    </RecoilRoot>
  </React.StrictMode>
);
