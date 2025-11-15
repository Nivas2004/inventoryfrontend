import React from "react";

function Navbar({ user }) {
  const defaultAvatar =
    "https://ui-avatars.com/api/?name=" +
    (user?.email || "User") +
    "&background=random";

  return (
    <div className="w-full bg-white shadow p-4 flex justify-end items-center gap-4 pr-6">

      {/* Profile Image */}
      <img
        src={user?.photoURL || defaultAvatar}
        alt="profile"
        className="w-10 h-10 rounded-full border"
      />

      {/* Email */}
      <span className="font-semibold">{user?.email}</span>
    </div>
  );
}

export default Navbar;
