import CircularProgress from '@mui/material/CircularProgress';
import styles from './index.module.css';

function Loader({ className }: { className?: string | undefined }) {
  let loaderClassName = styles.loader;
  if (className) {
    loaderClassName += ` ${className}`;
  }

  return (
    <div className={loaderClassName}>
      <CircularProgress />
    </div>
  );
}

export default Loader;
