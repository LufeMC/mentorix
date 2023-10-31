import { AiFillCheckCircle } from 'react-icons/ai';
import styles from './YourPlan.module.scss';
import Button from '../button/Button';

interface YourPlanProps {
  loadingLog: boolean;
}

export default function YourPlan(props: YourPlanProps) {
  return (
    <div className={styles.plans}>
      <h1>Pick the right plan for you!</h1>
      <div className={styles.plansList}>
        <div className={styles.plan}>
          <div className={styles.title}>
            <div className={styles.texts}>
              <h2>Free</h2>
              <span>Ideal for you to try Cookii</span>
            </div>
          </div>
          <div className={styles.details}>
            <h3>Plan details</h3>
            <div className={styles.featureList}>
              <div className={styles.feature}>
                <AiFillCheckCircle />
                <span>20 recipes per month</span>
              </div>
              <div className={styles.feature}>
                <AiFillCheckCircle />
                <span>Your own recipe bank</span>
              </div>
              <div className={styles.feature}>
                <AiFillCheckCircle />
                <span>See shared recipes</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.plan} ${styles.planPreferred}`}>
          <div className={styles.title}>
            <div className={styles.texts}>
              <h2>Premium</h2>
              <h2>$8/month</h2>
              <span>Ideal for anyone trying to be a better home cook</span>
            </div>
            <Button
              text="Select plan"
              onClick={() => window.open(import.meta.env.VITE_PAYMENT_LINK, '_self')}
              disabled={props.loadingLog}
            />
          </div>
          <div className={styles.details}>
            <h3>Plan details</h3>
            <div className={styles.featureList}>
              <div className={styles.feature}>
                <AiFillCheckCircle />
                <span>Unlimited recipes per month</span>
              </div>
              <div className={styles.feature}>
                <AiFillCheckCircle />
                <span>Your own recipe bank</span>
              </div>
              <div className={styles.feature}>
                <AiFillCheckCircle />
                <span>See and save shared recipes</span>
              </div>
              <div className={styles.feature}>
                <AiFillCheckCircle />
                <span>Have access to our most exclusive Cookii Community</span>
              </div>
              <div className={styles.feature}>
                <AiFillCheckCircle />
                <span>Control the nutrients in your recipes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
