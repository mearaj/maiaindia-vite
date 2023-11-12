import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './index.css';
import Providers from '@/providers';
import FirebaseWatcher from '@/misc/firebaseWatcher';
import { router } from '@/Router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <FirebaseWatcher>
        <Providers>
          <RouterProvider router={router} />
        </Providers>
      </FirebaseWatcher>
    </RecoilRoot>
  </React.StrictMode>
);
