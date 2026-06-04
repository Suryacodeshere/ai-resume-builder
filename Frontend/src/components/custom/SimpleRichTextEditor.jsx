import React, { useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { AIChatSession } from "@/Services/AiModel";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Sparkles, LoaderCircle } from "lucide-react";

const PROMPT = `Create a JSON object with the following fields:
"projectName": A string representing the project
"techStack":A string representing the project tech stack
"projectSummary": An array of strings, each representing a bullet point in html format describing relevant experience for the given project title and tech stack
projectName-"{projectName}"
techStack-"{techStack}"`;
function SimpleRichTextEditor({ index, onRichTextEditorChange, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.projects[index]?.projectSummary || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    if (
      !resumeInfo?.projects[index]?.projectName ||
      !resumeInfo?.projects[index]?.techStack
    ) {
      toast("Add Project Name and Tech Stack to generate summary");
      return;
    }
    setLoading(true);

    const prompt = PROMPT.replace(
      "{projectName}",
      resumeInfo?.projects[index]?.projectName
    ).replace("{techStack}", resumeInfo?.projects[index]?.techStack);
    console.log("Prompt", prompt);
    try {
      const result = await AIChatSession.sendMessage(prompt);
      const rawText = result.response.text();
      const cleanText = rawText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const resp = JSON.parse(cleanText);
      console.log("Response", resp);
      await setValue(resp.projectSummary?.join(""));
      toast("Summary generated successfully");
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast("Error generating summary: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(value);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default SimpleRichTextEditor;
