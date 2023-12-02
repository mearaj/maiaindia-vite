import SupportChatUsersSideEffects from '@/recoil/sideeffects/SupportChatUsersSideEffects';
import CartAuthStateSideEffects from '@/recoil/sideeffects/CartAuthStateSideEffects';
import ProductImagesSideEffects from '@/recoil/sideeffects/ProductImagesSideEffects';

export default function RecoilManager() {
  return (
    <>
      <SupportChatUsersSideEffects />
      <CartAuthStateSideEffects />
      <SupportChatUsersSideEffects />
      <ProductImagesSideEffects />
    </>
  );
}
