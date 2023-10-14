import { useAppDispatch } from '@/store';
import { useEffect } from 'react';
import { Loader } from '@/components';
import styles from './index.module.css';

export default function GlobalModal() {
  const dispatch = useAppDispatch();
  const className = styles.container;

  useEffect(() => {}, [dispatch]);

  return (
    <button onClick={() => {}} className={className} type="button">
      <Loader />
    </button>
  );
}
