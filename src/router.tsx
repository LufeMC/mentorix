import { createBrowserRouter } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import HomePage from './pages/home/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
]);

export default router;
