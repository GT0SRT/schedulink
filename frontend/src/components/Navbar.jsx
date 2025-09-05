import { useState, useEffect, useRef } from "react";
import { IoMdExit } from "react-icons/io";
import { RiMenu2Fill } from "react-icons/ri";
import { FiBell, FiSun, FiMoon } from "react-icons/fi";
import { Link } from "react-router-dom";
import Sidebar from "./sidebar";
import themeStore from "../store/themeStore";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const sidebarRef = useRef(null);
  const profileRef = useRef(null);
  const [dark, setDarkMode] = useState(themeStore((state) => state.dark));

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        menuOpen
      ) {
        setMenuOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        profileOpen
      ) {
        setProfileOpen(false);
      }
    }
    if (menuOpen || profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, profileOpen]);

  return (
    <div className={`h-18 ${dark ? '':'bg-white'} flex items-center justify-between px-6 shadow-md`}>
      {/* Hamburger menu visible only on mobile */}
      <RiMenu2Fill
        onClick={toggleMenu}
        className={`m-2 cursor-pointer ${window.innerWidth <= 767 ? "block" : "hidden"}`}
        size={25}
      />

      <div className="flex items-center gap-4 ml-auto mr-3 relative">
        {/* Notification Icon */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-full hover:bg-gray-200 transition"
        >
          <FiBell size={22} className="text-[#2C3E86]" />
          {/* active badge */}
          <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Theme toggler */}
        <button
          aria-label="Toggle Theme"
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          {dark ? (
            <FiSun size={22} className="text-yellow-400" />
          ) : (
            <FiMoon size={22} className="text-[#2C3E86]" />
          )}
        </button>

        {/* Profile Image */}
        <div className="relative">
          <img
            src="https://img.freepik.com/premium-vector/back-school-cartoon-boy-student-showing-fingers-up_46527-623.jpg"
            alt="Profile"
            className="w-12 h-12 m-1 opacity-80 rounded-full border-2 cursor-pointer border-[#2C3E86]"
          />
        </div>
      </div>

      {/* Sidebar for Mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex bg-black/40 md:hidden">
          <div ref={sidebarRef} className="w-3/4 max-w-xs">
            <Sidebar />
          </div>
          <div className="flex-1" />
        </div>
      )}
    </div>
  );
}