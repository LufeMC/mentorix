import { ReactNode } from 'react';
import styles from './HomeSection.module.scss';

interface HomeSectionProps {
  title: string;
  count: number;
  children: ReactNode;
}

export default function HomeSection(props: HomeSectionProps) {
  return (
    <div className={styles.homeSection}>
      <div className={styles.sectionTitle}>
        <span>0{props.count}</span>
        <h3>{props.title}</h3>
      </div>
      <div className={styles.sectionContent}>{props.children}</div>
    </div>
  );
}
