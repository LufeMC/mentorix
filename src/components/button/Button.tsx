import styles from './Button.module.scss';

interface ButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
  text?: string;
  disabled?: boolean;
}

export default function Button(props: ButtonProps) {
  return (
    <button className={styles.button} onClick={props.onClick} disabled={props.disabled}>
      {props.icon && props.icon}
      {props.text && <span>{props.text}</span>}
    </button>
  );
}
