import NoBorderInput from '../../../../../components/input/noBorderInput/NoBorderInput';
import styles from './HomeItem.module.scss';
import HomeItemPill from './pill/HomeItemPill';
import { HiOutlineSearch } from 'react-icons/hi';

interface HomeItemProps {
  title: string;
  items: string[];
  selectedItems: string[];
  selectItem: (_itemName: string) => void;
  removeItem: (_itemName: string) => void;
  searchBar?: boolean;
  searchBarValue?: string;
  onChangeSearchBarValue?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function HomeItem(props: HomeItemProps) {
  return (
    <div className={styles.homeItem}>
      <div className={styles.head}>
        <h5>{props.title}</h5>
        {props.searchBar && (
          <NoBorderInput
            id={`search-${props.title}`}
            type="text"
            placeholder="Type to search..."
            value={props.searchBarValue as string}
            onChange={props.onChangeSearchBarValue as React.ChangeEventHandler<HTMLInputElement>}
            iconBefore={HiOutlineSearch}
          />
        )}
      </div>
      <div className={styles.items}>
        {props.selectedItems.map((item) => (
          <HomeItemPill text={item} selected={true} key={item} onSelect={() => props.removeItem(item)} />
        ))}
        {props.items.map((item) => (
          <HomeItemPill text={item} selected={false} key={item} onSelect={() => props.selectItem(item)} />
        ))}
      </div>
    </div>
  );
}
