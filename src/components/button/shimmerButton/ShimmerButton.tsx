import Button from '../Button';
import styles from './ShimmerButton.module.scss';

interface ShimmerButtonProps {
  text: string;
}

export default function ShimmerButton(props: ShimmerButtonProps) {
  return (
    <div className={styles.shimmerButton}>
      <Button text={props.text} onClick={() => {}} />
    </div>
  );
}
