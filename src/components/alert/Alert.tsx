import { useAtomValue } from 'jotai';
import styles from './Alert.module.scss';
import { AiOutlineClose } from 'react-icons/ai';
import { AlertAtom, AlertStartedAtom } from '../../stores/alertStore';
import { useContext } from 'react';
import { AlertContext } from '../../contexts/alert-context';

export default function Alert() {
  const alertContext = useContext(AlertContext);
  const alert = useAtomValue(AlertAtom);
  const alertStarted = useAtomValue(AlertStartedAtom);

  const closeAlert = () => {
    alertContext.resetAlert();
  };

  return (
    alert &&
    alertStarted && (
      <div className={styles.alertContainer}>
        <div
          className={`${styles.alert} ${alert.type === 'success' ? styles.success : ''} ${
            alert.type === 'error' ? styles.error : ''
          } ${alert.type === 'warning' ? styles.warning : ''}`}
        >
          <AiOutlineClose onClick={closeAlert} />
          <span>{alert.message}</span>
          <div className={styles.timer} />
        </div>
      </div>
    )
  );
}
