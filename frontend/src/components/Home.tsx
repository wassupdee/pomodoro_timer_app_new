import { useEffect } from "react";
import { Link } from "react-router-dom";
import Countdown from './Countdown';
import { useAuth } from "./AuthProvider";
import SignOut from "./SignOut";

const Home = () => {
  const { isSignedIn } = useAuth();

  console.log("Homeコンポーネントがレンダリングされました")

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl text-center">ポモドーロタイマー</h1>
      <Countdown />
      { isSignedIn ? (
        <div className="flex flex-col items-center mt-10">
          <Link to="/timer_records" className="font-medium text-blue-600 dark:text-blue-500 underline space-x-4 text-lg text-center flex">記録ページ</Link>
          <div className="flex flex-col mt-10">
            <p className="text-center">ログイン中</p>
            <SignOut/>
          </div>
        </div>
      ) : (
        <div className="mt-12">
          <div className="font-medium text-blue-600 dark:text-blue-500 underline space-x-4 text-lg text-center">
            <Link to="/signin">サインイン</Link>
            <Link to="/signup">サインアップ</Link>
          </div>
          <p className="text-center">時間を記録するには、サインインしてください</p>
        </div>
      )}
    </div>
  );
}

export default Home;