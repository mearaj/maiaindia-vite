import { Header } from '@/components';
import styles from './index.module.css';

export default function CartPage() {
  return (
    <>
      <Header className={styles.header} showBackIcon />
      <div>This is the cart page</div>
    </>
  );
}
