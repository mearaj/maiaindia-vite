import { productsSelector } from '@/jotai';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai/index';
import { Product } from '@/jotai/data/product';
import LoadableComponent from '@/components/Layouts/JotailLoadableComponent';
import styles from './index.module.css';
import Videos from '@/components/Videos';
import Products from '@/components/Products';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import FooterComponent from '@/components/Footer';

export default function ProductsPage() {
  const valueLoadableAtom = loadable(productsSelector);
  const valueLoadable = useAtomValue(valueLoadableAtom);

  let data = [] as Product[];
  if (valueLoadable.state === 'hasData') {
    data = valueLoadable.data;
  }

  return (
    <CommonPageLayout>
      <Videos className={styles.videosContainer} />
      <LoadableComponent
        jotaiLoadable={valueLoadable}
        loaderContainerStyle={{ height: '40vh' }}
        errorContainerStyle={{ height: '40vh' }}
      >
        <Products products={data} />
      </LoadableComponent>
      <FooterComponent />
    </CommonPageLayout>
  );
}
