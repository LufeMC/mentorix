import styles from './Checkbox.module.scss';

interface CheckboxProps {
  text: string;
  onChange: React.Dispatch<React.SetStateAction<boolean>>;
  checked: boolean;
  hasError?: boolean;
  link?: string;
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <label className={`${styles.checkbox} ${props.hasError ? styles.checkboxError : ''}`}>
      {props.link ? (
        <a href={props.link} target="_blank" rel="noreferrer">
          {props.text}
        </a>
      ) : (
        props.text
      )}
      <input type="checkbox" checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} />
      <span className={styles.checkmark}></span>
    </label>
  );
}
