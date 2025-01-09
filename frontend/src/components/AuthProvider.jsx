import React, { createContext, useState, useContext } from 'react';
import Cookies from "js-cookie";
import client from "../api/apiClient";

// 認証用のContextを作成
const AuthContext = createContext();

// 認証用のコンポーネント（ContextProvider）を作成
// コンポーネントタグで囲んだ子コンポーネントを受け取れるようにする
const AuthProvider = ( {children} ) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

// サインイン機能
  const signIn = async (email, password) => {
    const params = {
      email: email,
      password: password,
    };
    setLoading(true);

    try {
      const res = await client.post("v1/auth/sign_in", params);
      if (res.status === 200) {
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);

        setIsSignedIn(true);
        setUser(res.data.data);
        return true;
      }
    } catch (e) {
      // サインイン失敗時の通知は別途実装する
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isSignedIn, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Contextから認証valueを使用するための関数を定義
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;