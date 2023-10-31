import styles from './MainLayout.module.scss';
import Navbar from '../../components/navbar/Navbar';
import { Outlet } from 'react-router-dom';
import StartScreen from '../../components/startScreen/StartScreen';
import Sidebar from '../../components/sidebar/Sidebar';
import { useAtomValue } from 'jotai';
import { Controls, Player } from '@lottiefiles/react-lottie-player';
import LoadingRecipeAnimation from '../../assets/jsons/loadingRecipeAnimation.json';
import { LoadingRecipeAtom, RecipeAtom } from '../../stores/recipesStore';
import { CurrentPageAtom } from '../../stores/loadingStore';
import { useEffect } from 'react';

export default function MainLayout() {
  const loadingRecipe = useAtomValue(LoadingRecipeAtom);
  const recipeAtom = useAtomValue(RecipeAtom);
  const currentPage = useAtomValue(CurrentPageAtom);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // Facebook in-app browser
    const isFacebookApp = userAgent.includes('FBAN') || userAgent.includes('FBAV');

    // Instagram in-app browser
    const isInstagramApp = userAgent.includes('Instagram');

    // Twitter in-app browser
    const isTwitterApp = userAgent.includes('Twitter');

    // Line in-app browser
    const isLineApp = userAgent.includes('Line');

    // This is a simple heuristic and might not be 100% reliable
    const isInAppBrowser = isFacebookApp || isInstagramApp || isTwitterApp || isLineApp;

    if (isInAppBrowser) {
      const schemeUrl = `googlechrome://navigate?url=${encodeURIComponent(window.location.href)}`;
      window.location.href = schemeUrl;
    }
  });

  return (
    <div className={styles.mainLayout}>
      {recipeAtom && recipeAtom.img && currentPage.includes('open-recipe') && (
        <div className={styles.backgroundOverlay} style={{ backgroundImage: `url(${recipeAtom.img})` }}></div>
      )}
      {loadingRecipe ? (
        <div className={styles.overScreen}>
          <Player autoplay loop src={LoadingRecipeAnimation} style={{ width: '300px' }}>
            <Controls visible={false} />
          </Player>
          <h3>Creating your recipe, don&#39;t leave this page</h3>
        </div>
      ) : null}
      <StartScreen />
      <div className={styles.desktopSidebar}>
        <Sidebar />
      </div>
      <div className={styles.contentContainer}>
        <Navbar />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      <div className={styles.phoneFooter}>
        <Sidebar />
      </div>
    </div>
  );
}
