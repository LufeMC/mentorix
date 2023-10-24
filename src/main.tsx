import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import FirebaseProvider from './contexts/firebase-context';
import AlertProvider from './contexts/alert-context';
import Alert from './components/alert/Alert';
import { Provider } from 'jotai';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <FirebaseProvider>
        <AlertProvider>
          <Alert />
          <RouterProvider router={router} />
        </AlertProvider>
      </FirebaseProvider>
    </Provider>
  </React.StrictMode>,
);
