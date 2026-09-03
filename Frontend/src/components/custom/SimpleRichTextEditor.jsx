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

function SimpleRichTextEditor({ index, onRichTextEditorChange, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.projects[index]?.projectSummary || ""
  );
  const [draftInput, setDraftInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    if (
      !resumeInfo?.projects[index]?.projectName ||
      !resumeInfo?.projects[index]?.techStack
    ) {
      toast.error("Please add Project Name and Tech Stack first");
      return;
    }
    if (!draftInput.trim()) {
      toast.error("Please write a rough summary of your project details/features so the AI can optimize your actual work!");
      return;
    }
    setLoading(true);

    const prompt = `
    You are an expert resume writer and recruiter. 
    Refine, rewrite, and optimize the following rough project details draft for a project named "${resumeInfo.projects[index].projectName}" built using "${resumeInfo.projects[index].techStack}".
    
    User's Rough Draft: "${draftInput.trim()}"
    
    Requirements for the refined bullet points:
    1. Generate exactly 2 concise, high-impact bullet points designed for a strict 1-page resume format.
    2. Follow Google's XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]".
    3. Start each bullet point with a strong, action-oriented verb (e.g. Architected, Engineered, Developed, Integrated, Optimized).
    4. Focus on the technical implementation details of how the tech stack was utilized with realistic metrics.
    5. Output MUST be an array of HTML list items (<li>...</li>). Do NOT wrap the array in a <ul> tag.
    
    Format the response strictly as a JSON object with a single key "projectSummary":
    {
      "projectSummary": [
        "<li>Engineered a real-time collaborative platform using WebSockets, reducing payload delivery time by 15%...</li>",
        "<li>Designed and built a robust authentication flow using bcrypt and JWT, securing over 500+ daily sessions...</li>"
      ]
    }
    `;

    try {
      const result = await AIChatSession.sendMessage(prompt);
      const rawText = result.response.text();
      const cleanText = rawText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const resp = JSON.parse(cleanText);
      
      if (resp.projectSummary && resp.projectSummary.length > 0) {
        const formattedBullets = `<ul>${resp.projectSummary.join("")}</ul>`;
        setValue(formattedBullets);
        toast.success("Project summary refined successfully");
      } else {
        toast.error("No suggestions returned");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("Error generating summary: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="my-2 space-y-1">
        <label className="text-xs font-bold text-gray-600 uppercase">
          What is this project about? (Features, contributions)
        </label>
        <textarea
          rows={3}
          value={draftInput}
          onChange={(e) => setDraftInput(e.target.value)}
          placeholder="Ex: I built a web app that tracks user habits, used React and Tailwind for UI, Node.js for backend, and implemented custom chart dashboards."
          className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-black bg-slate-50/50 focus:bg-white transition-all outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-between my-2 items-center">
        <label className="text-xs font-bold text-gray-600 uppercase">Optimized Project Summary</label>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={GenerateSummaryFromAI}
          disabled={loading}
          className="flex gap-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Optimize with AI
            </>
          )}
        </Button>
      </div>

      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e.target.value);
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
