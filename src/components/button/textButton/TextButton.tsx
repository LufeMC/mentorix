import Button from '../Button';
import styles from './TextButton.module.scss';

interface TextButtonProps {
  text: string;
  disabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function TextButton(props: TextButtonProps) {
  return (
    <div className={styles.textButton}>
      <Button text={props.text} onClick={props.onClick} disabled={props.disabled} />
    </div>
  );
}
