import useAlertStore from '../../stores/alertStore';
import styles from './Alert.module.scss';
import { AiOutlineClose } from 'react-icons/ai';

export default function Alert() {
  const alertStore = useAlertStore();

  const closeAlert = () => {
    alertStore.resetAlert();
  };

  return (
    alertStore.alert &&
    alertStore.started && (
      <div className={styles.alertContainer}>
        <div
          className={`${styles.alert} ${alertStore.alert.type === 'success' ? styles.success : ''} ${
            alertStore.alert.type === 'error' ? styles.error : ''
          } ${alertStore.alert.type === 'warning' ? styles.warning : ''}`}
        >
          <AiOutlineClose onClick={closeAlert} />
          <span>{alertStore.alert.message}</span>
          <div className={styles.timer} />
        </div>
      </div>
    )
  );
}
