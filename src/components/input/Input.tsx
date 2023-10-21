import styles from './Input.module.scss';

interface InputProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  iconBefore?: React.ElementType;
  iconAfter?: React.ElementType;
  onIconBeforeClick?: () => void;
  onIconAfterClick?: () => void;
  hasError?: boolean;
}

export default function Input(props: InputProps) {
  return (
    <div className={`${styles.input} ${props.hasError ? styles.inputError : ''}`}>
      {props.iconBefore && <props.iconBefore onClick={props.onIconBeforeClick} />}
      <input
        id={props.id}
        name={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
      {props.iconAfter && <props.iconAfter className={styles.iconAfter} onClick={props.onIconAfterClick} />}
    </div>
  );
}
