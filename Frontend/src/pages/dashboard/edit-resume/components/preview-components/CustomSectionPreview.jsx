import React from "react";

function CustomSectionPreview({ resumeInfo }) {
  const sectionTitle = resumeInfo?.customSection?.sectionTitle;
  const summary = resumeInfo?.customSection?.summary;

  if (!sectionTitle || !summary) return null;

  return (
    <div className="my-2.5 font-serif text-black">
      {/* Title with bottom underline line matching LaTeX style */}
      <h2 className="text-sm font-bold tracking-wide uppercase text-black">
        {sectionTitle}
      </h2>
      <hr className="border-t-[1px] border-black my-0.5" />
      
      {/* Bullet descriptions */}
      <div 
        className="text-[10pt] mt-2 experience-bullets leading-relaxed text-black"
        dangerouslySetInnerHTML={{ __html: summary }}
      />
    </div>
  );
}

export default CustomSectionPreview;
