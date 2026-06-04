import React, { useEffect } from "react";
import logo from "/logo.svg";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";

function Header({user}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user){
      console.log("Printing From Header User Found");
    }
    else{
      console.log("Printing From Header User Not Found");
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.statusCode == 200) {
        dispatch(addUserData(""));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      id="printHeader"
      className="sticky top-0 z-50 flex justify-between px-8 md:px-12 py-3.5 items-center glassmorphism shadow-sm w-full border-b border-white/20 transition-all duration-300"
    >
      <div className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="w-9 h-9 md:w-10 md:h-10 animate-pulse-slow" />
        <span className="font-extrabold text-lg md:text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
          AI Resume Builder
        </span>
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50/50 hover:text-indigo-700 rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Dashboard
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5 py-1.5 text-sm font-medium shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-200"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      ) : (
        <Link to="/auth/sign-in">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-1.5 text-sm font-medium shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all duration-200">
            Get Started
          </Button>
        </Link>
      )}
    </div>
  );
}

export default Header;
