import { createBrowserRouter } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import MainLayout from './pages/mainLayout/MainLayout';
import RecipePage from './pages/mainLayout/recipes/recipe/RecipePage';
import HomePage from './pages/mainLayout/home/HomePage';
import RecipesPage from './pages/mainLayout/recipes/RecipesPage';
import Plans from './pages/mainLayout/plans/Plans';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: ':origin?',
        element: <HomePage />,
      },
      {
        path: 'recipes',
        element: <RecipesPage />,
      },
      {
        path: 'plans/:checkoutSessionId?',
        element: <Plans />,
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
