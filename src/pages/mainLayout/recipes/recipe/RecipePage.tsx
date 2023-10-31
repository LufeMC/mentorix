import { useContext, useEffect, useRef } from 'react';
import styles from './RecipePage.module.scss';
import { FirebaseContext } from '../../../../contexts/firebase-context';
import { useNavigate, useParams } from 'react-router-dom';
import RecipeService from '../../../../services/recipe.service';
import { Recipe, recipeRedirects } from '../../../../types/recipe';
import Step from './components/step/Step';
import RecipeDetails from './components/details/Details';
import { BsBookmarkFill, BsBookmark, BsTrash } from 'react-icons/bs';
import { LuShare } from 'react-icons/lu';
import { AlertContext } from '../../../../contexts/alert-context';
import { Alert, alertTypes } from '../../../../stores/alertStore';
import { RecipeAtom, RecipesAtom } from '../../../../stores/recipesStore';
import { useAtom, useSetAtom } from 'jotai';
import { UserAtom } from '../../../../stores/userStore';
import { logEvent } from 'firebase/analytics';
import { CurrentPageAtom } from '../../../../stores/loadingStore';

export default function RecipePage() {
  const firebaseContext = useContext(FirebaseContext);
  const alertContext = useContext(AlertContext);
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useAtom(UserAtom);
  const [recipes, setRecipes] = useAtom(RecipesAtom);
  const [recipe, setRecipe] = useAtom(RecipeAtom);
  const setCurrentPage = useSetAtom(CurrentPageAtom);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const logging = useRef<boolean>(false);

  useEffect(() => {
    if (recipeId) {
      getRecipe(recipeId);
      setCurrentPage('recipes-open-recipe');
    }

    if (!logging.current) {
      logging.current = true;
      logEvent(firebaseContext.analytics, 'recipe_open');
      logging.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  useEffect(() => {
    if (contentRef.current && window.innerWidth <= 700) {
      contentRef.current.scrollTop = -contentRef.current.scrollHeight;
    }
  }, [recipe]);

  const getRecipe = async (recipeId: string) => {
    let recipe = recipes!.find((recipe) => recipe.id === recipeId);
    // const recipeGenerated = window.sessionStorage.getItem('recipeGenerated');

    if (!recipe) {
      const newRecipe = await RecipeService.getRecipeById(firebaseContext.firestore, recipeId);

      if (typeof recipe === 'string') {
        alertHandler("This recipe doesn't exist", 'warning');

        navigate('/');
      } else {
        recipe = newRecipe as Recipe | undefined;
      }
    }

    if (recipe) {
      setRecipe(recipe);
      redirectActions(recipe as Recipe);
    }
  };

  const redirectActions = async (recipe: Recipe) => {
    const action = window.sessionStorage.getItem('action') as keyof typeof recipeRedirects;

    if (action) {
      switch (action) {
        case 'share': {
          shareRecipe(recipe);
          break;
        }
        case 'bookmark': {
          bookmarkRecipe(recipe);
          break;
        }
      }
    }

    window.sessionStorage.removeItem('action');
  };

  const alertHandler = (text: string, type: keyof typeof alertTypes) => {
    const newAlert: Alert = {
      message: text,
      type,
    };
    alertContext.startAlert(newAlert);
  };

  const shareRecipe = (newRecipe?: Recipe) => {
    RecipeService.shareRecipe(alertHandler, newRecipe, recipe as Recipe);
  };

  const bookmarkRecipe = async (newRecipe?: Recipe) => {
    await RecipeService.bookmarkRecipe(
      firebaseContext.firestore,
      user,
      setUser,
      recipes,
      setRecipes,
      newRecipe ? newRecipe : (recipe as Recipe),
    );
  };

  const unbookmarkRecipe = async (redirect = false) => {
    await RecipeService.unBookmarkRecipe(
      firebaseContext.firestore,
      user,
      setUser,
      recipes,
      setRecipes,
      recipe as Recipe,
    );

    if (redirect) {
      navigate('/recipes');
    }
  };

  return (
    <div className={`${styles.recipe} ${recipe && !recipe.img ? styles.recipeNoImage : ''}`}>
      {recipe && (
        <div ref={contentRef} className={styles.content}>
          <div className={styles.instructionsContainer}>
            <div className={styles.title}>
              <h1>{recipe.title}</h1>
              {recipe.mealType || recipe.servings ? (
                <div className={styles.titleDetails}>
                  {recipe.mealType ? <h4>{recipe.mealType}</h4> : null}
                  {recipe.servings ? <h4>{recipe.servings} Servings</h4> : null}
                </div>
              ) : null}
            </div>
            <div className={styles.instructions}>
              <h2>Instructions</h2>
              <div className={styles.steps}>
                {recipe.instructions.map((instruction, index) => (
                  <Step text={instruction} step={index + 1} key={instruction} />
                ))}
              </div>
            </div>
          </div>
          <div className={styles.details}>
            <h1>{recipe.title}</h1>
            <RecipeDetails recipe={recipe} />
            <div className={styles.actions}>
              {user && user.premium && recipe.creatorId && recipe.creatorId !== user.id ? (
                user.recipes.includes(recipe.id) ? (
                  <BsBookmarkFill onClick={() => unbookmarkRecipe()} />
                ) : (
                  <BsBookmark onClick={() => bookmarkRecipe()} />
                )
              ) : null}
              {user && user.recipes.includes(recipe.id) && recipe.creatorId && recipe.creatorId === user.id ? (
                <BsTrash onClick={() => unbookmarkRecipe(true)} />
              ) : null}
              <LuShare onClick={() => shareRecipe()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
