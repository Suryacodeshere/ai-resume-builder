import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllResumeData } from "@/Services/resumeAPI";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";

function Dashboard() {
  const user = useSelector((state) => state.editUser.userData);
  const [resumeList, setResumeList] = React.useState([]);

  const fetchAllResumeData = async () => {
    try {
      const resumes = await getAllResumeData();
      console.log(
        `Printing from DashBoard List of Resumes got from Backend`,
        resumes.data
      );
      setResumeList(resumes.data);
    } catch (error) {
      console.log("Error from dashboard", error.message);
    }
  };

  useEffect(() => {
    fetchAllResumeData();
  }, [user]);

  return (
    <div className="relative min-h-[85vh] bg-dot-pattern py-12 px-6 md:px-16 lg:px-24 w-full">
      {/* Subtle radial glow */}
      <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="font-extrabold text-4xl text-gray-800 tracking-tight">My Resumes</h2>
          <p className="text-gray-400 font-medium text-sm mt-2">
            Create, manage, and edit your AI-driven resume documents for your next job opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full">
          <AddResume />
          {resumeList.length > 0 &&
            resumeList.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                refreshData={fetchAllResumeData}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
