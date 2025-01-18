import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

// サインインページを担当する（サインイン機能はAuthProviderから受けとる）
export const SignUp = () => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const confirmSuccessUrl: string | undefined = process.env.REACT_APP_FRONT_SIGN_IN_URL;

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success: boolean | void = await signUp({ email, password, passwordConfirmation, confirmSuccessUrl });
  };

  return (
    <>
      <h1>サインアップページです</h1>
      <form onSubmit={handleSignUpSubmit}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password_confirmation">パスワード確認</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={passwordConfirmation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirmation(e.target.value)}
          />
        </div>
        <div>
          <input
            type="hidden"
            id="confirm_success_url"
            name="confirm_success_url"
            value={confirmSuccessUrl}
          />
        </div>
        <button type="submit">
          Submit
        </button>
      </form>
      <Link to="/signin">サインインへ</Link>
    </>
  );
};

export default SignUp;