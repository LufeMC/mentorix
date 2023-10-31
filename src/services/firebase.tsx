import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getFirebaseConfig } from './firebase-config';
import { getStorage } from 'firebase/storage';

const app = initializeApp(getFirebaseConfig());
export const auth = getAuth(app);
(async () => {
  await setPersistence(auth, browserLocalPersistence);
})();
export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
