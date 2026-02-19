import styles from './Footer.module.scss';

const footerLinks = [
  '概要',
  '求人情報',
  'プライバシー',
  '利用規定',
  '連絡先',
  '言語',
  'プレス',
  '報道関連',
];

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links} aria-label="フッターナビゲーション">
        {footerLinks.map((link, i) => (
          <a key={i} href="#" className={styles.link}>
            {link}
          </a>
        ))}
      </nav>
      <p className={styles.copyright}>© Quora, Inc. 2026</p>
    </footer>
  );
};

export default Footer;
