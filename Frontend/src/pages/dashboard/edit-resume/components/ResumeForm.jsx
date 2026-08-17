import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import PersonalDetails from "./form-components/PersonalDetails";
import Summary from "./form-components/Summary";
import Experience from "./form-components/Experience";
import Education from "./form-components/Education";
import Skills from "./form-components/Skills";
import Project from "./form-components/Project";
import Certifications from "./form-components/Certifications";
import Achievements from "./form-components/Achievements";
import CustomSection from "./form-components/CustomSection";
import { ArrowLeft, ArrowRight, HomeIcon, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ThemeColor from "./ThemeColor";

function ResumeForm() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enanbledNext, setEnabledNext] = useState(true);
  const [enanbledPrev, setEnabledPrev] = useState(true);
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const { resume_id } = useParams();

  useEffect(() => {
    setEnabledPrev(currentIndex > 0);
    setEnabledNext(currentIndex < 9);
  }, [currentIndex]);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Link to="/dashboard">
            <Button>
              <HomeIcon />
            </Button>
          </Link>
          <ThemeColor resumeInfo={resumeInfo}/> 
        </div>
        <div className="flex items-center gap-3">
          {currentIndex > 0 && (
            <Button
              size="sm"
              className="text-sm gap-2"
              disabled={!enanbledPrev}
              onClick={() => {
                if (currentIndex === 0) return;
                setCurrentIndex(currentIndex - 1);
              }}
            >
              <ArrowLeft /> Prev
            </Button>
          )}
          {currentIndex < 9 && (
            <Button
              size="sm"
              className="gap-2"
              disabled={!enanbledNext}
              onClick={() => {
                if (currentIndex >= 9) return;
                setCurrentIndex(currentIndex + 1);
              }}
            >
              Next <ArrowRight className="text-sm" />
            </Button>
          )}
        </div>
      </div>
      {currentIndex === 0 && (
        <PersonalDetails
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
        />
      )}
      {currentIndex === 1 && (
        <Summary
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enanbledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 2 && (
        <Education
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enabledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 3 && (
        <Experience
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enanbledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 4 && (
        <Project
          resumeInfo={resumeInfo}
          setEnabledNext={setEnabledNext}
          setEnabledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 5 && (
        <Skills
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enanbledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 6 && (
        <Certifications
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enabledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 7 && (
        <Achievements
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enabledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 8 && (
        <CustomSection
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enanbledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 9 && (
        <div className="p-10 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 text-center space-y-6 bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-green-50 text-green-600 rounded-full animate-bounce">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="font-extrabold text-2xl text-gray-800 font-sans">Your LaTeX Resume is Ready!</h2>
            <p className="text-gray-400 font-medium text-sm max-w-sm leading-normal font-sans">
              Congratulations! Your interview-ready resume has been formatted. You can now download it as a PDF or share it.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              onClick={() => window.print()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2.5 font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/15 font-sans"
            >
              Download PDF / Print
            </Button>
            <Link to={`/dashboard/view-resume/${resume_id}`}>
              <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl px-6 py-2.5 font-bold w-full sm:w-auto font-sans">
                Go to Share/View Page
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeForm;
