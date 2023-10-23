import styles from './MainLayout.module.scss';
import Navbar from '../../components/navbar/Navbar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className={styles.mainLayout}>
      <Navbar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
