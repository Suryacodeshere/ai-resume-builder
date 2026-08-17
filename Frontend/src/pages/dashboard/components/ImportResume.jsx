import React, { useState } from "react";
import { Upload, Loader, FileText, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createNewResume, updateThisResume } from "@/Services/resumeAPI";
import { AIChatSession } from "@/Services/AiModel";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function ImportResume({ refreshData }) {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [useTextMode, setUseTextMode] = useState(false);
  const Navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImport = async () => {
    if (!resumetitle.trim()) {
      toast.error("Please add a title to your resume");
      return;
    }
    if (!file && !rawText.trim()) {
      toast.error("Please upload a file or paste your resume text");
      return;
    }

    setLoading(true);
    let fileBase64 = null;
    let mimeType = null;

    try {
      if (file && !useTextMode) {
        fileBase64 = await convertToBase64(file);
        mimeType = file.type;
        
        // Basic check for text extraction if it's not a PDF or if we want to fallback
        if (file.type === "text/plain") {
          const text = await file.text();
          setRawText(text);
          fileBase64 = null;
          mimeType = null;
        }
      }

      toast.info("AI is reading and parsing your resume. Please wait...");
      
      const aiResponse = await AIChatSession.parseResume(fileBase64, mimeType, rawText);
      const rawTextResponse = aiResponse.response.text();
      
      // Clean JSON string
      const cleanJsonText = rawTextResponse.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const parsedResumeData = JSON.parse(cleanJsonText);

      // 1. Create blank resume
      const createData = {
        data: {
          title: resumetitle,
          themeColor: "#000000",
        },
      };

      const res = await createNewResume(createData);
      const newResumeId = res.data.resume._id;

      // 2. Load the parsed details
      await updateThisResume(newResumeId, { data: parsedResumeData });

      toast.success("Resume imported and formatted successfully!");
      setOpenDialog(false);
      setFile(null);
      setRawText("");
      setResumetitle("");
      
      if (refreshData) refreshData();
      Navigate(`/dashboard/edit-resume/${newResumeId}`);

    } catch (error) {
      console.error("Error importing resume:", error);
      toast.error(error.message || "Failed to parse resume. Please check your AI API key or connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Upload/Import Card */}
      <div
        className="p-6 flex flex-col items-center justify-center border-2 border-dashed border-indigo-200/80 hover:border-indigo-500 bg-white/40 hover:bg-white/80 backdrop-blur-sm rounded-2xl h-[280px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5 group text-center gap-3 transform-gpu"
        onClick={() => setOpenDialog(true)}
      >
        <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300 shadow-sm">
          <Upload className="w-6 h-6" />
        </div>
        <span className="font-extrabold text-gray-700 text-sm mt-1">Upload & Import Resume</span>
        <span className="text-xs text-gray-400 px-4 leading-normal font-medium">
          Upload PDF/Text or paste raw text to automatically convert to standard LaTeX format.
        </span>
      </div>

      <Dialog open={isDialogOpen}>
        <DialogContent setOpenDialog={setOpenDialog} className="rounded-2xl border border-white/20 bg-white/95 backdrop-blur-md max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              Import Existing Resume
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400 font-medium my-2">
              Provide a title and upload your resume. AI will convert it to LaTeX styling.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase">Resume Title</label>
              <Input
                className="border-gray-200 focus:border-indigo-500 rounded-xl text-black"
                type="text"
                placeholder="Ex: My Imported Resume"
                value={resumetitle}
                onChange={(e) => setResumetitle(e.target.value.trimStart())}
              />
            </div>

            <div className="flex gap-4 border-b border-gray-100 pb-2">
              <button
                type="button"
                onClick={() => setUseTextMode(false)}
                className={`text-xs font-bold pb-1 border-b-2 transition-all ${
                  !useTextMode ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-400"
                }`}
              >
                Upload File (PDF)
              </button>
              <button
                type="button"
                onClick={() => setUseTextMode(true)}
                className={`text-xs font-bold pb-1 border-b-2 transition-all ${
                  useTextMode ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-400"
                }`}
              >
                Paste Resume Text
              </button>
            </div>

            {!useTextMode ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Select Resume File (PDF only)</label>
                <div className="flex items-center justify-center border border-dashed border-gray-200 hover:border-indigo-500 rounded-xl p-4 bg-gray-50/50 hover:bg-white/80 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <FileText className="h-8 w-8 text-gray-400 group-hover:text-indigo-500" />
                    <span className="text-xs font-semibold text-gray-600">
                      {file ? file.name : "Click to select a file (PDF < 2MB)"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Paste Resume / LinkedIn Profile Text</label>
                <Textarea
                  rows={6}
                  placeholder="Paste your raw resume details or LinkedIn text here..."
                  className="border-gray-200 focus:border-indigo-500 rounded-xl text-black text-xs"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="gap-2 flex justify-end pt-6 border-t border-gray-100">
            <Button variant="ghost" className="rounded-xl" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={loading || !resumetitle}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 font-semibold transition-all duration-200 flex gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin w-4 h-4" /> Converting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Transform
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImportResume;
