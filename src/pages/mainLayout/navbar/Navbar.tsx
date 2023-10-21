import { Link } from 'react-router-dom';
import Logo from '../../../assets/img/logo.svg';
import useUserStore from '../../../stores/userStore';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const userStore = useUserStore();

  return (
    <nav className={styles.navbar}>
      <div className={styles.mainOptions}>
        <img src={Logo} alt="logo" />
        {userStore.user && (
          <div>
            <Link to="/">Home</Link>
            <Link to="/">My Recipes</Link>
            <Link to="/">My Plan</Link>
          </div>
        )}
      </div>
      {userStore.user ? <span>Logout</span> : <Link to="/auth">Login</Link>}
    </nav>
  );
}
