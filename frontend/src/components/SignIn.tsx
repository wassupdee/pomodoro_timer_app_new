import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

// サインインページを担当する（サインイン機能はAuthProviderから受けとる）
export const SignIn = () => {
  console.log("SignInコンポーネントがレンダリングされました")

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
    <>
      <p>サインインページです</p>
      <form onSubmit={handleSignInSubmit}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">
          Submit
        </button>
      </form>
      <Link to="/signup">サインアップへ</Link>
    </>
  );
};

export default SignIn;