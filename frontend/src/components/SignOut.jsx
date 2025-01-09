import { useState } from "react";
import { useAuth } from "./AuthProvider";

// サインアウトページを担当する（サインアウト機能はAuthProviderから受けとる）
export const SignOut = () => {
  const { signOut } = useAuth();

  const handleSignOutSubmit = async (e) => {
    e.preventDefault();
    const success = await signOut();

    if (success) {
      // サインアウト成功時の通知、及びリダイレクトは別途実装する
      console.log("Sign-out success");
    } else {
      // サインアウト失敗時の通知は別途実装する
      console.log("Sign-out failed");
    }
  };

  return (
    <>
      <form>
        <button type="submit" onClick={(e) => handleSignOutSubmit(e)}>
          サインアウト
        </button>
      </form>
    </>
  );
};

export default SignOut;