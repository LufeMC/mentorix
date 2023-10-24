import { createContext, ReactNode, useEffect } from 'react';
import { Alert, AlertAtom, AlertStartedAtom, AlertTimeoutAtom } from '../stores/alertStore';
import { useAtom, useSetAtom } from 'jotai';

interface AlertContextProps {
  children?: ReactNode;
}

interface AlertContextValue {
  startAlert: (_newAlert: Alert) => void;
  resetAlert: () => void;
}

export const AlertContext = createContext<AlertContextValue>({} as AlertContextValue);

export default function AlertProvider({ children }: AlertContextProps) {
  const setAlert = useSetAtom(AlertAtom);
  const [alertTimeout, setAlertTimeout] = useAtom(AlertTimeoutAtom);
  const setAlertStarted = useSetAtom(AlertStartedAtom);

  useEffect(() => {
    resetAlert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAlertTimeout = () => {
    if (alertTimeout !== null) {
      clearTimeout(alertTimeout);
    }
  };

  const resetAlert = () => {
    clearAlertTimeout();
    setAlertTimeout(null);
    setAlert(null);
    setAlertStarted(false);
  };

  const changeAlert = (newAlert: Alert, newAlertTimeout: NodeJS.Timeout) => {
    clearAlertTimeout();
    setAlertTimeout(newAlertTimeout);
    setAlert(newAlert);
    setAlertStarted(true);
  };

  const startAlert = (newAlert: Alert) => {
    resetAlert();

    setTimeout(() => {
      resetAlert();

      const newTimeout = setTimeout(() => {
        resetAlert();
      }, 5000);

      changeAlert(newAlert, newTimeout);
    }, 100);
  };

  const value: AlertContextValue = {
    startAlert,
    resetAlert,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}
