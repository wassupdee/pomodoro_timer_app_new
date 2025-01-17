import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from "js-cookie";
import client from "../api/apiClient";
import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  hasFetched: boolean;
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

interface AuthHeaders {
  "access-token"?: string;
  client?: string;
  uid?: string;
}

// 認証用のContextを作成
const AuthContext = createContext<AuthContextType | null>(null);

// 認証用のコンポーネント（ContextProvider）を作成
// コンポーネントタグで囲んだ子コンポーネントを受け取れるようにする
const AuthProvider:React.FC<{ children: ReactNode}> = ( {children} ) => {

  //--------state--------
  //認証後、APIから取得したユーザー情報を保持するstate
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  //サインイン状態を管理するstate
  const [isSignedIn, setIsSignedIn] = useState<AuthContextType["isSignedIn"]>(false);

  //APIとの通信完了を管理するstate
  const [hasFetched, setHasFetched] = useState<AuthContextType["hasFetched"]>(false);

  //--------クッキー処理--------
  const setAuthToCookiesFromHeaders = (headers: AxiosResponseHeaders | RawAxiosResponseHeaders): void => {
    Cookies.set("_access_token", headers["accessToken"]);
    Cookies.set("_client", headers["client"]);
    Cookies.set("_uid", headers["uid"]);
  };

  const setAuthToHeadersFromCookies = (): Partial<AuthHeaders> => {
    return {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    };
  };

  const clearAuthInCookies = (): void => {
    Cookies.remove("_access_token");
    Cookies.remove("_client");
    Cookies.remove("_uid");
  };

  //--------認証機能--------
  // サインアップ機能
  const signUp: AuthContextType["signUp"] = async ({email, password, passwordConfirmation, confirmSuccessUrl}) => {
    const params = {
      email,
      password,
      passwordConfirmation,
      confirmSuccessUrl,
    };
    setHasFetched(false);

    try {
      const res = await client.post("v1/auth", params);
      if (res.status === 200) {
        setAuthToCookiesFromHeaders(res.headers)
        setUser(res.data.data);
        alert("登録したメールアドレスに、認証メールを送りました。メール内の確認リンクをクリックしてください");
        alert("サインアップ後は、サインインをしてください");
        console.log("サインアップに成功しました（メール認証は未実施")
        return true;
      }
    } catch (e) {
      alert("サインアップに失敗しました")
      console.log(e);
    } finally {
      setHasFetched(true);
    }
  };

  // サインイン機能
  const signIn: AuthContextType["signIn"] = async ({email, password}) => {
    const params = {
      email,
      password,
    };
    setHasFetched(false);

    try {
      const res = await client.post("v1/auth/sign_in", params);
      if (res.status === 200) {
        setAuthToCookiesFromHeaders(res.headers)
        setIsSignedIn(true);
        setUser(res.data.data);
        alert("サインインしました");
        console.log("サインインに成功しました", res.data.data);
        return true;
      }
    } catch (e) {
      alert("サインインに失敗しました")
      console.log(e);
    } finally {
      setHasFetched(true);
    }
  };

  // サインアウト機能
  const signOut: AuthContextType["signOut"] = async () => {
    setHasFetched(false);

    try {
      const res = await client.delete("v1/auth/sign_out", {
        headers: setAuthToHeadersFromCookies(),
      });

      if (res.status === 200) {
        setIsSignedIn(false);
        setUser(null);
        clearAuthInCookies();
        alert("サインアウトしました");
        console.log("サインアウトに成功しました")
        return true;
      }
    } catch (e) {
      alert("サインアウトに失敗しました")
      console.log(e);
    } finally {
      setHasFetched(true);
    }
  };

  // ログインユーザーの取得
  const getCurrentUser: AuthContextType["getCurrentUser"] = async () => {
    setHasFetched(false);

    if (
      !Cookies.get("_access_token") ||
      !Cookies.get("_client") ||
      !Cookies.get("_uid")
    )
      return;

    try {
      //Cookieに認証情報があればログイン済みとすることもできるが、user情報はCookieに保存していないため、API通信を行う
      const res = await client.get("v1/auth/sessions", {
        headers: setAuthToHeadersFromCookies(),
      });
      if (res?.data.isLogin === true) {
        setIsSignedIn(true);
        setUser(res?.data.data);
        console.log("ログインユーザー情報を取得しました",res?.data.data);
      } else {
        //未ログインユーザーに対してはUIの出し分けやリダイレクトをするため、alertは表示しない
        setIsSignedIn(false);
        console.log(res?.data.data);
        console.log("ログインユーザー情報を取得できませんでした");
      }
    } catch (e) {
      console.log(e);
    }
    setHasFetched(true);
  };

  // 初回レンダリング（ページ更新時を想定）で、ユーザー認証を実行する
  useEffect(() => {
    getCurrentUser();
    console.log("初回レンダリングで、AuthProviderからgetCurrentUserをuseEffectで実行")
  },[]);

  return (
    <AuthContext.Provider value={{ user, isSignedIn, hasFetched, signIn, signOut, signUp, getCurrentUser }}>
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