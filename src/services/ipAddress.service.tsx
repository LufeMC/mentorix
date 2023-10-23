import axios from 'axios';
import { Firestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { TempUser } from '../types/tempUser';
import { TempUserActions } from '../stores/tempUserStore';

const collectionRef = 'tempUsers';

const getIpAddress = async () => {
  const res = await axios.get('https://api.ipify.org/?format=json');
  return res.data.ip;
};

const getTempUser = async (firestore: Firestore): Promise<TempUser> => {
  const ipAddress: string = await getIpAddress();
  const tempUsersRef = doc(firestore, collectionRef, ipAddress);
  const tempUserSnap = await getDoc(tempUsersRef);

  if (tempUserSnap.exists()) {
    const user = tempUserSnap.data() as TempUser;
    user.userIpAddress = tempUserSnap.id;
    return user;
  } else {
    await setDoc(tempUsersRef, { recipesGenerated: 0 });
    return { userIpAddress: ipAddress, recipesGenerated: 0 };
  }
};

const updateTempUser = async (
  firestore: Firestore,
  updatedUser: TempUser,
  tempUserStore: TempUserActions,
): Promise<TempUser | string> => {
  if (updatedUser.userIpAddress) {
    const tempUsersRef = doc(firestore, collectionRef, updatedUser.userIpAddress);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tempUserCopy: any = structuredClone(updatedUser);
    delete tempUserCopy.userIpAddress;
    await updateDoc(tempUsersRef, tempUserCopy);
    tempUserStore.tempUpdate(updatedUser);
  }

  return 'No user provided';
};

const retrieveTempUser = async (firestore: Firestore, tempStore: TempUserActions) => {
  tempStore.tempStartLoggingIn();
  const tempUser = await getTempUser(firestore);
  tempStore.tempUpdate(tempUser);
  tempStore.tempDoneLoggingIn();
};

const IpAddressService = {
  retrieveTempUser,
  updateTempUser,
};

export default IpAddressService;
