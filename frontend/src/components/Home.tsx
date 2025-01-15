import { useEffect } from "react";
import { Link } from "react-router-dom";
import Countdown from './Countdown';
import { useAuth } from "./AuthProvider";
import SignOut from "./SignOut";

interface AuthContext {
  isSignedIn: boolean;
  getCurrentUser: () => void;
}

const Home = () => {
  const { isSignedIn, getCurrentUser } = useAuth<AuthContext>();

  useEffect(() => {
    getCurrentUser();
  },[isSignedIn])

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
        </>
      )}
    </>
  );
}

export default Home;