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
    <div className="flex flex-col">
      <h1 className="text-3xl text-center">サインアップページ</h1>
      <form onSubmit={handleSignUpSubmit} className="flex flex-col items-center mt-10">
        <div className="flex flex-col mb-2">
          <div>
            <label htmlFor="email">メールアドレス</label>
          </div>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="border border-black rounded"
            />
          </div>
          <div>
            <label htmlFor="password">パスワード</label>
          </div>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="border border-black rounded"
            />
          </div>
          <div>
            <label htmlFor="password_confirmation">パスワード確認</label>
          </div>
          <div>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={passwordConfirmation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirmation(e.target.value)}
              className="border border-black rounded"
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
        </div>
        <button type="submit" className="text-white bg-gray-900 rounded-lg p-2">
          登録
        </button>
      </form>
      <Link to="/signin" className="font-medium text-blue-600 dark:text-blue-500 underline space-x-4 text-lg text-center mt-10">サインインへ</Link>
    </div>
  );
};

export default SignUp;