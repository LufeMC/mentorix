import { useContext, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StripeService from '../../../services/stripe.service';
import { Alert, alertTypes } from '../../../stores/alertStore';
import { AlertContext } from '../../../contexts/alert-context';
import useUserStore from '../../../stores/userStore';
import { getCurrentDate } from '../../../utils/date';
import UserService from '../../../services/user.service';
import { FirebaseContext } from '../../../contexts/firebase-context';
import { User } from '../../../types/user';
import { useAuthState } from 'react-firebase-hooks/auth';
import styles from './Plans.module.scss';
import WhiteButton from '../../../components/whiteButton/WhiteButton';

export default function Plans() {
  const { checkoutSessionId } = useParams();
  const retrievingCheckout = useRef<boolean>(false);
  const alertContext = useContext(AlertContext);
  const firebaseContext = useContext(FirebaseContext);
  const [user, loading] = useAuthState(firebaseContext.auth);

  const userStore = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && !userStore.loggingIn) {
      if (!userStore.user) {
        navigate('/');
      } else {
        if (!retrievingCheckout.current && checkoutSessionId) {
          retrievingCheckout.current = true;
          retrieveCheckoutSession(checkoutSessionId);
        }
        // window.open('https://buy.stripe.com/test_fZeg0qajF0S079S3cc');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.loggingIn]);

  const handleAlert = (text: string, type: keyof typeof alertTypes) => {
    const newAlert: Alert = {
      message: text,
      type,
    };

    alertContext.setAlert(newAlert);
  };

  const retrieveCheckoutSession = async (checkoutSessionId: string) => {
    try {
      const checkoutSession = await StripeService.retrieveCheckoutSession(checkoutSessionId);

      if (checkoutSession.payment_status === 'paid') {
        handleAlert('Your payment has been completed. Congratulations!', 'success');
        const userCopy = structuredClone(userStore.user);
        userCopy!.premium = true;
        userCopy!.planRenewalDate = getCurrentDate();
        userCopy!.customerId = checkoutSession.customer;

        UserService.updateUser(firebaseContext.firestore, userCopy as User, userStore);
        navigate('/plans');
      } else {
        handleAlert('There was a problem with your payment. Please, check your card details and try again', 'error');
      }
    } catch (err) {
      navigate('/');
    } finally {
      retrievingCheckout.current = false;
    }
  };

  return (
    <div className={styles.plansContainer}>
      <h1>Plans</h1>
      <div className={styles.plans}>
        <div className={styles.plan}>
          <div className={styles.content}>
            <h2>Free plan{!userStore.user?.premium ? ' (Your plan)' : ''}</h2>
            <h2>$0/month</h2>
            <ul>
              <li>20 recipes per month</li>
              <li>No saved recipes</li>
            </ul>
          </div>
          <div className={styles.actions}></div>
        </div>
        <div className={styles.plan}>
          <div className={styles.content}>
            <h2>Premium plan{userStore.user?.premium ? ' (Your plan)' : ''}</h2>
            <h2>$5/month</h2>
            <ul>
              <li>Unlimited recipes per month</li>
              <li>Unlimited saved recipes</li>
            </ul>
          </div>
          <div className={styles.actions}>
            <WhiteButton
              text={userStore.user?.premium ? 'Manage your plan' : 'Select this plan'}
              loading={false}
              onClick={() =>
                window.open(
                  userStore.user?.premium
                    ? 'https://billing.stripe.com/p/login/test_14keYK52Y8Td6yI8ww'
                    : 'https://buy.stripe.com/test_fZeg0qajF0S079S3cc',
                  '_blank',
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
