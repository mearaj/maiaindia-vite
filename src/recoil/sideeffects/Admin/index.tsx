import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { isAdminAtom } from '@/recoil/atoms/admin';

export default function AdminEffects() {
  const isAdmin = useRecoilValue(isAdminAtom);
  useEffect(() => {}, [isAdmin]);

  return null;
}
