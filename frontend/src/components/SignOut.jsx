import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

// サインアウトページを担当する（サインアウト機能はAuthProviderから受けとる）
export const SignOut = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOutSubmit = async (e) => {
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
      <form>
        <button type="submit" onClick={(e) => handleSignOutSubmit(e)}>
          サインアウト
        </button>
      </form>
    </>
  );
};

export default SignOut;