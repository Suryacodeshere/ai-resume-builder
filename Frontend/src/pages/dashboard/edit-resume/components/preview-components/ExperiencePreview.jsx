import React from "react";

function ExperiencePreview({ resumeInfo }) {
  if (!resumeInfo?.experience || resumeInfo.experience.length === 0) return null;

  return (
    <div className="my-4 text-black font-lora">
      <h2 className="text-sm font-bold tracking-wide uppercase">
        Experience
      </h2>
      <hr className="border-t-[1px] border-black my-1" />

      {resumeInfo.experience.map((experience, index) => (
        <div key={index} className="my-2">
          <div className="flex justify-between items-baseline text-xs font-semibold">
            <span>{experience?.title}</span>
            <span className="font-normal whitespace-nowrap pl-4">
              {experience?.startDate}
              {(experience?.startDate && (experience?.currentlyWorking || experience?.endDate)) ? " – " : ""}
              {experience?.currentlyWorking ? "Present" : experience?.endDate}
            </span>
          </div>
          <div className="flex justify-between items-baseline text-xs mt-0.5">
            <span className="italic">{experience?.companyName}</span>
            <span className="text-gray-800 whitespace-nowrap pl-4">
              {experience?.city}
              {experience?.city && experience?.state ? ", " : ""}
              {experience?.state}
            </span>
          </div>
          
          <div
            className="text-[11px] mt-1 leading-normal experience-bullets list-outside"
            dangerouslySetInnerHTML={{ __html: experience?.workSummary }}
          />
        </div>
      ))}
    </div>
  );
}

export default ExperiencePreview;
