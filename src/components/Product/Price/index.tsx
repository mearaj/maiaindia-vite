import styles from './index.module.css';

export default function ProductPrice({ className }: { className?: string }) {
  let pricingClassName = styles.pricing;
  if (className) {
    pricingClassName = `${styles.pricing} ${className}`;
  }

  return (
    <div className={pricingClassName}>
      <div className={styles.sellingAmountContainer}>
        <div className={styles.sellingAmountCurrency}>₹</div>
        <div className={styles.sellingAmount}>25,000&nbsp;</div>
      </div>
      <div className={styles.mrpContainer}>
        <div className={styles.mrp}>M.R.P.&nbsp;</div>
        <div className={styles.mrpAmountContainer}>
          <div className={styles.mrpAmountCurrency}>₹</div>
          <s className={styles.mrpAmount}>35,000</s>
        </div>
      </div>
    </div>
  );
}
