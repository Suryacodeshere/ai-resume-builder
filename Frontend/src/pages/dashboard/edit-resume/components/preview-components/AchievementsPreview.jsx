import React from "react";

function AchievementsPreview({ resumeInfo }) {
  if (!resumeInfo?.achievements || resumeInfo.achievements.length === 0) return null;

  return (
    <div className="my-2.5 font-lora">
      <h2 className="text-sm font-bold tracking-wide uppercase text-black font-lora">
        Achievements
      </h2>
      <hr className="border-t-[1px] border-black my-0.5" />
      <ul className="list-disc pl-4 text-xs font-lora text-black">
        {resumeInfo.achievements.map((achievement, index) => (
          <li key={index} className="my-1 leading-normal">
            {achievement.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AchievementsPreview;
