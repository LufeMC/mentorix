import WhiteButton from '../WhiteButton';
import styles from './TextButton.module.scss';

interface TextButtonProps {
  text: string;
  loading: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function TextButton(props: TextButtonProps) {
  return (
    <div className={styles.textButton}>
      <WhiteButton text={props.text} onClick={props.onClick} loading={props.loading} />
    </div>
  );
}
