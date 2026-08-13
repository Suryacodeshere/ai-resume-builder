import React from "react";

function ProjectPreview({ resumeInfo }) {
  if (!resumeInfo?.projects || resumeInfo.projects.length === 0) return null;

  const getLinkUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <div className="my-4 text-black font-lora">
      <h2 className="text-sm font-bold tracking-wide uppercase">
        Projects
      </h2>
      <hr className="border-t-[1px] border-black my-1" />

      {resumeInfo.projects.map((project, index) => (
        <div key={index} className="my-2">
          <div className="flex justify-between items-baseline text-xs font-semibold">
            <span>
              {project?.projectName}
              {project?.projectName && project?.techStack ? " | " : ""}
              <span className="font-normal italic text-gray-800">{project?.techStack}</span>
            </span>
            <div className="flex gap-1.5 font-normal whitespace-nowrap pl-4 text-gray-700">
              {project.githubLink && (
                <a href={getLinkUrl(project.githubLink)} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium text-black">
                  GitHub
                </a>
              )}
              {project.githubLink && project.liveLink && <span>|</span>}
              {project.liveLink && (
                <a href={getLinkUrl(project.liveLink)} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium text-black">
                  Live Demo
                </a>
              )}
            </div>
          </div>
          <div
            className="text-[11px] mt-1 leading-normal experience-bullets list-outside"
            dangerouslySetInnerHTML={{ __html: project?.projectSummary }}
          />
        </div>
      ))}
    </div>
  );
}

export default ProjectPreview;
