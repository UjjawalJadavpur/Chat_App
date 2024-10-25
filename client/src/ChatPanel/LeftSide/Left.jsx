import React, { useState, useEffect } from 'react';
import Users from './Users';
import LogOut from './LogOut';

function Left() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); 
  const [isMobile, setIsMobile] = useState(false); 

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setIsSidebarVisible(false); 
      } else {
        setIsMobile(false);
        setIsSidebarVisible(true); 
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Toggle button for mobile screens (hidden on larger screens) */}
      {isMobile && (
        <button className="toggleSidebarBtn" onClick={toggleSidebar}>
          ☰ Menu
        </button>
      )}

      {/* Sidebar with conditional class based on isSidebarVisible */}
      <div className={`left ${isSidebarVisible ? 'visible' : 'hidden'}`}>
        <Users />
        <LogOut />
      </div>
    </>
  );
}

export default Left;
