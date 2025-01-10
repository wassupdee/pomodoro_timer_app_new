import { useEffect } from "react";
import { Link } from "react-router-dom";
import Countdown from './Countdown';
import { useAuth } from "./AuthProvider";
import SignOut from "./SignOut";


const Home = () => {
  const { isSignedIn, getCurrentUser } = useAuth();

  useEffect(() => {
    getCurrentUser();
  },[isSignedIn])

  return (
    <>
      <Countdown />
      { isSignedIn ? (
        <SignOut/>
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