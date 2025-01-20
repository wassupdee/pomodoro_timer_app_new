import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

// サインインページを担当する（サインイン機能はAuthProviderから受けとる）
export const SignIn = () => {
  if (process.env.NODE_ENV === "development") {
    console.log("SignInコンポーネントがレンダリングされました")
  }
  const { signIn } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const handleSignInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success: boolean | void = await signIn({ email, password });

    // この時点ではまだ、user stateはnullのまま

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl text-center">サインインページ</h1>
      <form onSubmit={handleSignInSubmit} className="flex flex-col items-center mt-10">
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
                onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              className="border border-black rounded"
            />
          </div>
        </div>
        <button type="submit" className="text-white bg-gray-900 rounded-lg p-2">
          サインイン
        </button>
      </form>
      <Link to="/signup" className="font-medium text-blue-600 dark:text-blue-500 underline space-x-4 text-lg text-center mt-10">サインアップへ</Link>
    </div>
  );
};

export default SignIn;