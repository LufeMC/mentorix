import styles from './AuthPage.module.scss';
import { UserLogin } from '../../types/user';
import { useFormik } from 'formik';
import TextInput from '../../components/input/textInput/TextInput';
import Background from '../../assets/img/background.png';
import Logo from '../../assets/img/logo.svg';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineUserCircle } from 'react-icons/hi';
import { useContext, useEffect, useState } from 'react';
import Button from '../../components/button/Button';
import TextButton from '../../components/button/textButton/TextButton';
import GoogleButton from '../../components/whiteButton/googleButton/GoogleButton';
import { FirebaseContext } from '../../contexts/firebase-context';
import useUserStore from '../../stores/userStore';
import UserService from '../../services/user.service';
import { useNavigate } from 'react-router-dom';
import Checkbox from '../../components/checkbox/Checkbox';

const modes = {
  login: 'login',
  signup: 'signup',
};

export default function AuthPage() {
  const [initiated, setInitiated] = useState<boolean>(false);
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successText, setSuccessText] = useState<string>('Success');
  const [errorText, setErrorText] = useState<string>('Error');
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);
  const [successTimeout, setSuccessTimeout] = useState<NodeJS.Timeout | null>(null);
  const [mode, setMode] = useState<keyof typeof modes>('login');
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const firebaseContext = useContext(FirebaseContext);
  const userStore = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userStore.user && successText === 'Success') {
      navigate('/');
    } else {
      setInitiated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    } as UserLogin,
    onSubmit: async (values) => {
      setEmailLoading(true);
      if (validateInputs()) {
        if (values.name) {
          await UserService.signUp(firebaseContext.auth, firebaseContext.firestore, values, setError, setSuccess);
        } else {
          await UserService.login(
            firebaseContext.auth,
            firebaseContext.firestore,
            values,
            userStore,
            setError,
            setSuccess,
          );
        }
      } else {
        setEmailLoading(false);
      }
    },
  });

  const validateInputs = () => {
    const errors = [];
    const errorMessages = [];

    // Trim leading and trailing white spaces
    const trimmedName = formik.values.name ? formik.values.name.trim() : '';
    const trimmedEmail = formik.values.email ? formik.values.email.trim() : '';
    const trimmedPassword = formik.values.password ? formik.values.password.trim() : '';

    if (mode === 'signup') {
      if (!trimmedName) {
        errors.push('name');
        errorMessages.push('Name is required');
      }

      if (!acceptedTerms) {
        errors.push('terms');
        errorMessages.push('Pleace accept terms and conditions');
      }
    }

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      errors.push('email');
      errorMessages.push('Valid email is required');
    }

    if (!trimmedPassword || trimmedPassword.length < 6 || !isValidPassword(trimmedPassword)) {
      errors.push('password');
      errorMessages.push('Password must be at least 6 characters long and contain only numbers and letters characters');
    }

    setValidationErrors(errors);

    if (errors.length > 0) {
      const errorMessage = `${errorMessages.join('\n')}`;
      setError(errorMessage);
      return false;
    }

    setErrorText('Error');
    setValidationErrors([]);
    return true;
  };

  const isValidEmail = (email: string) => {
    // Use a regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    // Use a regular expression to validate password format (no white spaces or special characters)
    const passwordRegex = /^[a-zA-Z0-9]+$/;
    return passwordRegex.test(password);
  };

  const submitAuth = () => {
    formik.handleSubmit();
  };

  const changeMode = (newMode = '') => {
    setErrorText('Error');
    setValidationErrors([]);
    setIsPasswordShown(false);
    setAcceptedTerms(false);

    formik.values.email = '';
    formik.values.password = '';
    if (mode === 'login' || newMode === 'signup') {
      setMode('signup');
      formik.values.name = '';
    } else {
      setMode('login');
    }
  };

  const setError = (error: string) => {
    clearTimeout(errorTimeout as NodeJS.Timeout);
    setErrorText(error);
    setEmailLoading(false);
    setGoogleLoading(false);
    setAcceptedTerms(false);

    setErrorTimeout(
      setTimeout(() => {
        setErrorText('Error');
      }, 5000),
    );
  };

  const setSuccess = (success: string, redirect: boolean) => {
    clearTimeout(successTimeout as NodeJS.Timeout);
    setSuccessText(success);
    setEmailLoading(false);
    setGoogleLoading(false);
    setAcceptedTerms(false);

    changeMode('login');
    setSuccessTimeout(
      setTimeout(
        () => {
          setSuccessText('Success');
          if (redirect) {
            navigate('/');
          }
        },
        redirect ? 1000 : 5000,
      ),
    );
  };

  const googleLogin = () => {
    setGoogleLoading(true);
    UserService.googleLogin(firebaseContext.auth, firebaseContext.firestore, userStore, setError, setSuccess);
  };

  return (
    initiated && (
      <div className={styles.authPage}>
        <div className={styles.image}>
          <img src={Background} alt="food background" />
        </div>
        <div className={styles.loginBox}>
          <img src={Logo} alt="cookii logo" className={styles.logo} />
          <div>
            <h1>Welcome!</h1>
            <div className={styles.createAccount}>
              <TextButton
                text={mode === 'login' ? 'Create a free account' : 'Log in'}
                onClick={() => changeMode()}
                loading={false}
              />
              <span>or {mode === 'login' ? 'log in' : 'create a free account'} to enter Cookii</span>
            </div>
          </div>
          <div>
            <span className={successText !== 'Success' ? styles.success : styles.invisibleText}>{successText}</span>
            <span className={errorText !== 'Error' ? styles.error : styles.invisibleText}>{errorText}</span>
            {mode === 'signup' && (
              <TextInput
                title="Name"
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formik.values.name as string}
                onChange={formik.handleChange}
                iconBefore={HiOutlineUserCircle}
                hasError={validationErrors.includes('name')}
              />
            )}
            <TextInput
              title="Email"
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formik.values.email}
              onChange={formik.handleChange}
              iconBefore={HiOutlineMail}
              hasError={validationErrors.includes('email')}
            />
            <TextInput
              title="Password"
              id="password"
              type={isPasswordShown ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              iconBefore={HiOutlineLockClosed}
              iconAfter={isPasswordShown ? HiOutlineEye : HiOutlineEyeOff}
              onIconAfterClick={() => setIsPasswordShown((prev) => !prev)}
              hasError={validationErrors.includes('password')}
            />
            {mode === 'login' ? (
              <div className={styles.forgotPassword}>
                <TextButton text="Forgot password?" onClick={submitAuth} loading={false} />
              </div>
            ) : (
              <Checkbox
                text="Accept the Terms & Conditions, Privacy Policy and Cookies Policy"
                checked={acceptedTerms}
                onChange={setAcceptedTerms}
                hasError={validationErrors.includes('terms')}
                link="https://scratch-molybdenum-a71.notion.site/Cookii-30e07e8a4a88462d8bb4482f4741563e?pvs=4/"
              />
            )}
            <Button text={mode === 'login' ? 'Log in' : 'Sign up'} onClick={submitAuth} loading={emailLoading} />
          </div>
          <div className={styles.or}>
            <div />
            <span>or</span>
            <div />
          </div>
          <div>
            <GoogleButton
              onClick={googleLogin}
              text={mode === 'login' ? 'Log in' : 'Sign up'}
              loading={googleLoading}
            />
          </div>
        </div>
      </div>
    )
  );
}
