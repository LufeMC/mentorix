import { MouseEventHandler } from 'react';
import styles from './HomeItemPill.module.scss';

interface HomeItemPillProps {
  text: string;
  selected: boolean;
  onSelect: MouseEventHandler<HTMLButtonElement>;
}

export default function HomeItemPill(props: HomeItemPillProps) {
  return (
    <button onClick={props.onSelect} className={`${styles.homeItemPill} ${props.selected ? styles.selected : ''}`}>
      <span>{props.text}</span>
    </button>
  );
}
