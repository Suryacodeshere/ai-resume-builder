import React from "react";

function EducationalPreview({ resumeInfo }) {
  if (!resumeInfo?.education || resumeInfo.education.length === 0) return null;

  return (
    <div className="my-4 text-black font-lora">
      <h2 className="text-sm font-bold tracking-wide uppercase">
        Education
      </h2>
      <hr className="border-t-[1px] border-black my-1" />

      {resumeInfo.education.map((education, index) => (
        <div key={index} className="my-2">
          <div className="flex justify-between items-baseline text-xs font-semibold">
            <span>{education.universityName}</span>
            <span className="font-normal whitespace-nowrap pl-4">
              {education?.startDate && education?.endDate 
                ? `${education.startDate} – ${education.endDate}`
                : education?.startDate || education?.endDate || ""}
            </span>
          </div>
          <div className="flex justify-between items-baseline text-xs mt-0.5">
            <span className="italic">
              {education?.degree}
              {education?.degree && education?.major ? " in " : null}
              {education?.major}
            </span>
            {education?.grade && (
              <span className="font-medium whitespace-nowrap pl-4">
                {education?.gradeType ? `${education.gradeType}: ` : "CGPA: "}
                {education.grade}
              </span>
            )}
          </div>
          {education?.description && (
            <p className="text-xs my-1 leading-normal text-gray-800">{education.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default EducationalPreview;
