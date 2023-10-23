import { createContext, ReactNode, useEffect } from 'react';
import useAlertStore, { Alert } from '../stores/alertStore';

interface AlertContextProps {
  children?: ReactNode;
}

interface AlertContextValue {
  setAlert: (_newAlert: Alert) => void;
}

export const AlertContext = createContext<AlertContextValue>({} as AlertContextValue);

export default function AlertProvider({ children }: AlertContextProps) {
  const alertStore = useAlertStore();

  useEffect(() => {
    alertStore.resetAlert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAlert = (newAlert: Alert) => {
    alertStore.resetAlert();

    setTimeout(() => {
      alertStore.resetAlert();

      const newTimeout = setTimeout(() => {
        alertStore.resetAlert();
      }, 5000);

      alertStore.changeAlert(newAlert, newTimeout);
    }, 100);
  };

  const value: AlertContextValue = {
    setAlert,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}
