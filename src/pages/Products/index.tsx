import { useRecoilValueLoadable } from 'recoil';
import { productsSelector } from '@/recoil';
import styles from './index.module.css';
import Videos from '@/components/Videos';
import Products from '@/components/Products';
import RecoilLoadableComponent from '@/components/Layouts/RecoilLoadableComponent';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function AdminProductsPage() {
  const recoilValueLoadable = useRecoilValueLoadable(productsSelector);

  return (
    <CommonPageLayout>
      <Videos className={styles.videosContainer} />
      <RecoilLoadableComponent recoilLoadable={recoilValueLoadable}>
        <Products products={recoilValueLoadable.contents} />
      </RecoilLoadableComponent>
    </CommonPageLayout>
  );
}
