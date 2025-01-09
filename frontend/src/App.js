import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import Countdown from './components/Countdown';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
// import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Countdown />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signout" element={<SignOut />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
