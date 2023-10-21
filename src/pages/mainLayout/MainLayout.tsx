import styles from './MainLayout.module.scss';
import Navbar from './navbar/Navbar';
import HomePage from './home/HomePage';

export default function MainLayout() {
  return (
    <div className={styles.mainLayout}>
      <Navbar />
      <div className={styles.content}>
        <HomePage />
      </div>
    </div>
  );
}
