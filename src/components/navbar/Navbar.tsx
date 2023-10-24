import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/img/logo.svg';
import LogoWhite from '../../assets/img/logo-white.svg';
import styles from './Navbar.module.scss';
import { useContext } from 'react';
import { FirebaseContext } from '../../contexts/firebase-context';
import { signOut } from 'firebase/auth';
import { AlertContext } from '../../contexts/alert-context';
import { Alert } from '../../stores/alertStore';
import IpAddressService from '../../services/ipAddress.service';
import { LoadingAtom } from '../../stores/loadingStore';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { LoadingRecipeAtom, RecipesAtom } from '../../stores/recipesStore';
import { UserAtom } from '../../stores/userStore';
import { TempUserAtom } from '../../stores/tempUserStore';
import { AiOutlineMail } from 'react-icons/ai';

interface NavbarProps {
  darkSchema?: boolean;
}

export default function Navbar(props: NavbarProps) {
  const [user, setUser] = useAtom(UserAtom);
  const setTempUser = useSetAtom(TempUserAtom);
  const setRecipes = useSetAtom(RecipesAtom);
  const loadingRecipe = useAtomValue(LoadingRecipeAtom);
  const [loadingLog, setLoadingLog] = useAtom(LoadingAtom);
  const firebaseContext = useContext(FirebaseContext);
  const alertContext = useContext(AlertContext);
  const navigate = useNavigate();

  const logout = async () => {
    setLoadingLog(true);

    signOut(firebaseContext.auth);
    setRecipes([]);
    setUser(null);
    await IpAddressService.retrieveTempUser(firebaseContext.firestore, setTempUser);

    setLoadingLog(false);

    const newAlert: Alert = {
      message: 'Logged out successfully',
      type: 'success',
    };
    alertContext.startAlert(newAlert);
    navigate('/');
  };

  return (
    <nav
      className={`${styles.navbar} ${loadingRecipe ? styles.creatingRecipe : ''} ${
        props.darkSchema ? styles.darkSchema : ''
      }`}
    >
      <div className={styles.mainOptions}>
        <img src={props.darkSchema ? LogoWhite : Logo} alt="logo" />
        {!loadingLog &&
          (user ? (
            <div>
              <Link to={loadingRecipe ? '#' : '/'}>Home</Link>
              <Link to={loadingRecipe ? '#' : '/recipes'}>My Recipes</Link>
              <Link to={loadingRecipe ? '#' : '/plans'}>My Plan</Link>
            </div>
          ) : (
            <div>
              <Link to={loadingRecipe ? '#' : '/'}>Home</Link>
            </div>
          ))}
      </div>
      {!loadingLog && (
        <div className={styles.logOptions}>
          <a href="mailto: luisf.moncer@gmail.com">
            <AiOutlineMail />
          </a>
          {user ? <button onClick={logout}>Logout</button> : <Link to={loadingRecipe ? '#' : '/auth'}>Login</Link>}
        </div>
      )}
    </nav>
  );
}
