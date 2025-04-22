import React, { useEffect, useState } from "react";
import ButtonFilled from "./ButtonFilled";
import ButtonTransparent from "./ButtonTransparent";
import { Link, useLocation, useNavigate } from "react-router-dom"; // FIXED: Should use `react-router-dom`
import { Cross, Dot, LogOut, Menu, User, X } from "lucide-react";
import axios from "axios";
import { div } from "framer-motion/client";
import { toast } from "react-toastify";

const Navbar = () => {
  const location = useLocation();

  const [user, setUser] = useState("");
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const storedUser = localStorage.getItem('username')
  const navLinks = storedUser? [
    { path: "/feed", label: "Feed" },
    { path: "/upload", label: "Upload" },
    { path: "/liked-post", label: "Faves" },
    { path: "/analytics", label: "Analytics" },
  ] : [
    { path: "/about", label: "About" }
  ];


  const logout = async()=>{
    // console.log('i was clicked')
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`,{},{
        withCredentials: true
      })
      localStorage.removeItem('authToken')
      localStorage.removeItem('username')
      localStorage.removeItem('userID')
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
      if (!authToken) {
        console.log("No token found");
        return;
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
        localStorage.setItem("username", response.data.user.name);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    getUser();
  }, []);
  

  useEffect(()=>{
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUser({ name: storedUsername });
    }
  },[])

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
          {navLinks.map((item) => (
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
          {localStorage.getItem('username') ? (
            <div className="flex gap-2">
            <div className="flex">
              <User color="white" />
              <p className="text-white">{localStorage.getItem('username')}</p>
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
      <div>

      
      <div className="bg-emerald-600 py-6 md:hidden flex justify-between px-6 items-center">
        <Link to={"/"}>
          <h1 className="text-3xl text-white font-bold cursor-pointer">
            Recipify.
          </h1>
        </Link>


          <div className="flex gap-2">
          {user ? (
            <div className="flex gap-2">
            <div className="flex">
              <User color="white" />
              <p className="text-white">{user.name}</p>
            </div>
            </div>
          ) : (
            <div className="flex gap-2">
                            <Link to="/login">
                <ButtonTransparent content={"Login"} />
              </Link>
            </div>
          )}
                    <button onClick={()=>setIsOpen(!isOpen)}>
        {!isOpen?<Menu color="white"/>:
          <X color="white"/>}
        </button>
          </div>


        </div>

        {isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
    <div className="bg-gray-800 rounded-2xl shadow-2xl w-[90%] max-w-sm p-6 animate-fade-in-up">
      <div className="justify-items-end mb-3" onClick={() => setIsOpen(false)}><X color={'white'}/></div>
      <div className="flex gap-3 flex-col" onClick={() => setIsOpen(false)}>
        {[
          { path: "/feed", label: "Feed" },
          { path: "/upload", label: "Upload" },
          { path: "/liked-post", label: "Faves" },
          { path: "/analytics", label: "Analytics" },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative text-center px-4 py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
              isActive(item.path)
                ? "text-amber-300 bg-white/10"
                : "text-white hover:text-amber-300 hover:bg-white/10"
            }`}
          >
            {item.label}
            <Dot
              className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                isActive(item.path) ? "opacity-100" : "opacity-0"
              }`}
            />
          </Link>
        ))}

        <button
          className="flex items-center justify-center gap-2 text-white hover:bg-white/10 hover:text-amber-300 py-3 rounded-lg mt-2"
          onClick={logout}
        >
          <p>Logout</p>
          <LogOut color="red" />
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default Navbar;
