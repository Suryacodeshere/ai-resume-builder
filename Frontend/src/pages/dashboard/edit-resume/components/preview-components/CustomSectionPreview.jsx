import React from "react";

function CustomSectionPreview({ resumeInfo }) {
  const sectionTitle = resumeInfo?.customSection?.sectionTitle;
  const summary = resumeInfo?.customSection?.summary;

  if (!sectionTitle || !summary) return null;

  return (
    <div className="my-4 font-serif text-black">
      {/* Title with bottom underline line matching LaTeX style */}
      <h2 className="text-[11pt] font-bold tracking-wide uppercase text-black border-b border-black pb-0.5">
        {sectionTitle}
      </h2>
      
      {/* Bullet descriptions */}
      <div 
        className="text-[10pt] mt-2 experience-bullets leading-relaxed text-black"
        dangerouslySetInnerHTML={{ __html: summary }}
      />
    </div>
  );
}

export default CustomSectionPreview;
