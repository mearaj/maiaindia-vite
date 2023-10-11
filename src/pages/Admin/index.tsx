import { Header } from '@/components';
import styles from './index.module.css';

export default function AdminPage() {
  return (
    <>
      <Header className={styles.header} showBackIcon />
      <div>This is the admin page</div>
    </>
  );
}
