import {
  selectShowGlobalLoader,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { setShowGlobalLoader } from '@/store/features/ui';
import { useEffect } from 'react';
import { Loader } from '@/components';
import styles from './index.module.css';

export default function GlobalModal() {
  const showGlobalLoader = useAppSelector(selectShowGlobalLoader);
  const dispatch = useAppDispatch();
  let className = styles.container;
  if (showGlobalLoader) {
    className = `${styles.container} ${styles.visible}`;
  }

  useEffect(() => {}, [dispatch]);

  return (
    <button
      onClick={() => {
        dispatch(setShowGlobalLoader(false));
      }}
      className={className}
      type="button"
    >
      <Loader />
    </button>
  );
}
