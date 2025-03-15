import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
  const [searchData, setSearchData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const authToken = localStorage.getItem("authToken");
      // console.log("Auth Token:", authToken);
  
      if (!authToken) {
        // console.log("no token found");
      }
  
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/whoami`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
            withCredentials: true,
          }
        );
        console.log("API Response:", response.data);
        // setUser(response.data.user);
        // localStorage.setItem('username', user.name)
        // console.log('username stored in local storage')
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    getUser();
  }, []);


  const value = {
    user,
    searchData,
    setSearchData,
    isLoading, 
    setIsLoading
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
