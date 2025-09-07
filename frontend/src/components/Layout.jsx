import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen">
      {typeof window !== "undefined" && window.innerWidth <= 767 ? null : <Sidebar />}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <div className=" ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}