import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import FirebaseProvider from './contexts/firebase-context';
import { Provider } from 'jotai';
import { Toaster } from './components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <FirebaseProvider>
        <RouterProvider router={router} />
        <Toaster />
      </FirebaseProvider>
    </Provider>
  </React.StrictMode>,
);
