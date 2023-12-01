import SupportChatUsersSideEffects from '@/recoil/sideeffects/SupportChatUsersSideEffects';
import CartAuthStateSideEffects from '@/recoil/sideeffects/CartAuthStateSideEffects';

export default function RecoilManager() {
  return (
    <>
      <SupportChatUsersSideEffects />
      <CartAuthStateSideEffects />
      <SupportChatUsersSideEffects />
    </>
  );
}
