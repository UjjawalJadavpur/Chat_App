import React, { useState } from 'react';
// import './SignIn.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../Zustand/useAuthStore';

function SignIn() {

  const [isSignIn, setIsSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5017/user/login', 
        { email, password }, 
        { withCredentials: true }  // Add this line to ensure cookies are sent and received
      );

      console.log('Login successful:', response);
      setAuthUser(response.data);
      navigate('/')

      localStorage.setItem("Chat_App", JSON.stringify(response.data));
    }
    catch (error) {
      console.log('Login failed:', error.response);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  const handleSignUpClick = () => {
    setIsSignIn(false); // Switch to Sign Up mode
  };

  const handleSignInClick = () => {
    setIsSignIn(true); // Switch to Sign In mode
  };

  return (

    <div className="fullContainer">
      <h2>Blabber-Bubble</h2>
      <div className='formContainer'>
        <div className='buttonContainer'>
          <button className={`authToggleButton ${isSignIn ? 'active' : ''}`} onClick={() => setIsSignIn(true)}>Sign In</button>
          <Link to="/register" style={{ textDecoration: "none" }} className={`authToggleButton ${!isSignIn ? 'active' : ''}`} >Sign Up</Link>

        </div>
        <div className="loginForm">
          <h3>Discover the Joy of Chatting on <strong>Blabber-Bubble</strong>!</h3><br />
          <div className="loginInputContainer">
            <FontAwesomeIcon icon={faEnvelope} className="loginInputIcon" />
            <input
              type="text"
              className="loginInputField"
              value={email}
              placeholder="Enter your Email-id"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="loginInputContainer">
            <FontAwesomeIcon icon={faLock} className="loginInputIcon" />
            <input
              type="password"
              className="loginInputField"
              value={password}
              placeholder="Enter your Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="loginButton" onClick={handleLogin}>Log in</button>
          <h4>Where Your Fingers Do the Talking</h4>
        </div>
      </div>
    </div>
  )
}

export default SignIn
