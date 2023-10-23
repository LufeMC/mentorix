import styles from './Step.module.scss';

interface StepProps {
  text: string;
  step: number;
}

export default function Step(props: StepProps) {
  return (
    <div className={styles.step}>
      <span className={styles.stepCount}>STEP {props.step}</span>
      <span className={styles.stepText}>{props.text.replace(/^Step\s+\d+:\s*|\d+\.\s*/g, '')}</span>
    </div>
  );
}
