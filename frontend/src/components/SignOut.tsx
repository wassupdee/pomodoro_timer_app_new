import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

// サインアウトページを担当する（サインアウト機能はAuthProviderから受けとる）
export const SignOut = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOutSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const success: boolean | void = await signOut();

    if (success) {
      navigate("/");
    };
  };

  return (
    <div>
      <form onSubmit={handleSignOutSubmit}>
        <button type="submit" className="text-gray-900 bg-white border border-gray-900 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm p-2">
          サインアウトする
        </button>
      </form>
    </div>
  );
};

export default SignOut;