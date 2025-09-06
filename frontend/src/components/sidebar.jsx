import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBookOpen, FiCalendar, FiFileText, FiMessageSquare, FiClipboard,
  FiLogOut,} from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FiBookOpen size={20} />, path: "/dashboard" },
  { name: "Schedule", icon: <FiCalendar size={20} />, path: "/schedule" },
  { name: "Attendance", icon: <FiFileText size={20} />, path: "/attendance" },
  { name: "Feedback", icon: <FiMessageSquare size={20} />, path: "/feedback" },
  { name: "Tasks", icon: <FiClipboard size={20} />, path: "/tasks" },
  { name: "Profile", icon: <FaRegUser size={20} />, path: "/profile" },
];

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  // Find active item by matching current path to menu item path
  const activeItem = menuItems.find((item) =>
    currentPath === "/" && item.path === "/dashboard"
      ? true
      : currentPath.startsWith(item.path)
  )?.name;

  return (
    <div className="flex overflow-y-hidden bg-[#2C3E86] w-11/12 md:w-1/4">
      {/* Left narrow bar */}
      <div className="h-screen w-18 bg-[#3D57bb] flex flex-col items-center py-6 space-y-6 rounded-2xl">
        <div className="text-white text-xl font-bold h-3"></div>
        <div className="flex flex-col p-0 gap-2 mt-6">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.name}
              className={`p-2 mt-1 text-white flex justify-center ${
                activeItem === item.name
                  ? "border-l-2 border-white"
                  : "rounded-xl"
              }`}
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Right bar */}
      <div className="h-screen w-full pr-0 bg-[#2C3E86] text-white p-2 flex flex-col">
        <h1 className="text-xl font-bold mt-3 text-center pt-3">schedulink</h1>

        <div className="flex flex-col p-0 gap-2 mt-6">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.name}
              className={`text-left p-2 rounded-2xl transition ${
                activeItem === item.name
                  ? "bg-white text-[#2C3E86] rounded-r-none"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex-1" />

        {/* Logout button */}
        <Link
          to="/signin"
          className="flex items-center justify-center pb-5 mr-16 gap-2 text-sm hover:text-gray-300">
          <FiLogOut size={18} /> Log Out
        </Link>
      </div>
    </div>
  );
}