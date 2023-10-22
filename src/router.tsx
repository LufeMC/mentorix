import { createBrowserRouter } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import MainLayout from './pages/mainLayout/MainLayout';
import Recipe from './pages/mainLayout/recipes/recipe/Recipe';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
  },
  {
    path: '/recipes/:recipeId',
    element: <Recipe />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
]);

export default router;
