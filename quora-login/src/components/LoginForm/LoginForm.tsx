import { useState, type FormEvent } from 'react';
import styles from './LoginForm.module.scss';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // handle login logic here
    console.log({ email, password });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ログイン</h2>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            メール
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className={styles.formFooter}>
          <a href="#" className={styles.forgotLink}>
            パスワードをお忘れの方
          </a>
          <button type="submit" className={styles.submitBtn}>
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
