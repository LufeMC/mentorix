import { useContext, useEffect } from 'react';
import Logo from '../../assets/img/logo-version-2.svg';
import styles from './StartScreen.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../contexts/firebase-context';

export default function StartScreen() {
  const firebaseContext = useContext(FirebaseContext);
  const [user, loading] = useAuthState(firebaseContext.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      const url = window.location.pathname;
      navigate(`/auth?next=${url}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div className={`${styles.startScreen} ${!loading ? styles.doneStartScreen : ''}`}>
      <img src={Logo} alt="logo" />
    </div>
  );
}
