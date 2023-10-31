import { useContext, useEffect, useRef, useState } from 'react';
import styles from './PaymentConfirmation.module.scss';
import { Controls, Player } from '@lottiefiles/react-lottie-player';
import PaymentConfirmationAnimation from '../../../assets/jsons/paymentConfirmation.json';
import PaymentErrorAnimation from '../../../assets/jsons/paymentError.json';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../../contexts/firebase-context';
import { logEvent } from 'firebase/analytics';
import StripeService from '../../../services/stripe.service';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { CurrentPageAtom, LoadingAtom } from '../../../stores/loadingStore';
import { UserAtom } from '../../../stores/userStore';
import { getCurrentDate } from '../../../utils/date';
import UserService from '../../../services/user.service';
import { User } from '../../../types/user';
import Button from '../../../components/button/Button';

const statuses = {
  success: 'success',
  error: 'error',
};

export default function PaymentConfirmation() {
  const firebaseContext = useContext(FirebaseContext);
  const [user, loading] = useAuthState(firebaseContext.auth);
  const { checkoutSessionId } = useParams();
  const navigate = useNavigate();

  const loadingLog = useAtomValue(LoadingAtom);
  const [userAtom, setUserAtom] = useAtom(UserAtom);
  const setCurrentPage = useSetAtom(CurrentPageAtom);

  const [dotCounter, setDotCounter] = useState<number>(0);
  const [dotCounterInterval, setDotCounterInterval] = useState<NodeJS.Timeout | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<keyof typeof statuses | null>('error');

  const retrievingCheckout = useRef<boolean>(false);
  const startingAnimation = useRef<boolean>(false);

  useEffect(() => {
    setCurrentPage('');
    if (!startingAnimation.current) {
      startingAnimation.current = true;
      setDotCounterInterval(
        setInterval(() => {
          setDotCounter((prevDotCounter) => (prevDotCounter === 3 ? 0 : prevDotCounter + 1));
        }, 1000),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && user) {
      if (!retrievingCheckout.current && checkoutSessionId) {
        retrievingCheckout.current = true;
        retrieveCheckoutSession(checkoutSessionId);
        logEvent(firebaseContext.analytics, 'confirming_payment');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingLog]);

  const retrieveCheckoutSession = async (checkoutSessionId: string) => {
    try {
      const checkoutSession = await StripeService.retrieveCheckoutSession(checkoutSessionId);
      clearInterval(dotCounterInterval as NodeJS.Timeout);
      setDotCounter(0);
      setDotCounterInterval(
        setInterval(() => {
          setDotCounter((prevDotCounter) => (prevDotCounter === 3 ? 0 : prevDotCounter + 1));
        }, 1000),
      );

      navigate('/payment-confirmation');

      if (checkoutSession.payment_status === 'paid') {
        setPaymentStatus('success');
        const userCopy = structuredClone(userAtom);
        userCopy!.premium = true;
        userCopy!.planRenewalDate = getCurrentDate();
        userCopy!.customerId = checkoutSession.customer;

        await UserService.updateUser(firebaseContext.firestore, userCopy as User, setUserAtom);
        logEvent(firebaseContext.analytics, 'plan_paid_success');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setPaymentStatus('error');
        logEvent(firebaseContext.analytics, 'plan_paid_error');
      }
    } catch (err) {
      setPaymentStatus('error');
      logEvent(firebaseContext.analytics, 'plan_paid_error');
    } finally {
      retrievingCheckout.current = false;
    }
  };

  return (
    <div className={styles.paymentConfirmation}>
      {!paymentStatus ? (
        <h3>Processing your payment, don&#39;t close this page{'.'.repeat(dotCounter)}</h3>
      ) : paymentStatus === 'success' ? (
        <div>
          <Player autoplay loop src={PaymentConfirmationAnimation} style={{ width: '200px' }}>
            <Controls visible={false} />
          </Player>
          <span>Redirecting you to the dashboard{'.'.repeat(dotCounter)}</span>
        </div>
      ) : (
        <div>
          <Player autoplay loop src={PaymentErrorAnimation} style={{ width: '200px' }}>
            <Controls visible={false} />
          </Player>
          <span>Something went wrong</span>
          <Button text="Try again" onClick={() => window.open(import.meta.env.VITE_PAYMENT_LINK, '_self')} />
        </div>
      )}
    </div>
  );
}
