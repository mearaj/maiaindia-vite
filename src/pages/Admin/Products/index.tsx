import { useRecoilValueLoadable } from 'recoil';
import { productsSelector } from '@/recoil';
import AdminProducts from '@/components/Admin/AdminProducts';
import RecoilLoadablePageLayout from '@/components/Layouts/RecoilLoadablePage';

export default function AdminProductsPage() {
  const recoilValueLoadable = useRecoilValueLoadable(productsSelector);

  return (
    <RecoilLoadablePageLayout recoilLoadable={recoilValueLoadable}>
      <AdminProducts products={recoilValueLoadable.contents} />
    </RecoilLoadablePageLayout>
  );
}
