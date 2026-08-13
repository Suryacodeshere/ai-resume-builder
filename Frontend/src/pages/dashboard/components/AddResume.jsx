import React from "react";
import { useState } from "react";
import { CopyPlus, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewResume } from "@/Services/resumeAPI";
import { useNavigate } from "react-router-dom";

function AddResume() {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const createResume = async () => {
    setLoading(true);
    if (resumetitle === "") {
      setLoading(false);
      return;
    }
    const data = {
      data: {
        title: resumetitle,
        themeColor: "#000000",
      },
    };
    console.log(`Creating Resume ${resumetitle}`);
    try {
      const res = await createNewResume(data);
      const resumeId = res.data.resume._id;
      Navigate(`/dashboard/edit-resume/${resumeId}`);
    } catch (error) {
      console.error("Error creating resume:", error);
    } finally {
      setLoading(false);
      setResumetitle("");
      setOpenDialog(false);
    }
  };
  return (
    <>
      <div
        className="p-6 flex flex-col items-center justify-center border-2 border-dashed border-indigo-200/80 hover:border-indigo-500 bg-white/40 hover:bg-white/80 backdrop-blur-sm rounded-2xl h-[280px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5 group text-center gap-3 transform-gpu"
        onClick={() => setOpenDialog(true)}
      >
        <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300 shadow-sm">
          <CopyPlus className="w-6 h-6" />
        </div>
        <span className="font-extrabold text-gray-700 text-sm mt-1">Create New Resume</span>
        <span className="text-xs text-gray-400 px-4 leading-normal font-medium">Start crafting your AI-optimized resume for your next dream role.</span>
      </div>
      <Dialog open={isDialogOpen}>
        <DialogContent setOpenDialog={setOpenDialog} className="rounded-2xl border border-white/20 bg-white/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Create a New Resume</DialogTitle>
            <DialogDescription className="text-sm text-gray-400 font-medium my-2">
              Add a title to get started on your resume.
              <Input
                className="my-4 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl text-black"
                type="text"
                placeholder="Ex: Senior Full Stack Developer"
                value={resumetitle}
                onChange={(e) => setResumetitle(e.target.value.trimStart())}
              />
            </DialogDescription>
            <div className="gap-2 flex justify-end pt-4">
              <Button variant="ghost" className="rounded-xl" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={createResume} 
                disabled={!resumetitle || loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 font-semibold transition-all duration-200"
              >
                {loading ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  "Create Resume"
                )}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddResume;
