import { createBrowserRouter } from 'react-router-dom';
import Test from './pages/test';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Test />,
  },
]);

export default router;
