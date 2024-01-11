import { useRecoilValueLoadable } from 'recoil';
import { productsSelector } from '@/recoil';
import styles from './index.module.css';
import Videos from '@/components/Videos';
import Products from '@/components/Products';
import RecoilLoadableComponent from '@/components/Layouts/RecoilLoadableComponent';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import FooterComponent from '@/components/Footer';

export default function ProductsPage() {
  const recoilValueLoadable = useRecoilValueLoadable(productsSelector);

  return (
    <CommonPageLayout>
      <Videos className={styles.videosContainer} />
      <RecoilLoadableComponent
        recoilLoadable={recoilValueLoadable}
        loaderContainerStyle={{ height: '40vh' }}
        errorContainerStyle={{ height: '40vh' }}
      >
        <Products products={recoilValueLoadable.contents} />
      </RecoilLoadableComponent>
      <FooterComponent />
    </CommonPageLayout>
  );
}
