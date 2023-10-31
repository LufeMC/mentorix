import { ReactNode } from 'react';
import styles from './HomeSection.module.scss';

interface HomeSectionProps {
  children: ReactNode;
}

export default function HomeSection(props: HomeSectionProps) {
  return (
    <div className={styles.homeSection}>
      <div className={styles.sectionContent}>{props.children}</div>
    </div>
  );
}
