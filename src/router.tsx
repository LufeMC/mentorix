import { Navigate, createBrowserRouter } from 'react-router-dom';
// import AuthPage from './pages/auth/AuthPage';
import MainLayout from './pages/mainLayout/MainLayout';
import HomePage from './pages/mainLayout/home/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
    ],
  },
  // {
  //   path: '/auth',
  //   element: <AuthPage />,
  // },
  {
    path: '*', // Wildcard route for handling unknown paths
    element: <Navigate to="/" replace />, // Redirect to the home page
  },
]);

export default router;
