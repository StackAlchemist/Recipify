import React, { useEffect, useState } from "react";
import ButtonFilled from "./ButtonFilled";
import ButtonTransparent from "./ButtonTransparent";
import { Link, useLocation, useNavigate } from "react-router-dom"; // FIXED: Should use `react-router-dom`
import { Dot, LogOut, User } from "lucide-react";
import axios from "axios";
import { div } from "framer-motion/client";
import { toast } from "react-toastify";

const Navbar = () => {
  const location = useLocation();

  const [user, setUser] = useState("");
  const navigate = useNavigate()



  const logout = async()=>{
    console.log('i was clicked')
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`,{},{
        withCredentials: true
      })
      localStorage.removeItem('authToken')
      toast.success('Logout successful')
      navigate('/login')
    } catch (error) {
      console.error(error)
      toast.error('Logout error')
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const authToken = localStorage.getItem("authToken");
      console.log("Auth Token:", authToken);
  
      if (!authToken) {
        console.log("no token found");
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
        setUser(response.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    getUser();
  }, []);

  // Function to check active link
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <div className="bg-emerald-600 py-6 md:flex hidden justify-between px-6 items-center">
        <Link to={"/"}>
          <h1 className="text-3xl text-white font-bold cursor-pointer">
            Recipify.
          </h1>
        </Link>

        {/* Nav Links */}
        <div className="flex gap-5">
          {[
            { path: "/feed", label: "Feed" },
            { path: "/upload", label: "Upload" },
            { path: "/about", label: "About" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center flex-col px-4 py-2 rounded-md transition-all duration-500 ${
                isActive(item.path)
                  ? "text-amber-300"
                  : "text-white hover:text-amber-300 hover:bg-white/10"
              }`}>
              {item.label}
              <Dot
                className={`absolute top-5 transition-opacity duration-300 ${
                  isActive(item.path) ? "opacity-100" : "opacity-0"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div>
          {user ? (
            <div className="flex gap-2">
            <div className="flex">
              <User color="white" />
              <p className="text-white">{user.name}</p>
            </div>
            <button onClick={logout} 
            // className="flex gap-2"
            >
              {/* <p>Logout</p> */}
              <LogOut color="red"/>
            </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <ButtonTransparent content={"Login"} />
              </Link>
              <Link to="/signup">
                <ButtonFilled content={"Signup"} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="bg-emerald-600 py-6 md:hidden flex justify-center px-6 items-center">
        <Link to={"/"}>
          <h1 className="text-3xl text-white font-bold cursor-pointer">
            Recipify.
          </h1>
        </Link>
      </div>
    </>
  );
};

export default Navbar;
