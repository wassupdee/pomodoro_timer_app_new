import React, { createContext, useState, useContext, ReactNode } from 'react';
import Cookies from "js-cookie";
import client from "../api/apiClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSignedIn: boolean;
  signUp: (args: SignUpArg) => Promise<boolean | void>;
  signIn: (args: SignInArg) => Promise<boolean | void>;
  signOut: () => Promise<boolean | void>;
  getCurrentUser: () => Promise<void>;
}

interface SignUpArg {
  email: string;
  password: string;
  passwordConfirmation: string;
  confirmSuccessUrl: string;
}

interface SignInArg {
  email: string;
  password: string;
}

interface User {
  allowPasswordChange: boolean;
  createdAt: string;
  email: string;
  id: number;
  image?: string;
  name?: string;
  nickname?: string;
  provider: string;
  uid: string;
  updatedAt: string;
}

// 認証用のContextを作成
const AuthContext = createContext<AuthContextType | null>(null);

// 認証用のコンポーネント（ContextProvider）を作成
// コンポーネントタグで囲んだ子コンポーネントを受け取れるようにする
const AuthProvider:React.FC<{ children: ReactNode}> = ( {children} ) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState<AuthContextType["loading"]>(false);
  const [isSignedIn, setIsSignedIn] = useState<AuthContextType["isSignedIn"]>(false);

  // サインアップ機能
  const signUp: AuthContextType["signUp"] = async ({email, password, passwordConfirmation, confirmSuccessUrl}) => {
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
        Cookies.set("_access_token", res.headers["accessToken"]);
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
  const signIn: AuthContextType["signIn"] = async ({email, password}) => {
    const params = {
      email,
      password,
    };
    setLoading(true);

    try {
      const res = await client.post("v1/auth/sign_in", params);
      if (res.status === 200) {
        Cookies.set("_access_token", res.headers["accessToken"]);
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
  const signOut: AuthContextType["signOut"] = async () => {
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
        setUser(null);
        return true;
      }
    } catch (e) {
      alert("サインアウトに失敗しました")
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // ログインユーザーの取得
  const getCurrentUser: AuthContextType["getCurrentUser"] = async () => {
    setLoading(true);

    if (
      !Cookies.get("_access_token") ||
      !Cookies.get("_client") ||
      !Cookies.get("_uid")
    )
      return;

    try {
      const res = await client.get("v1/auth/sessions", {
        headers: {
          "access-token": Cookies.get("_access_token"),
          client: Cookies.get("_client"),
          uid: Cookies.get("_uid"),
        },
      });
      if (res?.data.isLogin === true) {
        setIsSignedIn(true);
        setUser(res?.data.data);
        console.log(res?.data.data);
      } else {
        console.log(res?.data.data);
        console.log("no current user");
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isSignedIn, signIn, signOut, signUp, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Contextから認証valueを使用するための関数を定義
export const useAuth = () => {
  //AuthContextがnullの場合、AuthContextのプロパティにアクセスができない可能性があるのでエラーが起きる。
  //事前にnullかチェックする
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContextがnullです");
  }
  return context;
};

export default AuthProvider;