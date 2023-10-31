import styles from './HomeItem.module.scss';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface HomeItemProps {
  id: string;
  title: string;
  items: string[];
  selectedItems: string[];
  changeItems: (_newItems: string[]) => void;
  isMulti?: boolean;
}

export default function HomeItem(props: HomeItemProps) {
  return (
    <div className={styles.homeItem}>
      <div className={styles.head}>
        <h5>{props.title}</h5>
      </div>
      <Select
        isMulti={props.isMulti}
        className={styles.select}
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={props.items.map((item) => ({ label: item, value: item }))}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e: any) =>
          e.value
            ? props.changeItems([e.value])
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              props.changeItems(e.map((item: any) => item.value) as string[])
        }
      />
    </div>
  );
}
