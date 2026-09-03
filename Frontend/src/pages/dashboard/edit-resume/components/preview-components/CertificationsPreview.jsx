import React from "react";

function CertificationsPreview({ resumeInfo }) {
  if (!resumeInfo?.certifications || resumeInfo.certifications.length === 0) return null;

  return (
    <div className="my-2.5 font-lora">
      <h2 className="text-sm font-bold tracking-wide uppercase text-black font-lora">
        Certifications
      </h2>
      <hr className="border-t-[1px] border-black my-0.5" />
      {resumeInfo.certifications.map((cert, index) => (
        <div key={index} className="flex justify-between items-baseline text-xs my-1 font-lora text-black">
          <span className="font-semibold">{cert.title}</span>
          <span className="text-gray-700 whitespace-nowrap pl-4">{cert.date}</span>
        </div>
      ))}
    </div>
  );
}

export default CertificationsPreview;
