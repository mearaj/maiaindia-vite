import { productsByCategory } from '@/jotai';
import { useAtomValue } from 'jotai';
import { Product } from '@/jotai/data/product';
import { loadable } from 'jotai/utils';
import LoadablePageLayout from '@/components/Layouts/JotailLoadablePage';
import AdminProducts from '@/components/Admin/Products';

export default function AdminProductsPage() {
  const valueLoadable = useAtomValue(loadable(productsByCategory));

  let data: Product[] = [];
  if (valueLoadable.state === 'hasData') {
    data = valueLoadable.data;
  }

  return (
    <LoadablePageLayout jotaiLoadable={valueLoadable}>
      <AdminProducts products={data} />
    </LoadablePageLayout>
  );
}
