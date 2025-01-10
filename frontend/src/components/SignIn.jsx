import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

// サインインページを担当する（サインイン機能はAuthProviderから受けとる）
export const SignIn = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const success = await signIn(email, password);

    // この時点ではまだ、user stateはnullのまま

    if (success) {
      // サインイン成功時の通知、及びリダイレクトは別途実装する
      console.log("Sign-in success");
      navigate("/");
    } else {
      // サインイン失敗時の通知は別途実装する
      console.log("Sign-in failed");
    }
  };

  return (
    <>
      <p>サインインページです</p>
      <form>
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
        <button type="submit" onClick={(e) => handleSignInSubmit(e)}>
          Submit
        </button>
      </form>
      <Link to="/signup">サインアップへ</Link>
    </>
  );
};

export default SignIn;