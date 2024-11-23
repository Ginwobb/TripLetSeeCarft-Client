import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import logo1 from "../assets/logo1.png";
import UserAvatar from "../components/UserAvatar";
import useTripStore from "../stores/tripStore";
const MainNav = () => {
  const { user, token, logout } = useUserStore();
  const { resetTrip } = useTripStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePlanTripClick = () => {
    resetTrip();
    navigate("/");
  };
  return (
    <header className="flex justify-between w-full p-4 bg-header border-b-2 border-amber-400 shadow-md h-[100px]">
      <div className="flex items-center justify-center">
        <img src={logo1} alt="logo" className="w-44 h-44" />
      </div>
      <nav className="flex items-center space-x-4">
        <Link
          to="/"
          onClick={handlePlanTripClick}
          className="text-lg text-white font-medium hover:text-yellow-400 hover:scale-105 transition-transform duration-300"
        >
          Plan Trip
        </Link>
        <span className="text-lg text-white font-medium">|</span>
        <Link
          to={token ? "/user/profile" : "#"}
          onClick={
            !token
              ? (e) => {
                  e.preventDefault();
                }
              : null
          }
          className={`text-lg text-white font-medium hover:text-yellow-400 hover:scale-105 transition-transform duration-300 ${
            !token ? "cursor-not-allowed" : ""
          }`}
        >
          My Collection
        </Link>

        {!token ? (
          <>
            <button
              className="text-lg text-white font-medium hover:text-yellow-400 hover:scale-105 transition-transform duration-300"
              onClick={() =>
                document.getElementById("register_modal").showModal()
              }
            >
              Register
            </button>
            <button
              className="text-lg text-white font-medium hover:text-yellow-400 hover:scale-105 transition-transform duration-300"
              onClick={() => document.getElementById("login_modal").showModal()}
            >
              Login
            </button>
          </>
        ) : (
          <div className="relative">
            <UserAvatar
              imgSrc={user?.profileImage}
              className="w-20 h-20 rounded-full cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() =>
                document
                  .getElementById("user_dropdown")
                  .classList.toggle("hidden")
              }
            />
            <div
              id="user_dropdown"
              className="absolute right-0 mt-2 w-48 bg-header bg-opacity-50 rounded-md shadow-lg hidden"
            >
              <button
                className="block w-full px-4 py-2 text-white hover:font-bold text-center hover:text-yellow-400 hover:bg-gray-200 hover:bg-opacity-20 hover:rounded-md"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default MainNav;
