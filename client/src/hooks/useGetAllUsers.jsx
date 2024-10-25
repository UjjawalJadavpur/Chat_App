import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('jwt');
      const response = await axios.get("http://localhost:5017/user/allUsers", {
        withCredentials: true,   //"include",
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(response.data.filteredUsers);
    }
    catch (error) {
      console.log("Error fetching users:", error.response ? error.response.data : error.message);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return [allUsers, loading];
}

export default useGetAllUsers;

