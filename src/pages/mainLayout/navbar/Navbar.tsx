import { Link } from 'react-router-dom';
import Logo from '../../../assets/img/logo.svg';
import LogoWhite from '../../../assets/img/logo-white.svg';
import useUserStore from '../../../stores/userStore';
import styles from './Navbar.module.scss';
import useRecipesStore from '../../../stores/recipesStore';

interface NavbarProps {
  darkSchema?: boolean;
}

export default function Navbar(props: NavbarProps) {
  const userStore = useUserStore();
  const recipesStore = useRecipesStore();

  const logout = () => {
    userStore.logout();
    recipesStore.logout();
  };

  return (
    <nav
      className={`${styles.navbar} ${recipesStore.creatingRecipe ? styles.creatingRecipe : ''} ${
        props.darkSchema ? styles.darkSchema : ''
      }`}
    >
      <div className={styles.mainOptions}>
        <img src={props.darkSchema ? LogoWhite : Logo} alt="logo" />
        <Link to={recipesStore.creatingRecipe ? '#' : '/'}>Home</Link>
        {userStore.user && (
          <div>
            <Link to={recipesStore.creatingRecipe ? '#' : '/'}>My Recipes</Link>
            <Link to={recipesStore.creatingRecipe ? '#' : '/'}>My Plan</Link>
          </div>
        )}
      </div>
      {userStore.user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link to={recipesStore.creatingRecipe ? '#' : '/auth'}>Login</Link>
      )}
    </nav>
  );
}
