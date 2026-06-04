import { FaEye, FaEdit, FaTrashAlt, FaBook, FaSpinner } from "react-icons/fa";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const gradients = [
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-emerald-400 via-teal-500 to-indigo-600",
  "from-purple-500 via-pink-500 to-rose-500",
  "from-blue-500 via-indigo-500 to-purple-600",
  "from-amber-400 via-orange-500 to-rose-500",
];

const getRandomGradient = () => {
  return gradients[Math.floor(Math.random() * gradients.length)];
};

function ResumeCard({ resume, refreshData }) {
  const [loading, setLoading] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const gradient = getRandomGradient();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    console.log("Delete Resume with ID", resume._id);
    try {
      await deleteThisResume(resume._id);
      toast("Resume deleted successfully");
    } catch (error) {
      console.error("Error deleting resume:", error.message);
      toast(error.message);
    } finally {
      setLoading(false);
      setOpenAlert(false);
      refreshData();
    }
  };

  return (
    <div className="group relative rounded-2xl border border-white/60 p-5 bg-white/45 hover:bg-white/85 backdrop-blur-sm shadow-md hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between h-[280px] hover:scale-[1.02] transform-gpu">
      {/* Decorative gradient top banner */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient} rounded-t-2xl`} />

      <div className="flex flex-col gap-3 pt-3">
        {/* Document Icon / Title */}
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}>
            <FaBook className="w-4 h-4" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-bold text-gray-800 text-base truncate group-hover:text-indigo-600 transition-colors">
              {resume.title}
            </h3>
            <p className="text-xs text-gray-400 font-medium">Modified recently</p>
          </div>
        </div>
      </div>

      {/* Mini resume template visual placeholder in the middle */}
      <div className="flex-1 flex flex-col justify-center gap-2 px-1 py-4 opacity-50 group-hover:opacity-75 transition-opacity">
        <div className="h-1.5 w-3/4 bg-gray-200 rounded-full" />
        <div className="h-1.5 w-1/2 bg-gray-200 rounded-full" />
        <div className="h-1.5 w-2/3 bg-gray-200 rounded-full" />
      </div>

      {/* Action Buttons bar */}
      <div className="flex items-center justify-between border-t border-gray-100/80 pt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
          className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg flex items-center gap-1.5 px-3 h-8"
        >
          <FaEdit className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">Edit</span>
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/view-resume/${resume._id}`)}
            className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-full p-2 h-8 w-8 flex items-center justify-center"
          >
            <FaEye className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpenAlert(true)}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50/50 rounded-full p-2 h-8 w-8 flex items-center justify-center"
          >
            <FaTrashAlt className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <AlertDialog open={openAlert} onClose={() => setOpenAlert(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              Resume and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
              {loading ? <FaSpinner className="animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ResumeCard;
