import styles from './Divider.module.scss';

interface DividerProps {
  /** Optional label shown in the middle of the line */
  label?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Divider = ({ label, orientation = 'horizontal' }: DividerProps) => {
  if (orientation === 'vertical') {
    return <div className={styles.vertical} aria-hidden="true" />;
  }

  return (
    <div className={styles.horizontal} aria-hidden={!label}>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export default Divider;
