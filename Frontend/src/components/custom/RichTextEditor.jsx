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

function RichTextEditor({ onRichTextEditorChange, index, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.experience[index]?.workSummary || ""
  );
  const [draftInput, setDraftInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    if (!resumeInfo?.experience[index]?.title) {
      toast.error("Please add Position Title first");
      return;
    }
    if (!draftInput.trim()) {
      toast.error("Please write a rough summary of your duties/achievements so the AI can optimize your actual work!");
      return;
    }
    setLoading(true);

    const prompt = `
    You are an expert resume writer and recruiter. 
    Refine, rewrite, and optimize the following rough work experience draft for a candidate working as a "${resumeInfo.experience[index].title}" at "${resumeInfo.experience[index].companyName || 'the company'}".
    
    User's Rough Draft: "${draftInput.trim()}"
    
    Requirements for the refined bullet points:
    1. Generate exactly 2 to 3 concise, high-impact bullet points designed specifically for a tight 1-page resume layout.
    2. Follow Google's XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]".
    3. Start each bullet point with a strong, action-oriented verb (e.g. Spearheaded, Engineered, Automated, Optimized, Orchestrated).
    4. Focus on technical implementations, tools, languages, and methodologies used with realistic metrics.
    5. Keep each bullet point to 1-2 lines maximum.
    6. Output MUST be an array of HTML list items (<li>...</li>). Do NOT wrap the array in a <ul> tag.
    
    Format the response strictly as a JSON object with a single key "experience":
    {
      "experience": [
        "<li>Engineered a highly responsive web application using React, reducing load time by 30%...</li>",
        "<li>Optimized database queries in MongoDB, decreasing API response latency by 45%...</li>"
      ]
    }
    `;

    try {
      const result = await AIChatSession.sendMessage(prompt);
      const rawText = result.response.text();
      const cleanText = rawText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const resp = JSON.parse(cleanText);
      
      if (resp.experience && resp.experience.length > 0) {
        const formattedBullets = `<ul>${resp.experience.join("")}</ul>`;
        setValue(formattedBullets);
        toast.success("Experience bullets refined successfully");
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
          What did you do during this internship?
        </label>
        <textarea
          rows={3}
          value={draftInput}
          onChange={(e) => setDraftInput(e.target.value)}
          placeholder="Ex: I wrote backend REST APIs in Node.js/Express, optimized MongoDB indexes, and created clean dashboard components using React."
          className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-black bg-slate-50/50 focus:bg-white transition-all outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-between my-2 items-center">
        <label className="text-xs font-bold text-gray-600 uppercase">Optimized Summary</label>
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

export default RichTextEditor;
