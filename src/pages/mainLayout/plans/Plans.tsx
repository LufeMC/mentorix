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

  return <div></div>;
}
