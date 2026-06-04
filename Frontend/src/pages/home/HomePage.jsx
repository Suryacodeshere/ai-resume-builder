import Header from "@/components/custom/Header";
import React, { useEffect } from "react";
import heroSnapshot from "@/assets/heroSnapshot.png";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaCircle, FaInfoCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { startUser } from "../../Services/login.js";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "@/features/user/userFeatures.js";

function HomePage() {
  const user = useSelector((state) => state.editUser.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = () => {
    window.open(
      "https://github.com/suryacodeshere/ai-resume-builder",
      "_blank"
    );
  };

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await startUser();
        if (response.statusCode == 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(""));
        }
      } catch (error) {
        console.log(
          "Printing from Home Page there was a error ->",
          error.message
        );
        dispatch(addUserData(""));
      }
    };
    fetchResponse();
  }, []);

  const hadnleGetStartedClick = () => {
    if (user) {
      console.log("Printing from Homepage User is There ");
      navigate("/dashboard");
    } else {
      console.log("Printing for Homepage User Not Found");
      navigate("/auth/sign-in");
    }
  };
  return (
    <>
      <Header user={user} />
      <div className="relative min-h-[90vh] bg-dot-pattern pt-20 pb-16 overflow-hidden flex flex-col justify-between">
        {/* Radial blur gradients for premium glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="px-6 md:px-12 mx-auto max-w-7xl w-full flex flex-col items-center">
          <div className="w-full text-center max-w-4xl flex flex-col items-center">
            {/* Elegant AI Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 backdrop-blur-sm text-indigo-700 text-xs font-semibold mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>AI-Powered Resume Builder</span>
            </div>

            {/* Dynamic Typography */}
            <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-gray-900 md:text-7xl">
              Build a Professional <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Resume with AI
              </span>
            </h1>

            {/* Premium Description */}
            <p className="px-0 mb-10 text-lg text-gray-500 md:text-xl lg:px-32 font-medium leading-relaxed">
              Build. Refine. Shine. Craft your standout resume with Gemini-powered descriptions and summaries tailored for your target roles.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full sm:w-auto">
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 cursor-pointer"
                onClick={hadnleGetStartedClick}
              >
                Get Started for Free
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <button
                onClick={handleClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 active:scale-95 rounded-2xl border border-gray-200 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <FaGithub className="w-5 h-5" />
                Explore GitHub
              </button>
            </div>
          </div>

          {/* Screenshot Card Wrapper */}
          <div className="w-full mx-auto max-w-5xl px-4">
            <div className="relative rounded-2xl border border-white/60 p-2 bg-white/30 backdrop-blur-sm shadow-2xl shadow-indigo-900/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-pink-500/5 rounded-2xl -z-10" />
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                <div className="flex items-center justify-between px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 h-10">
                  <div className="flex space-x-1.5">
                    <FaCircle className="w-2.5 h-2.5 text-white/40" />
                    <FaCircle className="w-2.5 h-2.5 text-white/40" />
                    <FaCircle className="w-2.5 h-2.5 text-white/40" />
                  </div>
                  <div className="h-5 w-48 bg-white/10 rounded-md" />
                  <FaInfoCircle className="text-white/40 w-3.5 h-3.5" />
                </div>
                <img
                  className="w-full object-cover py-1 px-1 rounded-b-xl shadow-inner transition-transform duration-500 hover:scale-[1.01]"
                  src={heroSnapshot}
                  alt="Dashboard"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Premium footer */}
        <footer className="mt-20 border-t border-gray-100 bg-white/60 backdrop-blur-sm py-6 px-8 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 font-medium">
            &copy; 2024 AI Resume Builder. Empowering careers globally.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-gray-400 hover:text-indigo-600 transition-colors" onClick={handleClick}>
              <FaGithub className="w-4 h-4 mr-2" />
              GitHub Repository
            </Button>
          </div>
        </footer>
      </div>
    </>
  );
}

export default HomePage;
