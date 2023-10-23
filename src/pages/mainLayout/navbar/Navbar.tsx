import { Link } from 'react-router-dom';
import Logo from '../../../assets/img/logo.svg';
import LogoWhite from '../../../assets/img/logo-white.svg';
import useUserStore from '../../../stores/userStore';
import styles from './Navbar.module.scss';
import useRecipesStore from '../../../stores/recipesStore';
import { useContext } from 'react';
import { FirebaseContext } from '../../../contexts/firebase-context';
import { signOut } from 'firebase/auth';
import { AlertContext } from '../../../contexts/alert-context';
import { Alert } from '../../../stores/alertStore';

interface NavbarProps {
  darkSchema?: boolean;
}

export default function Navbar(props: NavbarProps) {
  const userStore = useUserStore();
  const recipesStore = useRecipesStore();
  const firebaseContext = useContext(FirebaseContext);
  const alertContext = useContext(AlertContext);

  const logout = async () => {
    signOut(firebaseContext.auth);
    await userStore.logout();
    await recipesStore.logout();

    const newAlert: Alert = {
      message: 'Logged out successfully',
      type: 'success',
    };
    alertContext.setAlert(newAlert);
  };

  return (
    <nav
      className={`${styles.navbar} ${recipesStore.creatingRecipe ? styles.creatingRecipe : ''} ${
        props.darkSchema ? styles.darkSchema : ''
      }`}
    >
      <div className={styles.mainOptions}>
        <img src={props.darkSchema ? LogoWhite : Logo} alt="logo" />
        {!userStore.loggingIn &&
          (userStore.user ? (
            <div>
              <Link to={recipesStore.creatingRecipe ? '#' : '/'}>Home</Link>
              <Link to={recipesStore.creatingRecipe ? '#' : '/'}>My Recipes</Link>
              <Link to={recipesStore.creatingRecipe ? '#' : '/'}>My Plan</Link>
            </div>
          ) : (
            <div>
              <Link to={recipesStore.creatingRecipe ? '#' : '/'}>Home</Link>
            </div>
          ))}
      </div>
      {!userStore.loggingIn &&
        (userStore.user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link to={recipesStore.creatingRecipe ? '#' : '/auth'}>Login</Link>
        ))}
    </nav>
  );
}
