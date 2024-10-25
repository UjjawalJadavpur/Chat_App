import React from 'react'
import getAllUsers from '../../hooks/useGetAllUsers.jsx';
import useConversation from '../../Zustand/userConversation.jsx';
import useSocketStore from '../../Zustand/useSocket.jsx';

function Users() {

  const [allUsers, loading] = getAllUsers();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketStore();


  const handleSelectConversation = (user) => {
    setSelectedConversation(user);
    localStorage.setItem('selectedReceiver', JSON.stringify(user));
  };

  const storedData = JSON.parse(localStorage.getItem("Chat_App")) || {};

  return (
    <div className='leftUser'>
      <div className='headerUsers'>
        <img
          src={storedData.user.profilePic}  // Use the saved URL from MongoDB
          alt={`${storedData.user.userName}'s profile`}
          className="leftLoggedInProfilePic"
        />
        <h4>You</h4>
      </div>

      <div className='allUsers'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className='userList'>
            {allUsers.length > 0 ? (
              <ul className='userListUL'>
                {allUsers.map(user => (
                  <li key={user._id} onClick={() => handleSelectConversation(user)}>
                    {/* Render profile picture directly from MongoDB */}
                    <img
                      src={user.profilePic}  // Use the saved URL from MongoDB
                      alt={`${user.userName}'s profile`}
                      className="profilePic"
                    />
                    <span>{user.userName}</span>
                    {onlineUsers.includes(user._id) && (
                      <button className='statusButton' title='Online'></button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
