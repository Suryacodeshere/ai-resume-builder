import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, LoaderCircle, CheckCircle2, AlertTriangle, MessageSquare, Award, ArrowRight } from "lucide-react";
import { AIChatSession } from "@/Services/AiModel";
import { toast } from "sonner";

function InterviewPrepPanel() {
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ats"); // 'ats' or 'interview'
  const [showSettings, setShowSettings] = useState(false);
  const [localKey, setLocalKey] = useState(localStorage.getItem("gemini_api_key") || "");
  
  // ATS Check States
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState(null);

  // Mock Interview States
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

  const saveKey = () => {
    localStorage.setItem("gemini_api_key", localKey.trim());
    toast.success("Gemini API Key saved locally!");
    setShowSettings(false);
  };

  const analyzeATSFit = async () => {
    if (!jobDesc.trim()) {
      toast.error("Please enter a job description");
      return;
    }
    setAtsLoading(true);
    setAtsResult(null);

    const prompt = `
    You are an elite Tech Recruiter and Resume Coach. Analyze the alignment of this candidate's resume with the target job description.
    
    Candidate Resume Details:
    - Name: ${resumeInfo?.firstName} ${resumeInfo?.lastName}
    - Role: ${resumeInfo?.jobTitle}
    - Education: ${JSON.stringify(resumeInfo?.education)}
    - Experience: ${JSON.stringify(resumeInfo?.experience)}
    - Projects: ${JSON.stringify(resumeInfo?.projects)}
    - Skills: ${JSON.stringify(resumeInfo?.skills)}
    
    Target Job Title: "${jobTitle || resumeInfo?.jobTitle || "Software Engineer"}"
    Target Job Description: "${jobDesc}"
    
    Provide an ATS match analysis in JSON format with the following keys:
    1. "matchPercentage": A number between 0 and 100 representing the match level.
    2. "summary": A brief 2-3 sentence overview of the candidate's fit.
    3. "missingKeywords": An array of important technical keywords or skills mentioned in the job description that are missing or weak in the resume.
    4. "weakBulletPoints": An array of objects, each containing:
       - "original": A weak bullet point from the candidate's resume.
       - "suggestion": A revised, high-impact version tailored to the job description following the STAR/XYZ method.
    
    Output strictly as a JSON object matching this schema. Do not write markdown annotations.
    `;

    try {
      const result = await AIChatSession.sendMessage(prompt);
      const rawText = result.response.text();
      const cleanText = rawText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleanText);
      setAtsResult(parsed);
      toast.success("Resume analysis complete!");
    } catch (err) {
      console.error(err);
      toast.error("Error analyzing resume: " + err.message);
    } finally {
      setAtsLoading(false);
    }
  };

  const generateMockQuestions = async () => {
    setQuestionsLoading(true);
    setInterviewData(null);
    setSelectedQuestionIndex(null);

    const prompt = `
    You are an expert technical interviewer at a top-tier tech company.
    Based on the candidate's resume details, generate 5 challenging interview questions (3 technical and 2 behavioral) that they are highly likely to face in a real interview.
    
    Candidate Resume Details:
    - Role: ${resumeInfo?.jobTitle}
    - Education: ${JSON.stringify(resumeInfo?.education)}
    - Experience: ${JSON.stringify(resumeInfo?.experience)}
    - Projects: ${JSON.stringify(resumeInfo?.projects)}
    - Skills: ${JSON.stringify(resumeInfo?.skills)}
    
    Provide your output in JSON format with a single key "questions" mapping to an array of 5 objects. Each object must have:
    1. "question": The interview question.
    2. "type": Either "Technical" or "Behavioral".
    3. "intent": What the interviewer is evaluating.
    4. "starAnswer": An object detailing the ideal response blueprint:
       - "situation": The context/situation from the candidate's resume to leverage.
       - "task": The objective/task.
       - "action": Specific technical action steps the candidate should emphasize.
       - "result": The quantifiable or high-impact result to mention.
       
    Output strictly as a JSON object matching this schema. Do not write markdown annotations.
    `;

    try {
      const result = await AIChatSession.sendMessage(prompt);
      const rawText = result.response.text();
      const cleanText = rawText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleanText);
      setInterviewData(parsed.questions);
      toast.success("Mock interview questions generated!");
    } catch (err) {
      console.error(err);
      toast.error("Error generating questions: " + err.message);
    } finally {
      setQuestionsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Sparkles Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all no-print"
      >
        <Sparkles className="h-5 w-5 animate-pulse" />
        <span className="font-semibold text-sm">AI Interview Coach</span>
      </button>

      {/* Slide-out Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end no-print">
          {/* Backdrop Blur overlay */}
          <div 
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl text-slate-100 flex flex-col z-10 transition-transform duration-300">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h2 className="font-bold text-lg text-white">Interview Readiness Coach</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>

            {/* API Key settings collapsible */}
            <div className="bg-slate-950/80 border-b border-slate-800 p-3 text-xs flex flex-col gap-2">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowSettings(!showSettings)}>
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  🔑 Gemini API Key Status: {localStorage.getItem("gemini_api_key") ? <span className="text-green-400 font-bold">Configured</span> : <span className="text-red-400 font-bold">Missing</span>}
                </span>
                <span className="text-indigo-400 hover:text-indigo-300 font-medium">
                  {showSettings ? "Hide Settings" : "Configure"}
                </span>
              </div>
              
              {showSettings && (
                <div className="flex gap-2 items-center mt-2">
                  <Input
                    type="password"
                    value={localKey}
                    placeholder="Enter your Gemini API Key..."
                    className="bg-slate-900 border-slate-700 text-white text-xs h-8 flex-1"
                    onChange={(e) => setLocalKey(e.target.value)}
                  />
                  <Button size="sm" onClick={saveKey} className="bg-indigo-600 hover:bg-indigo-700 text-xs h-8">
                    Save Key
                  </Button>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/50">
              <button
                onClick={() => setActiveTab("ats")}
                className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "ats" 
                    ? "border-indigo-500 text-indigo-400 bg-slate-900/50" 
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                ATS & Keyword Optimization
              </button>
              <button
                onClick={() => setActiveTab("interview")}
                className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "interview" 
                    ? "border-indigo-500 text-indigo-400 bg-slate-900/50" 
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Mock Interview Prep
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {activeTab === "ats" ? (
                // ATS ANALYSIS TAB
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Target Job Title</label>
                    <Input
                      className="bg-slate-850 border-slate-700 text-white w-full"
                      value={jobTitle}
                      placeholder="e.g. Full Stack Engineer"
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Paste Job Description</label>
                    <Textarea
                      rows={5}
                      className="bg-slate-850 border-slate-700 text-white w-full"
                      value={jobDesc}
                      placeholder="Paste the target job description here..."
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={analyzeATSFit}
                    disabled={atsLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 flex items-center justify-center gap-2"
                  >
                    {atsLoading ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Analyze Alignment <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>

                  {/* ATS RESULTS DISPLAY */}
                  {atsResult && (
                    <div className="mt-6 space-y-4 border-t border-slate-850 pt-4">
                      {/* Score Badge */}
                      <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <div>
                          <h4 className="font-semibold text-slate-200">ATS Match Rating</h4>
                          <p className="text-xs text-slate-400">Based on keyword density & alignment</p>
                        </div>
                        <div className={`h-16 w-16 rounded-full border-4 flex items-center justify-center text-xl font-bold ${
                          atsResult.matchPercentage >= 80 
                            ? "border-green-500 text-green-400 bg-green-500/10" 
                            : atsResult.matchPercentage >= 50 
                            ? "border-yellow-500 text-yellow-400 bg-yellow-500/10" 
                            : "border-red-500 text-red-400 bg-red-500/10"
                        }`}>
                          {atsResult.matchPercentage}%
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="bg-slate-850/50 p-3 rounded-lg border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-300 uppercase mb-1">Fit Assessment</h4>
                        <p className="text-xs leading-relaxed text-slate-300">{atsResult.summary}</p>
                      </div>

                      {/* Missing Keywords */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                          Missing / Weak Keywords
                        </h4>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {atsResult.missingKeywords?.map((kw, i) => (
                            <span key={i} className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs border border-slate-700">
                              {kw}
                            </span>
                          ))}
                          {(!atsResult.missingKeywords || atsResult.missingKeywords.length === 0) && (
                            <p className="text-xs text-slate-400">None! Great keyword alignment.</p>
                          )}
                        </div>
                      </div>

                      {/* Suggestions */}
                      {atsResult.weakBulletPoints && atsResult.weakBulletPoints.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            Tailoring Bullet Suggestions
                          </h4>
                          <div className="space-y-3">
                            {atsResult.weakBulletPoints.map((bp, i) => (
                              <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs space-y-2">
                                <div>
                                  <span className="text-red-400 font-medium">Original:</span>
                                  <p className="text-slate-400 italic mt-0.5">"{bp.original}"</p>
                                </div>
                                <div className="border-t border-slate-850 pt-2">
                                  <span className="text-green-400 font-medium">STAR/XYZ Suggested Draft:</span>
                                  <p className="text-slate-200 font-medium mt-0.5">"{bp.suggestion}"</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // MOCK INTERVIEW TAB
                <div className="space-y-4">
                  <p className="text-xs text-slate-400 leading-normal">
                    Generate mock technical and behavioral questions tailored directly to your projects, achievements, and work experience. Practice using the STAR answer blueprint!
                  </p>
                  
                  <Button
                    onClick={generateMockQuestions}
                    disabled={questionsLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 flex items-center justify-center gap-2"
                  >
                    {questionsLoading ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Generate Mock Interview Questions <MessageSquare className="h-4 w-4" /></>
                    )}
                  </Button>

                  {/* QUESTIONS DISPLAY */}
                  {interviewData && (
                    <div className="space-y-3 pt-4 border-t border-slate-850">
                      <h3 className="text-xs font-bold text-slate-400 uppercase">Generated Questions</h3>
                      
                      {interviewData.map((q, i) => (
                        <div 
                          key={i} 
                          className="bg-slate-950 rounded-xl border border-slate-850 overflow-hidden"
                        >
                          {/* Question header */}
                          <div 
                            onClick={() => setSelectedQuestionIndex(selectedQuestionIndex === i ? null : i)}
                            className="p-4 cursor-pointer flex justify-between items-center hover:bg-slate-900/50"
                          >
                            <div className="space-y-1 pr-4">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                q.type === "Technical" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              }`}>
                                {q.type}
                              </span>
                              <h4 className="text-sm font-semibold text-slate-200 mt-1 leading-snug">
                                {q.question}
                              </h4>
                            </div>
                            <span className="text-slate-500 font-bold text-lg">
                              {selectedQuestionIndex === i ? "−" : "+"}
                            </span>
                          </div>

                          {/* Collapsible Answer details */}
                          {selectedQuestionIndex === i && (
                            <div className="p-4 border-t border-slate-850 bg-slate-900/30 text-xs space-y-3">
                              <div>
                                <span className="text-slate-400 font-bold uppercase text-[10px]">Evaluation Intent</span>
                                <p className="text-slate-300 mt-0.5">{q.intent}</p>
                              </div>

                              <div className="space-y-2 border-t border-slate-850 pt-2">
                                <span className="text-indigo-400 font-bold uppercase text-[10px] flex items-center gap-1">
                                  <Award className="h-3.5 w-3.5" />
                                  STAR Answer Blueprint
                                </span>
                                <div className="space-y-1.5 pl-1.5 border-l-2 border-slate-800">
                                  <p className="text-slate-300">
                                    <strong className="text-slate-400">Situation: </strong> {q.starAnswer.situation}
                                  </p>
                                  <p className="text-slate-300">
                                    <strong className="text-slate-400">Task: </strong> {q.starAnswer.task}
                                  </p>
                                  <p className="text-slate-300">
                                    <strong className="text-slate-400">Action: </strong> {q.starAnswer.action}
                                  </p>
                                  <p className="text-slate-300">
                                    <strong className="text-slate-400">Result: </strong> {q.starAnswer.result}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InterviewPrepPanel;
