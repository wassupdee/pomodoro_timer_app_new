import { useEffect } from "react";
import { Link } from "react-router-dom";
import Countdown from './Countdown';
import { useAuth } from "./AuthProvider";
import SignOut from "./SignOut";

const Home = () => {
  const { isSignedIn } = useAuth();

  console.log("Homeコンポーネントがレンダリングされました")

  return (
    <>
      <Countdown />
      { isSignedIn ? (
        <>
          <SignOut/>
          <Link to="/timer_records">記録ページ</Link>
        </>
      ) : (
        <>
          <Link to="/signin">サインイン</Link>
          <Link to="/signup">サインアップ</Link>
          <p>作業時間・休憩時間を記録するには、サインインをしてください</p>
        </>
      )}
    </>
  );
}

export default Home;