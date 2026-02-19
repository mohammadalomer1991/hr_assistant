import Header from '../../components/Header/Header';
import SocialLogin from '../../components/SocialLogin/SocialLogin';
import LoginForm from '../../components/LoginForm/LoginForm';
import Divider from '../../components/Divider/Divider';
import Footer from '../../components/Footer/Footer';
import styles from './LoginPage.module.scss';

const LoginPage = () => {
  return (
    <div className={styles.page}>
      {/* ── Rainbow stripe (brand decoration) ── */}
      <div className={styles.stripe} aria-hidden="true" />

      <main className={styles.main}>
        {/* Logo + tagline */}
        <Header />

        {/* Card with two columns */}
        <section className={styles.card}>
          {/* Left: social login options */}
          <div className={styles.leftPanel}>
            <SocialLogin />
          </div>

          {/* Vertical divider */}
          <Divider orientation="vertical" />

          {/* Right: email/password form */}
          <div className={styles.rightPanel}>
            <LoginForm />
          </div>
        </section>
      </main>

      {/* Footer links */}
      <Footer />
    </div>
  );
};

export default LoginPage;
