import { productsByCategory } from '@/jotai';
import { useAtomValue } from 'jotai/index';
import styles from './index.module.css';
import Videos from '@/components/Videos';
import Products from '@/components/Products';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import FooterComponent from '@/components/Footer';

export default function ProductsPage() {
  const products = useAtomValue(productsByCategory);

  return (
    <CommonPageLayout>
      <Videos className={styles.videosContainer} />
      <Products products={products} />
      <FooterComponent />
    </CommonPageLayout>
  );
}
