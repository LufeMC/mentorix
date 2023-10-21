import { useEffect, useState } from 'react';
import styles from './WhiteButton.module.scss';

interface WhiteButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  loading: boolean;
  icon?: React.ElementType;
  text?: string;
}

export default function WhiteButton(props: WhiteButtonProps) {
  const [dotsCounter, setDotsCounter] = useState<number>(0);
  const [dotsInterval, setDotsInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (props.loading) {
      setDotsInterval(
        setInterval(() => {
          setDotsCounter((prev) => (prev === 3 ? 0 : prev));
        }, 1000),
      );
    } else if (!props.loading && dotsInterval) {
      clearInterval(dotsInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loading]);

  return (
    <button className={styles.button} onClick={props.onClick}>
      {props.icon && <props.icon />}
      {props.text && !props.loading && <span>{props.text}</span>}
      {props.loading && `Loading${'.'.repeat(dotsCounter)}`}
    </button>
  );
}
