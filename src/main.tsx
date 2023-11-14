import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './index.css';
import Providers from '@/providers';
import { router } from '@/Router';
import FirebaseSideEffects from '@/firebase/firebase';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <FirebaseSideEffects>
        <Providers>
          <RouterProvider router={router} />
        </Providers>
      </FirebaseSideEffects>
    </RecoilRoot>
  </React.StrictMode>
);
