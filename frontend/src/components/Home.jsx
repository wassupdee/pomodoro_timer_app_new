import { Link } from "react-router-dom";
import Countdown from './Countdown';
import { useAuth } from "./AuthProvider";
import SignOut from "./SignOut";


const Home = () => {
  const { isSignedIn } = useAuth();
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