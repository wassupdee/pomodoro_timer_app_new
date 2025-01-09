import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import SignUp from './components/SignUp';
import Home from './components/Home';
// import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signout" element={<SignOut />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
