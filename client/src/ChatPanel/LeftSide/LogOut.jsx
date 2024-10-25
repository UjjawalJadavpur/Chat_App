import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../Zustand/useAuthStore.jsx';
import Cookies from 'js-cookie';
import useConversation from '../../Zustand/userConversation.jsx';

function LogOut() {

  const navigate = useNavigate();
  const { setAuthUser } = useAuthStore();
  const { selectedConversation, setSelectedConversation } = useConversation();

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5017/user/logout', {}, 
                       { withCredentials: true });

      if (response.status === 200) {
        localStorage.clear();
        Cookies.remove('jwt');
        setAuthUser(null);
        setSelectedConversation(null);
        navigate('/login'); 
      } else {
        console.error('Logout failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error message, request & error.response :', error.message,error.request,error.response);
    }
  };
  return (
    <div>
    <button className='logoutButton' onClick={handleLogout}>
      <FontAwesomeIcon icon={faSignOut} />
      <span>Log Out</span> {/* Added text outside FontAwesomeIcon */}
    </button>
  </div>
  )
}

export default LogOut
