import { Header } from '@/components';
import Products from '@/components/Products';
import Videos from '@/components/Videos';
import styles from './index.module.css';

export default function CategoriesPage() {
  return (
    <div className={styles.layout}>
      <Header />
      <Videos className={styles.videosContainer} />
      <Products />
    </div>
  );
}
