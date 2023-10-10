import { Button } from '@mui/material';
import { useContext } from 'react';
import { ProviderId } from '@firebase/auth';
import Loader from '@/components/Loader';
import { FirebaseContext } from '@/providers/firebase';
import GoogleIcon from '@/icons/google-g';
import styles from './index.module.css';

export default function UserComponent() {
  const { user, isLoading, signIn, signOut } = useContext(FirebaseContext);

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  if (user) {
    return (
      <div className={styles.signOutContainer}>
        <Button
          className={`${styles.button} ${styles.buttonSignOut}`}
          onClick={signOut}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <Button
        className={styles.button}
        onClick={async () => signIn(ProviderId.GOOGLE)}
      >
        <div className={styles.iconContainer}>
          <GoogleIcon className={styles.icon} />
        </div>
        <div className={styles.linkTitle}>Google Sign In</div>
      </Button>
    </div>
  );
}
