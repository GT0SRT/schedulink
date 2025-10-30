import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiBookOpen, FiCalendar, FiFileText, FiMessageSquare, FiClipboard,
  FiLogOut, FiBarChart2, FiHelpCircle, FiSettings,} from "react-icons/fi";
import { FaChalkboardTeacher, FaRegUser, FaUserGraduate } from "react-icons/fa";
import { CiCircleAlert } from "react-icons/ci";
import useUserStore from "../store/userStore";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FaBuilding } from "react-icons/fa";

const studentMenu = [
  { name: "Dashboard", icon: <FiBookOpen size={20} />, path: "/dashboard" },
  { name: "Schedule", icon: <FiCalendar size={20} />, path: "/schedule" },
  { name: "Attendance", icon: <FiFileText size={20} />, path: "/attendance" },
  { name: "Feedback", icon: <FiMessageSquare size={20} />, path: "/feedback" },
  { name: "Tasks", icon: <FiClipboard size={20} />, path: "/tasks" },
  { name: "Profile", icon: <FaRegUser size={20} />, path: "/profile" },
];

const teacherMenu = [
  { name: "Dashboard", icon: <FiBookOpen size={20} />, path: "/dashboard" },
  { name: "My Classes", icon: <FiCalendar size={20} />, path: "/MyClasses" },
  { name: "Report Absence", icon: <CiCircleAlert size={20} />, path: "/reportabsence" },
  { name: "Feedback", icon: <FiMessageSquare size={20} />, path: "/feedback" },
  { name: "Profile", icon: <FaRegUser size={20} />, path: "/profile" },
];

const adminMenu = [
  { name: "Overview", icon: <FiBarChart2 size={20} />, path: "/overview" },
  { name: "Manage Schedules", icon: <FiCalendar size={20} />, path: "/schedules" },
  { name: "Manage Departments", icon: <FaBuilding size={20} />, path: "/departments" },
  { name: "Manage Teachers", icon: <FaChalkboardTeacher size={20} />, path: "/teachers" },
  { name: "Manage Students", icon: <FaUserGraduate size={20} />, path: "/students" },
  { name: "Reports", icon: <HiOutlineDocumentReport size={20} />, path: "/reports" },
  { name: "Help", icon: <FiHelpCircle size={20} />, path: "/help" },
  { name: "Settings", icon: <FiSettings size={20} />, path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const user = useUserStore(state => state.user);
  const [menuItems, setMenuItems] = useState([]);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/signin');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!user) {
      setMenuItems([]);
      return;
    }

    switch (user.role) {
      case "s":
        setMenuItems(studentMenu);
        break;
      case "t":
        setMenuItems(teacherMenu);
        break;
      case "a":
        setMenuItems(adminMenu);
        break;
      default:
        setMenuItems([]);
    }
  }, [user]);

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
        <button
          onClick={handleLogout}
          className="flex items-center justify-center pb-5 mr-16 gap-2 text-sm hover:text-gray-300">
          <FiLogOut size={18} /> Log Out
        </button>
      </div>
    </div>
  );
}