import Input from '../Input';
import styles from './NoBorderInput.module.scss';

interface NoBorderInputProps {
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
  disabled?: boolean;
  title?: string;
}

export default function NoBorderInput(props: NoBorderInputProps) {
  return (
    <div className={styles.inputField}>
      {props.title && <h5>{props.title}</h5>}
      <Input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        iconBefore={props.iconBefore}
        iconAfter={props.iconAfter}
        onIconBeforeClick={props.onIconBeforeClick}
        onIconAfterClick={props.onIconAfterClick}
        hasError={props.hasError}
        disabled={props.disabled}
      />
    </div>
  );
}
