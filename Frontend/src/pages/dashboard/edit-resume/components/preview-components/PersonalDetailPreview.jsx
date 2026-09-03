import React from "react";

function PersonalDetailPreview({ resumeInfo }) {
  const phone = resumeInfo?.phone && resumeInfo.phone !== "undefined" && resumeInfo.phone !== "null" ? resumeInfo.phone : "";
  const email = resumeInfo?.email && resumeInfo.email !== "undefined" && resumeInfo.email !== "null" ? resumeInfo.email : "";
  const linkedin = resumeInfo?.linkedin && resumeInfo.linkedin !== "undefined" && resumeInfo.linkedin !== "null" ? resumeInfo.linkedin : "";
  const github = resumeInfo?.github && resumeInfo.github !== "undefined" && resumeInfo.github !== "null" ? resumeInfo.github : "";

  return (
    <div className="text-black font-lora font-serif">
      <h1 className="text-2xl sm:text-3xl text-center font-bold tracking-wide mt-0.5">
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h1>
      <div className="text-center text-[9.5pt] mt-1 mb-2.5 flex flex-wrap justify-center gap-1.5 items-center text-black">
        {phone && <span>{phone}</span>}
        {phone && (email || linkedin || github) && <span className="mx-1 text-gray-500">|</span>}
        
        {email && (
          <a href={`mailto:${email}`} className="hover:underline">
            {email}
          </a>
        )}
        {email && (linkedin || github) && <span className="mx-1 text-gray-500">|</span>}
        
        {linkedin && (
          <a href={`https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {linkedin.replace(/^(https?:\/\/)?(www\.)?/, "")}
          </a>
        )}
        {linkedin && github && <span className="mx-1 text-gray-500">|</span>}
        
        {github && (
          <a href={`https://${github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {github.replace(/^(https?:\/\/)?(www\.)?/, "")}
          </a>
        )}
      </div>
    </div>
  );
}

export default PersonalDetailPreview;
