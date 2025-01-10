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

  // サインアップ機能
  const signUp = async (email, password, passwordConfirmation, confirmSuccessUrl) => {
    const params = {
      email,
      password,
      passwordConfirmation,
      confirmSuccessUrl,
    };
    setLoading(true);

    try {
      const res = await client.post("v1/auth", params);
      if (res.status === 200) {
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);

        setIsSignedIn(true);
        setUser(res.data.data);
        alert("登録したメールアドレスに、認証メールを送りました。メール内の確認リンクをクリックしてください")
        alert("サインアップ後は、サインインをしてください")
        return true;
      }
    } catch (e) {
      alert("サインアップに失敗しました")
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // サインイン機能
  const signIn = async (email, password) => {
    const params = {
      email,
      password,
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
      alert("サインインに失敗しました")
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // サインアウト機能
  const signOut = async () => {
    setLoading(true);

    try {
      console.log(Cookies.get("_access_token"));
      console.log(Cookies.get("_client"),);
      console.log(Cookies.get("_uid"));
      const res = await client.delete("v1/auth/sign_out", {
        headers: {
          "access-token": Cookies.get("_access_token"),
          client: Cookies.get("_client"),
          uid: Cookies.get("_uid"),
        },
      });

      if (res.status === 200) {
        setIsSignedIn(false);
        setUser("");
        return true;
      }
    } catch (e) {
      alert("サインアウトに失敗しました")
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isSignedIn, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

// Contextから認証valueを使用するための関数を定義
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;