import React from 'react';
import ButtonFilled from './ButtonFilled';
import ButtonTransparent from './ButtonTransparent';
import { Link, useLocation } from 'react-router-dom'; // FIXED: Should use `react-router-dom`
import { Dot } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  // Function to check active link
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <div className="bg-emerald-600 py-6 md:flex hidden justify-between px-6 items-center">
        <Link to={'/'}><h1 className="text-3xl text-white font-bold cursor-pointer">Recipify.</h1></Link>

        {/* Nav Links */}
        <div className="flex gap-5">
          {[
            { path: '/feed', label: 'Feed' },
            { path: '/upload', label: 'Upload' },
            { path: '/about', label: 'About' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center flex-col px-4 py-2 rounded-md transition-all duration-500 ${
                isActive(item.path) ? 'text-amber-300' : 'text-white hover:text-amber-300 hover:bg-white/10'
              }`}
            >
              {item.label}
              <Dot
                className={`absolute top-5 transition-opacity duration-300 ${
                  isActive(item.path) ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-2">
          <ButtonTransparent content={'Login'} />
          <ButtonFilled content={'Signup'} />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="bg-emerald-600 py-6 md:hidden flex justify-center px-6 items-center">
      <Link to={'/'}><h1 className="text-3xl text-white font-bold cursor-pointer">Recipify.</h1></Link>
      </div>
    </>
  );
};

export default Navbar;
