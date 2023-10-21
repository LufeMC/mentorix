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
}

export default function NoBorderInput(props: NoBorderInputProps) {
  return (
    <div className={styles.inputField}>
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
      />
    </div>
  );
}
