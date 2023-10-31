import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { useState } from 'react';
import { CurrentPageAtom, LoadingAtom } from '../../stores/loadingStore';
import { useAtomValue } from 'jotai';
import { LoadingRecipeAtom, RecipeAtom } from '../../stores/recipesStore';
import { UserAtom } from '../../stores/userStore';

import { AiOutlinePlus } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import Button from '../button/Button';
import ShimmerButton from '../button/shimmerButton/ShimmerButton';
import ShimmerText from '../shimmerText/ShimmerText';

interface NavbarProps {
  canCreateRecipe?: boolean;
}

export default function Navbar(props: NavbarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const user = useAtomValue(UserAtom);
  const loadingRecipe = useAtomValue(LoadingRecipeAtom);
  const loadingLog = useAtomValue(LoadingAtom);
  const recipeAtom = useAtomValue(RecipeAtom);
  const currentPage = useAtomValue(CurrentPageAtom);

  const navigate = useNavigate();

  return (
    <nav
      className={`${styles.navbar} ${loadingLog ? styles.loadingLog : ''} ${
        loadingRecipe ? styles.loadingRecipe : ''
      } ${recipeAtom && recipeAtom.img && currentPage.includes('open-recipe') ? styles.recipeImageOpen : ''}`}
    >
      <div className={styles.actions}>
        {!props.canCreateRecipe &&
          (user ? (
            <Button
              text="Create recipe"
              onClick={() => navigate('/recipes/new')}
              icon={<AiOutlinePlus />}
              invisible={currentPage.includes('new')}
              disabled={loadingRecipe}
            />
          ) : (
            <ShimmerButton text="Create recipe" />
          ))}
        <Link to={loadingRecipe ? '#' : '/profile'} className={styles.profile}>
          {user ? (
            <button className={styles.name} onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
              <div className={styles.profileImg}>
                {user.profileImage ? <img src={user.profileImage} alt="small profile" /> : <FaUserAlt />}
              </div>
              <h4>{user?.name.split(' ')[0]}</h4>
            </button>
          ) : (
            <ShimmerText>
              <div className={styles.profileImg}></div>
              <FaUserAlt />
              <h4>Username</h4>
            </ShimmerText>
          )}
        </Link>
      </div>
    </nav>
  );
}
