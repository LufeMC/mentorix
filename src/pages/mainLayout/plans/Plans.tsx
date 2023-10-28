import { useContext, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StripeService from '../../../services/stripe.service';
import { Alert, alertTypes } from '../../../stores/alertStore';
import { AlertContext } from '../../../contexts/alert-context';
import { getCurrentDate } from '../../../utils/date';
import UserService from '../../../services/user.service';
import { FirebaseContext } from '../../../contexts/firebase-context';
import { User } from '../../../types/user';
import { useAuthState } from 'react-firebase-hooks/auth';
import styles from './Plans.module.scss';
import WhiteButton from '../../../components/whiteButton/WhiteButton';
import { UserAtom } from '../../../stores/userStore';
import { useAtom, useAtomValue } from 'jotai';
import { LoadingAtom } from '../../../stores/loadingStore';
import { logEvent } from 'firebase/analytics';

export default function Plans() {
  const { checkoutSessionId } = useParams();
  const retrievingCheckout = useRef<boolean>(false);
  const alertContext = useContext(AlertContext);
  const firebaseContext = useContext(FirebaseContext);
  const [user, loading] = useAuthState(firebaseContext.auth);

  const [userAtom, setUserAtom] = useAtom(UserAtom);
  const loadingLog = useAtomValue(LoadingAtom);
  const navigate = useNavigate();

  const logging = useRef<boolean>(false);

  useEffect(() => {
    if (!loading && user && !loadingLog) {
      if (!userAtom) {
        navigate('/');
      } else {
        if (!retrievingCheckout.current && checkoutSessionId) {
          retrievingCheckout.current = true;
          retrieveCheckoutSession(checkoutSessionId);
        }
        // window.open('https://buy.stripe.com/test_fZeg0qajF0S079S3cc');
      }

      if (!logging.current) {
        logging.current = true;
        logEvent(firebaseContext.analytics, 'plans_page_open');
        logging.current = false;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingLog]);

  const handleAlert = (text: string, type: keyof typeof alertTypes) => {
    const newAlert: Alert = {
      message: text,
      type,
    };

    alertContext.startAlert(newAlert);
  };

  const retrieveCheckoutSession = async (checkoutSessionId: string) => {
    try {
      const checkoutSession = await StripeService.retrieveCheckoutSession(checkoutSessionId);

      if (checkoutSession.payment_status === 'paid') {
        handleAlert('Your payment has been completed. Congratulations!', 'success');
        const userCopy = structuredClone(userAtom);
        userCopy!.premium = true;
        userCopy!.planRenewalDate = getCurrentDate();
        userCopy!.customerId = checkoutSession.customer;

        UserService.updateUser(firebaseContext.firestore, userCopy as User, setUserAtom);
        navigate('/plans');
        logEvent(firebaseContext.analytics, 'plan_paid_success');
      } else {
        handleAlert('There was a problem with your payment. Please, check your card details and try again', 'error');
        logEvent(firebaseContext.analytics, 'plan_paid_error');
      }
    } catch (err) {
      navigate('/');
      logEvent(firebaseContext.analytics, 'plan_paid_error');
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
            <h2>Free plan{!userAtom?.premium ? ' (Your plan)' : ''}</h2>
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
            <h2>Premium plan{userAtom?.premium ? ' (Your plan)' : ''}</h2>
            <h2>$5/month</h2>
            <ul>
              <li>Unlimited recipes per month</li>
              <li>Unlimited saved recipes</li>
            </ul>
          </div>
          <div className={styles.actions}>
            <WhiteButton
              text={userAtom?.premium ? 'Manage your plan' : 'Select this plan'}
              onClick={() => {
                logEvent(firebaseContext.analytics, userAtom?.premium ? 'manage_plan_select' : 'premium_plan_select');
                window.open(
                  userAtom?.premium
                    ? // ? 'https://billing.stripe.com/p/login/test_14keYK52Y8Td6yI8ww'
                      'https://billing.stripe.com/p/login/6oE4k5cw8cxZc483cc'
                    : // : 'https://buy.stripe.com/test_fZeg0qajF0S079S3cc',
                      'https://buy.stripe.com/cN22b6ePh8du3Ru288',
                  '_blank',
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
