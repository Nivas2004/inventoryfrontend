import React from "react";
import { useSidebar } from "../context/SidebarContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FiHome, FiPlusCircle, FiMenu } from "react-icons/fi";

function Sidebar() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <div
      className={`h-screen bg-[#0f172a] text-white fixed top-0 left-0 transition-all duration-300 shadow-lg ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* TOP SECTION — Toggle + Title */}
      <div className="p-4 flex items-center gap-3">
        {/* Toggle Button */}
        <button onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>

        {/* Inventory Menu Title (shows only when open) */}
        {open && (
          <h1 className="text-lg font-semibold whitespace-nowrap">
            Inventory Menu
          </h1>
        )}
      </div>

      {/* Menu Items */}
      <nav className="mt-4 px-2">
        <a
          href="/"
          className="flex items-center gap-3 py-3 px-2 rounded hover:bg-gray-700 transition"
        >
          <FiHome size={20} />
          {open && <span>Dashboard</span>}
        </a>

        <a
          href="/add"
          className="flex items-center gap-3 py-3 px-2 rounded hover:bg-gray-700 transition"
        >
          <FiPlusCircle size={20} />
          {open && <span>Add Product</span>}
        </a>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 w-full px-2">
        <button
          onClick={() => {
            signOut(auth);
            window.location.href = "/login";
          }}
          className="w-full bg-red-600 py-2 rounded hover:bg-red-700"
        >
          {open ? "Logout" : "🚪"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
