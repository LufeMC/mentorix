import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirebaseConfig } from './firebase-config';

const app = initializeApp(getFirebaseConfig());
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
