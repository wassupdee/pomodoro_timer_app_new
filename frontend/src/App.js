import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import TimerRecordsList from './components/TimerRecordsList';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/timer_records"
              element={
              <PrivateRoute>
                <TimerRecordsList />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
