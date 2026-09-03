import React, { useEffect } from "react";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import { useParams } from "react-router-dom";
import { getResumeData } from "@/Services/resumeAPI";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";

export function EditResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    getResumeData(resume_id).then((data) => {
      dispatch(addResumeData(data.data));
    });
  }, [resume_id]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10 print:block print:p-0 print:m-0 print:gap-0">
      <div className="no-print">
        <ResumeForm />
      </div>
      <div className="print-area print:w-full print:p-0 print:m-0">
        <PreviewPage />
      </div>
    </div>
  );
}

export default EditResume;
