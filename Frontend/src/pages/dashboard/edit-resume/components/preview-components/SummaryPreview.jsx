import React from "react";

function SummaryPreview({ resumeInfo }) {
  if (!resumeInfo?.summary) return null;

  return (
    <div className="my-4 text-black font-lora">
      <h2 className="text-sm font-bold tracking-wide uppercase">
        Summary
      </h2>
      <hr className="border-t-[1px] border-black my-1" />
      <p className="text-xs leading-normal text-gray-900 mt-1">
        {resumeInfo?.summary}
      </p>
    </div>
  );
}

export default SummaryPreview;