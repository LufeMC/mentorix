import { createBrowserRouter } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import MainLayout from './pages/mainLayout/MainLayout';
import RecipePage from './pages/mainLayout/recipes/recipe/RecipePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
  },
  {
    path: '/recipes/:recipeId',
    element: <RecipePage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
]);

export default router;
