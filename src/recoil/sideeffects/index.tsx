import SupportChatUsersSideEffects from '@/recoil/sideeffects/SupportChatUsersSideEffects';
import CartAuthStateSideEffects from '@/recoil/sideeffects/CartAuthStateSideEffects';
import ProductImagesSideEffects from '@/recoil/sideeffects/ProductImagesSideEffects';
import SupportChatSessionsSideEffects from '@/recoil/sideeffects/SupportChatSessionsSideEffects';

export default function RecoilManager() {
  return (
    <>
      <SupportChatUsersSideEffects />
      <CartAuthStateSideEffects />
      <SupportChatSessionsSideEffects />
      <ProductImagesSideEffects />
    </>
  );
}
