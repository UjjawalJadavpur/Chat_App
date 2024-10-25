import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faVenusMars, faUpload, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import useAuthStore from '../Zustand/useAuthStore.jsx'
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebaseConfig.js'
import defaultProfilePics from './images/defaultPicture.jsx';

function ProfilePicture({ username, gender, profilePic }) {
    const defaultAvatar = gender === 'male' ? 'M' : 'F';
    return (
        <div className="avatarPreview">
            {profilePic ? (
                <img src={profilePic} alt="Profile Preview" className="profilePicPreview" />
            ) : (
                <Avatar name={username || defaultAvatar} round={true} />
            )}
        </div>
    );
}

function SignUp() {
    const [isSignIn, setIsSignIn] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [profilePic, setProfilePic] = useState(null); // Save the URL from Firebase
    const [passwordVisible, setPasswordVisible] = useState(false);

    const setAuthUser = useAuthStore((state) => state.setAuthUser);
    const navigate = useNavigate();

    const handleSignInClick = () => {
        setIsSignIn(false);
        navigate('/login');
    };

    const handleSignUpClick = () => {
        setIsSignIn(true);
    };

    // Function to upload profile picture to Firebase
    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024; // 5 MB
        if (!file) return;

        const validFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

        if (!validFileTypes.includes(file.type)) {
            alert("Please upload a valid image file (JPEG/PNG/GIF).");
            return;
        }

        if (file.size > maxSize) {
            alert("File size exceeds 5 MB. Please upload a smaller image.");
            return;
        }

        const storageRef = ref(storage, `profile-pictures/${file.name}`); // Create a reference to the file in Firebase

        try {
            const snapshot = await uploadBytes(storageRef, file); // Upload file to Firebase Storage
            const downloadURL = await getDownloadURL(snapshot.ref); // Get the download URL
            console.log('File uploaded successfully:', downloadURL);
            setProfilePic(downloadURL); // Save the URL in the profilePic state
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert("Failed to upload profile picture. Please try again.");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !email || !password || !gender) {
            alert('Please fill in all required fields');
            return;
        }

        const profilePicUrl = profilePic || defaultProfilePics[gender];

        try {
            const response = await axios.post('http://localhost:5017/user/signUp',
                { userName: username, email, password, gender, profilePic: profilePicUrl },
                { withCredentials: true }
            );

            console.log('Sign up successful:', response);

            if (response.status >= 200 && response.status < 300) {
                alert('Registered Successfully');
                setUsername('');
                setPassword('');
                setEmail('');
                setGender('');
                setProfilePic(null);
                setAuthUser(response.data);
                localStorage.setItem("Chat_App", JSON.stringify(response.data));
                navigate('/');
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            console.error('Sign up failed:', error.response?.data || error.message);
            alert('Registration failed. Please check your details and try again.');
        }
    };

    return (
        <div className="fullContainer">
            <h2>Blabber-Bubble</h2>
            <div className='formContainer'>
                <div className='buttonContainer'>
                    <button className={`authToggleButton ${isSignIn ? 'active' : ''}`} onClick={handleSignInClick}>Sign In</button>
                    <button className={`authToggleButton ${!isSignIn ? 'active' : ''}`} onClick={handleSignUpClick}>Sign Up</button>
                </div>
                <div className="registrationForm">
                    <h3>Please enter your personal details below:</h3>
                    <div className="regInputContainer">
                        <FontAwesomeIcon icon={faUser} className="regInputIcon" />
                        <input
                            type="text"
                            className="regInputField"
                            value={username}
                            placeholder="Enter the User Name"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="regInputContainer">
                        <FontAwesomeIcon icon={faEnvelope} className="regInputIcon" />
                        <input
                            type="email"
                            className="regInputField"
                            value={email}
                            placeholder="Enter your Email-id"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="regInputContainer">
                        <FontAwesomeIcon icon={faLock} className="regInputIcon" />
                        <input
                            type={passwordVisible ? "text" : "password"}
                            className="regInputField"
                            value={password}
                            placeholder="Enter your Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="passwordToggleBtn"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    <div className="regInputContainer">
                        <FontAwesomeIcon icon={faVenusMars} className="regInputIcon" />
                        <select className="regInputField" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="transgender">Transgender</option>
                        </select>
                    </div>
                    <div className="regInputContainer">
                        <FontAwesomeIcon icon={faUpload} className="regInputIcon" />
                        <input type="file" className="regInputField" onChange={handleProfilePicChange} />
                    </div>
                    <button className="registerButton" onClick={handleRegister}>Register</button>
                    <h4>Start your Journey with us</h4>
                </div>
            </div>
        </div>
    )
}

export default SignUp;
