import { createBrowserRouter } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import MainLayout from './pages/mainLayout/MainLayout';
import RecipePage from './pages/mainLayout/recipes/recipe/RecipePage';
import HomePage from './pages/mainLayout/home/HomePage';
import RecipesPage from './pages/mainLayout/recipes/RecipesPage';
import Profile from './pages/mainLayout/profile/Profile';
import CreateRecipe from './pages/mainLayout/recipes/createRecipe/CreateRecipe';
import PaymentConfirmation from './pages/mainLayout/paymentConfirmation/PaymentConfirmation';
import CommunityPage from './pages/mainLayout/community/CommunityPage';

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
        path: 'recipes/:recipeId',
        element: <RecipePage />,
      },
      {
        path: 'recipes/new',
        element: <CreateRecipe />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'community',
        element: <CommunityPage />,
      },
      {
        path: 'payment-confirmation/:checkoutSessionId?',
        element: <PaymentConfirmation />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
]);

export default router;
