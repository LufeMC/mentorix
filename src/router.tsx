import { createBrowserRouter } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import MainLayout from './pages/mainLayout/MainLayout';
import RecipePage from './pages/mainLayout/recipes/recipe/RecipePage';
import HomePage from './pages/mainLayout/home/HomePage';
import RecipesPage from './pages/mainLayout/recipes/RecipesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'recipes',
        element: <RecipesPage />,
      },
    ],
  },
  {
    path: '/recipes/:recipeId/:shareId?',
    element: <RecipePage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
]);

export default router;
