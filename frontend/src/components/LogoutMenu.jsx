import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutMenu() {
  const [showOptions, setShowOptions] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("http://127.0.0.1:5000/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || "Failed to delete account");
      }

      localStorage.removeItem("access_token");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  // 👇 Detect clicks outside of menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptions(false);
        setShowConfirm(false);
      }
    };

    if (showOptions || showConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions, showConfirm]);

  return (
    <div className="absolute top-6 left-6 z-50" ref={menuRef}>
      <button
        onClick={() => setShowOptions((prev) => !prev)}
        className="text-3xl text-orange-300 hover:text-orange-500 focus:outline-none"
        title="Account Menu"
      >
        <FaSignOutAlt />
      </button>

      {showOptions && (
        <div className="mt-2 bg-white shadow-lg rounded-md border border-gray-200 w-48">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            <FaSignOutAlt className="text-lg text-gray-600" />
            Log out
          </button>
          <button
            onClick={() => {
              setShowConfirm(true);
              setShowOptions(false);
            }}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
          >
            Delete Account
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="absolute mt-2 bg-white border rounded-md p-4 shadow-md w-60">
          <p className="mb-2 text-sm">
            Are you sure you want to delete your account?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1 rounded border text-sm hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
