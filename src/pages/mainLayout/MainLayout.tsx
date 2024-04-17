import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="h-full w-full">
      <Outlet />
    </div>
  );
}
