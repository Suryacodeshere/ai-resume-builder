import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PersonalDetailPreview from "./preview-components/PersonalDetailPreview";
import SummaryPreview from "./preview-components/SummaryPreview";
import ExperiencePreview from "./preview-components/ExperiencePreview";
import EducationalPreview from "./preview-components/EducationalPreview";
import SkillsPreview from "./preview-components/SkillsPreview";
import ProjectPreview from "./preview-components/ProjectPreview";
import CertificationsPreview from "./preview-components/CertificationsPreview";
import AchievementsPreview from "./preview-components/AchievementsPreview";
import CustomSectionPreview from "./preview-components/CustomSectionPreview";

function PreviewPage() {
  const resumeData = useSelector((state) => state.editResume.resumeData);
  useEffect(() => {
    console.log("PreviewPage rendered ");
  }, [resumeData]);

  return (
    <div
      className="resume-preview-container shadow-md h-full px-8 py-10 bg-white font-lora print:shadow-none print:m-0 print:min-h-0 print:h-auto"
      style={{
        fontFamily: "'Lora', Georgia, serif",
        minHeight: "297mm",
        boxSizing: "border-box"
      }}
    >
      <PersonalDetailPreview resumeInfo={resumeData} />
      {resumeData?.summary && <SummaryPreview resumeInfo={resumeData} />}
      <EducationalPreview resumeInfo={resumeData} />
      <ExperiencePreview resumeInfo={resumeData} />
      <ProjectPreview resumeInfo={resumeData} />
      <SkillsPreview resumeInfo={resumeData} />
      <CertificationsPreview resumeInfo={resumeData} />
      <AchievementsPreview resumeInfo={resumeData} />
      <CustomSectionPreview resumeInfo={resumeData} />
    </div>
  );
}

export default PreviewPage;
