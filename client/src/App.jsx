import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './ChatPanel/Home.jsx';
import SignUp from './Components/SignUp.jsx';
import SignIn from './Components/SignIn.jsx';
import useAuthStore from './Zustand/useAuthStore.jsx';

function App() {
  const { authUser } = useAuthStore(); 

  return (
    <div className="App">
      <Routes>
        <Route  path="/" element={authUser ? <Home /> : (<Navigate to={"/login"} />)} />
        <Route path="/register" element={authUser ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <SignIn />} />
      </Routes>
    </div>
  );
}

export default App;
