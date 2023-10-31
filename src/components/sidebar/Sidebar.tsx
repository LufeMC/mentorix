import SymbolBlack from '../../assets/img/cookii-symbol-black.svg';
import SymbolWhite from '../../assets/img/cookii-symbol-white.svg';
import styles from './Sidebar.module.scss';
import { CurrentPageAtom, LoadingAtom } from '../../stores/loadingStore';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import Home from '../../assets/img/home.svg';
import HomeWhite from '../../assets/img/home-white.svg';
import Book from '../../assets/img/book.svg';
import BookWhite from '../../assets/img/book-white.svg';
import Net from '../../assets/img/net.svg';
import NetWhite from '../../assets/img/net-white.svg';
import Logout from '../../assets/img/logout.svg';
import LogoutWhite from '../../assets/img/logout-white.svg';
import { useNavigate } from 'react-router-dom';
import {
  CommunityRecipesAtom,
  LoadingRecipeAtom,
  RecipeAtom,
  RecipesAtom,
  TodayCommunityRecipesAtom,
} from '../../stores/recipesStore';
import { signOut } from 'firebase/auth';
import { UserAtom } from '../../stores/userStore';
import { useContext } from 'react';
import { FirebaseContext } from '../../contexts/firebase-context';
import { Alert } from '../../stores/alertStore';
import { AlertContext } from '../../contexts/alert-context';

export default function Sidebar() {
  const currentPage = useAtomValue(CurrentPageAtom);
  const [loadingLog, setLoadingLog] = useAtom(LoadingAtom);
  const loadingRecipe = useAtomValue(LoadingRecipeAtom);
  const [recipeAtom, setRecipeAtom] = useAtom(RecipeAtom);
  const setUser = useSetAtom(UserAtom);
  const setRecipes = useSetAtom(RecipesAtom);
  const setCommunityRecipes = useSetAtom(CommunityRecipesAtom);
  const setTodayCommunityRecipes = useSetAtom(TodayCommunityRecipesAtom);
  const navigate = useNavigate();

  const firebaseContext = useContext(FirebaseContext);
  const alertContext = useContext(AlertContext);

  const redirectTo = (newPage: string) => {
    navigate(`/${newPage}`);
  };

  const logout = async () => {
    setLoadingLog(true);

    signOut(firebaseContext.auth);
    setRecipes([]);
    setCommunityRecipes([]);
    setTodayCommunityRecipes([]);
    setRecipeAtom(null);
    setUser(null);

    setLoadingLog(false);

    const newAlert: Alert = {
      message: 'Logged out successfully',
      type: 'success',
    };
    alertContext.startAlert(newAlert);
    navigate('/auth');
  };

  return (
    <nav
      className={`${styles.sidebar} ${loadingRecipe ? styles.loadingRecipe : ''} ${
        recipeAtom && recipeAtom.img && currentPage.includes('open-recipe') ? styles.recipeImageOpen : ''
      }`}
    >
      <img
        className={styles.logo}
        src={recipeAtom && recipeAtom.img && currentPage.includes('open-recipe') ? SymbolWhite : SymbolBlack}
        alt="Cookii symbol black"
      />
      <div className={styles.navigation}>
        <button
          className={`${currentPage.includes('home') ? styles.active : ''}`}
          onClick={() => (loadingRecipe || loadingLog ? {} : redirectTo(''))}
        >
          {currentPage.includes('home') ? (
            <img
              src={recipeAtom && recipeAtom.img && currentPage.includes('open-recipe') ? Home : HomeWhite}
              alt="home navigation"
            />
          ) : (
            <img
              src={recipeAtom && recipeAtom.img && currentPage.includes('open-recipe') ? HomeWhite : Home}
              alt="home navigation"
            />
          )}
        </button>
        <button
          className={`${currentPage.includes('recipes') ? styles.active : ''}`}
          onClick={() => (loadingRecipe || loadingLog ? {} : redirectTo('recipes'))}
        >
          {currentPage.includes('recipes') ? (
            <img
              src={recipeAtom && recipeAtom.img && currentPage.includes('open-recipe') ? Book : BookWhite}
              alt="recipes navigation"
            />
          ) : (
            <img
              src={recipeAtom && recipeAtom.img && currentPage.includes('open-recipe') ? BookWhite : Book}
              alt="recipes navigation"
            />
          )}
        </button>
        <button
          className={`${currentPage.includes('community') ? styles.active : ''}`}
          onClick={() => (loadingRecipe || loadingLog ? {} : redirectTo('community'))}
        >
          {currentPage.includes('community') ? (
            <img
              src={recipeAtom && recipeAtom.img && currentPage.includes('open-recipe') ? Net : NetWhite}
              alt="net navigation"
            />
          ) : (
            <img
              src={recipeAtom && recipeAtom.img && currentPage.includes('open-recipe') ? NetWhite : Net}
              alt="net navigation"
            />
          )}
        </button>
      </div>
      <button onClick={() => (loadingRecipe || loadingLog ? {} : logout())}>
        <img
          src={recipeAtom && recipeAtom.img && currentPage.includes('open-recipe') ? LogoutWhite : Logout}
          alt="logout"
        />
      </button>
    </nav>
  );
}
