import { useContext, useEffect, useState } from 'react';
import { Alert, alertTypes } from '../../../stores/alertStore';
import { AlertContext } from '../../../contexts/alert-context';
import { FirebaseContext } from '../../../contexts/firebase-context';
import styles from './Profile.module.scss';
import { UserAtom } from '../../../stores/userStore';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { CurrentPageAtom, LoadingAtom } from '../../../stores/loadingStore';
import Input from '../../../components/input/Input';
import Button from '../../../components/button/Button';
import { AiFillSave } from 'react-icons/ai';
import { GiSandsOfTime } from 'react-icons/gi';
import UserService from '../../../services/user.service';
import { User } from '../../../types/user';
import { FaUserAlt } from 'react-icons/fa';
import YourPlan from '../../../components/plans/YourPlan';

export default function Profile() {
  const alertContext = useContext(AlertContext);
  const firebaseContext = useContext(FirebaseContext);

  const [userAtom, setUser] = useAtom(UserAtom);
  const loadingLog = useAtomValue(LoadingAtom);
  const setCurrentPage = useSetAtom(CurrentPageAtom);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPage('');
  });

  useEffect(() => {
    if (userAtom) {
      setNewEmail(userAtom?.email);
    }
  }, [userAtom]);

  const handleAlert = (text: string, type: keyof typeof alertTypes) => {
    const newAlert: Alert = {
      message: text,
      type,
    };

    alertContext.startAlert(newAlert);
  };

  const saveProfile = async () => {
    if (!isUpdating) {
      setIsUpdating(true);
      const userCopy = structuredClone(userAtom);
      if (newName) {
        userCopy!.name = newName;
      }
      if (selectedFile) {
        userCopy!.profileImage = selectedFile;
      }

      await UserService.updateUser(firebaseContext.firestore, userCopy as User, setUser);
      handleAlert('Profile updated', 'success');
      setIsUpdating(false);
      setSelectedFile('');
      setNewName('');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = async (e: any) => {
    setUploadingImage(true);
    const file = e.target.files[0];
    const uploadedFile = await UserService.uploadNewPicture(firebaseContext.storage, file);
    setSelectedFile(uploadedFile);
    e.target.value = null;
    setUploadingImage(false);
  };

  const clearFields = () => {
    setNewName('');
    setSelectedFile('');
  };

  return (
    <div className={styles.profileContainer}>
      <h1>Profile</h1>
      <div className={styles.profilePicContainer}>
        <input
          id="profile image upload"
          type="file"
          onChange={handleFileChange}
          disabled={loadingLog || isUpdating}
          accept="image/*"
        />
        <label htmlFor="profile image upload" className={styles.profilePic}>
          {uploadingImage ? (
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : null}
          <h5>Upload</h5>
          {userAtom?.profileImage || selectedFile ? (
            <img src={selectedFile !== '' ? selectedFile : userAtom?.profileImage} alt="big profile" />
          ) : (
            <FaUserAlt />
          )}
        </label>
      </div>
      <div className={styles.inputs}>
        <div className={styles.input}>
          <h5>Name</h5>
          <Input
            id="change-name"
            type="text"
            placeholder={userAtom?.name as string}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={loadingLog || isUpdating}
          />
        </div>
        <div className={styles.input}>
          <h5>Email</h5>
          <Input
            id="change-email"
            type="email"
            placeholder={userAtom?.email as string}
            value={newEmail}
            disabled={true}
            onChange={() => {}}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <Button
          text={isUpdating ? 'Saving' : 'Save profile'}
          icon={!isUpdating ? <AiFillSave /> : <GiSandsOfTime />}
          onClick={() => (loadingLog ? {} : saveProfile())}
          disabled={loadingLog || isUpdating}
        />
        <Button text={'Clear'} onClick={() => (loadingLog ? {} : clearFields())} disabled={loadingLog || isUpdating} />
      </div>
      <YourPlan loadingLog={loadingLog} />
    </div>
  );
}
