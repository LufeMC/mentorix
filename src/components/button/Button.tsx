import { useEffect, useState } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  loading: boolean;
  icon?: React.ReactNode;
  text?: string;
  loadingText?: string;
  disabled?: boolean;
}

export default function Button(props: ButtonProps) {
  const [dotsCounter, setDotsCounter] = useState<number>(0);
  const [dotsInterval, setDotsInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (props.loading) {
      setDotsInterval(
        setInterval(() => {
          setDotsCounter((prev) => (prev === 3 ? 0 : prev + 1));
        }, 250),
      );
    } else if (!props.loading && dotsInterval) {
      setDotsCounter(0);
      clearInterval(dotsInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loading]);

  return (
    <button className={styles.button} onClick={props.onClick} disabled={props.disabled}>
      {props.icon && props.icon}
      {props.text && !props.loading && <span>{props.text}</span>}
      {props.loading && `${props.loadingText ? props.loadingText : 'Loading'}${'.'.repeat(dotsCounter)}`}
    </button>
  );
}
