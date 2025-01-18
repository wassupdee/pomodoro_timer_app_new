import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

const PrivateRoute = ({ children }) => {

  // ログイン中のユーザー情報を受けとる
  const { user, hasFetched } = useAuth();
  console.log("PrivateRouteコンポーネントがレンダリングされました", hasFetched, user)

  // APIからUser情報を取得中は何も表示せず遷移を保留
  if (!hasFetched) {
    return;
  }

  // hasFetchedがtrueとなると、当コンポーネントが再レンダリングされる
　/// user情報が取得できれば、子コンポーネントをレンダリングする
  if (user) {
    return <>{children}</>;
  }

  /// user情報を取得できなければ、リダイレクトする
  if (!hasFetched && user === null) {
    console.log("signinへリダイレクトします", hasFetched, user)
    return <Navigate to="/signin" />;
  }
};

export default PrivateRoute;
