import styles from './WhiteButton.module.scss';

interface WhiteButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
  text?: string;
  disabled?: boolean;
}

export default function WhiteButton(props: WhiteButtonProps) {
  return (
    <button className={styles.button} onClick={props.onClick} disabled={props.disabled}>
      {props.icon && props.icon}
      {props.text && <span>{props.text}</span>}
    </button>
  );
}
