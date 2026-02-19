import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>HR Assistant</h1>
      <p className={styles.tagline}>知識を共有し合い、世界を知ろう</p>
    </header>
  );
};

export default Header;
