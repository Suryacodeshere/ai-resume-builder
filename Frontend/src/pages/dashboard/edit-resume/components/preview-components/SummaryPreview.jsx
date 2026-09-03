import React from "react";

function SummaryPreview({ resumeInfo }) {
  if (!resumeInfo?.summary) return null;

  return (
    <div className="my-2.5 text-black font-lora">
      <h2 className="text-sm font-bold tracking-wide uppercase">
        Summary
      </h2>
      <hr className="border-t-[1px] border-black my-0.5" />
      <p className="text-xs leading-normal text-gray-900 mt-0.5">
        {resumeInfo?.summary}
      </p>
    </div>
  );
}

export default SummaryPreview;