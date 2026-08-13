import React from "react";

function SkillsPreview({ resumeInfo }) {
  if (!resumeInfo?.skills || resumeInfo.skills.length === 0) return null;

  return (
    <div className="my-4 text-black font-lora">
      <h2 className="text-sm font-bold tracking-wide uppercase">
        Technical Skills
      </h2>
      <hr className="border-t-[1px] border-black my-1" />

      <div className="text-xs space-y-0.5">
        {resumeInfo.skills.map((skill, index) => {
          // Determine the skills display content. If skillsList exists, use it. Otherwise, show name.
          const categoryName = skill.name;
          const listText = skill.skillsList || (skill.rating ? `Level: ${skill.rating}/5` : "");
          
          if (!categoryName) return null;
          
          return (
            <div key={index} className="leading-relaxed">
              <span className="font-bold">{categoryName}: </span>
              <span>{listText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SkillsPreview;
