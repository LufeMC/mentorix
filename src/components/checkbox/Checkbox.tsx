import styles from './Checkbox.module.scss';

interface CheckboxProps {
  text: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  checked: boolean;
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <div className={styles.checkbox}>
      <label>
        {props.text}
        <input type="checkbox" checked={props.checked} />
      </label>
    </div>
  );
}
