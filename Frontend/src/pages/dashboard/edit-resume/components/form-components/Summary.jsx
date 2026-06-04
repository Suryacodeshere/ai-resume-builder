import React, { useState } from "react";
import { Sparkles, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";
import { updateThisResume } from "@/Services/resumeAPI";

const prompt =
  "Job Title: {jobTitle} , Depends on job title give me a list of summaries for 3 experience levels: Fresher, Mid Level, and Senior. Provide the response as a direct JSON array of objects, where each object contains the fields 'summary' (3-4 lines) and 'experience_level'. Do not wrap the array in any parent object.";
function Summary({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); // Declare the undeclared variable using useState
  const [summary, setSummary] = useState(resumeInfo?.summary || ""); // Declare the undeclared variable using useState
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState(null); // Declare the undeclared variable using useState
  const { resume_id } = useParams();

  const handleInputChange = (e) => {
    enanbledNext(false);
    enanbledPrev(false);
    dispatch(
      addResumeData({
        ...resumeInfo,
        [e.target.name]: e.target.value,
      })
    );
    setSummary(e.target.value);
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Started Saving Summary");
    const data = {
      data: { summary },
    };
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then((data) => {
          toast("Resume Updated", "success");
        })
        .catch((error) => {
          toast("Error updating resume", `${error.message}`);
        })
        .finally(() => {
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  }; // Declare the undeclared variable using useState

  const setSummaryText = (summary) => {
    dispatch(
      addResumeData({
        ...resumeInfo,
        summary: summary,
      })
    );
    setSummary(summary);
  };

  const GenerateSummaryFromAI = async () => {
    setLoading(true);
    console.log("Generate Summary From AI for", resumeInfo?.jobTitle);
    if (!resumeInfo?.jobTitle) {
      toast("Please Add Job Title");
      setLoading(false);
      return;
    }
    const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.jobTitle);
    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      const rawText = result.response.text();
      const cleanText = rawText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleanText);
      
      let list = [];
      if (Array.isArray(parsed)) {
        list = parsed;
      } else if (parsed && typeof parsed === "object") {
        // If it's wrapped in an object with a key like "summaries", "levels", etc.
        for (const key in parsed) {
          if (Array.isArray(parsed[key])) {
            list = parsed[key];
            break;
          }
        }
        // If it's a key-value object of experience levels
        if (list.length === 0) {
          for (const key in parsed) {
            if (typeof parsed[key] === "object" && parsed[key].summary) {
              list.push({
                experience_level: key,
                summary: parsed[key].summary
              });
            } else if (typeof parsed[key] === "string") {
              list.push({
                experience_level: key,
                summary: parsed[key]
              });
            }
          }
        }
      }

      setAiGenerateSummeryList(list);
      toast("Summary Generated", "success");
    } catch (error) {
      console.log(error);
      toast("Error generating summary", `${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add Summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summary</label>
            <Button
              variant="outline"
              onClick={() => GenerateSummaryFromAI()}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
            >
              <Sparkles className="h-4 w-4" /> Generate from AI
            </Button>
          </div>
          <Textarea
            name="summary"
            className="mt-5"
            required
            value={summary ? summary : resumeInfo?.summary}
            onChange={handleInputChange}
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList && (
        <div className="my-5">
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedSummeryList?.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                enanbledNext(false);
                enanbledPrev(false);
                setSummaryText(item?.summary);
              }}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer"
            >
              <h2 className="font-bold my-1 text-primary">
                Level: {item?.experience_level}
              </h2>
              <p>{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
