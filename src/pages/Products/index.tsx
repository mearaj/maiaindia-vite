import { useRecoilValueLoadable } from 'recoil';
import { productsSelector } from '@/recoil';
import styles from './index.module.css';
import Videos from '@/components/Videos';
import Products from '@/components/Products';
import RecoilLoadablePageLayout from '@/components/Layouts/RecoilLoadablePage';

export default function AdminProductsPage() {
  const recoilValueLoadable = useRecoilValueLoadable(productsSelector);

  return (
    <RecoilLoadablePageLayout recoilLoadable={recoilValueLoadable}>
      <Videos className={styles.videosContainer} />
      <Products products={recoilValueLoadable.contents} />
    </RecoilLoadablePageLayout>
  );
}
