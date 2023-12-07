import { defaultProductForm } from '@/recoil/data/product';
import AddEditProductComponent from '@/components/Admin/AddEditProduct';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function AdminAddProductPage() {
  return (
    <CommonPageLayout>
      <AddEditProductComponent productForm={defaultProductForm} />
    </CommonPageLayout>
  );
}
