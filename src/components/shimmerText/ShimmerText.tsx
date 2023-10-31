import { ReactNode } from 'react';
import styles from './ShimmerText.module.scss';

interface ShimmerTextProps {
  children: ReactNode;
}

export default function ShimmerText(props: ShimmerTextProps) {
  return <div className={styles.shimmerText}>{props.children}</div>;
}
