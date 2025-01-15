import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

// サインアウトページを担当する（サインアウト機能はAuthProviderから受けとる）
export const SignOut = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await signOut();

    if (success) {
      console.log("Sign-out success");
      alert("サインアウトしました")
      navigate("/");
    };
  };

  return (
    <>
      <form onSubmit={handleSignOutSubmit}>
        <button type="submit">
          サインアウト
        </button>
      </form>
    </>
  );
};

export default SignOut;