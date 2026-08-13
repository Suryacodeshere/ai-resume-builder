import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import { LoaderCircle, Sparkles, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";
import { AIChatSession } from "@/Services/AiModel";
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

function CustomSection({ resumeInfo, enanbledNext, enanbledPrev }) {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Custom section states
  const [enabled, setEnabled] = useState(
    !!(resumeInfo?.customSection?.sectionTitle || resumeInfo?.customSection?.summary)
  );
  const [sectionTitle, setSectionTitle] = useState(
    resumeInfo?.customSection?.sectionTitle || ""
  );
  const [summaryValue, setSummaryValue] = useState(
    resumeInfo?.customSection?.summary || ""
  );
  const [draftInput, setDraftInput] = useState("");

  // Sync state to Redux when inputs change
  useEffect(() => {
    dispatch(
      addResumeData({
        ...resumeInfo,
        customSection: enabled ? { sectionTitle, summary: summaryValue } : null,
      })
    );
  }, [enabled, sectionTitle, summaryValue]);

  const handleToggle = () => {
    setEnabled(!enabled);
    if (!enabled) {
      // Set some initial defaults when enabling
      setSectionTitle("Additional Information");
    }
  };

  const handleAiOptimize = async () => {
    if (!sectionTitle.trim()) {
      toast.error("Please add a Section Title first (e.g. Languages, Publications)");
      return;
    }
    if (!draftInput.trim()) {
      toast.error("Please write a rough summary first so the AI can optimize your actual work!");
      return;
    }

    setAiLoading(true);
    const prompt = `
    You are an expert resume writer. 
    Refine, rewrite, and optimize the following rough draft details for a custom resume section titled "${sectionTitle.trim()}".
    
    User's Rough Draft: "${draftInput.trim()}"
    
    Requirements for the bullet points:
    1. Start each bullet point with strong, action-oriented verbs or professional phrasing suited to the section type.
    2. Focus on clear, high-impact phrasing.
    3. Output MUST be an array of HTML list items (<li>...</li>). Do NOT wrap the array in a <ul> tag.
    
    Format the response strictly as a JSON object with a single key "bullets":
    {
      "bullets": [
        "<li>List item 1...</li>",
        "<li>List item 2...</li>"
      ]
    }
    `;

    try {
      const result = await AIChatSession.sendMessage(prompt);
      const rawText = result.response.text();
      const cleanText = rawText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const resp = JSON.parse(cleanText);
      
      if (resp.bullets && resp.bullets.length > 0) {
        const formattedBullets = `<ul>${resp.bullets.join("")}</ul>`;
        setSummaryValue(formattedBullets);
        toast.success("Section optimized successfully!");
      } else {
        toast.error("No suggestions returned");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error optimizing with AI: " + error.message);
    } finally {
      setAiLoading(false);
    }
  };

  const onSave = async () => {
    setLoading(true);
    enanbledNext(false);
    enanbledPrev(false);

    const data = {
      data: {
        customSection: enabled ? { sectionTitle, summary: summaryValue } : null,
      },
    };

    try {
      await updateThisResume(resume_id, data);
      toast.success("Resume updated successfully!");
    } catch (error) {
      toast.error("Error updating resume: " + error.message);
    } finally {
      enanbledNext(true);
      enanbledPrev(true);
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="font-bold text-lg">Custom Section</h2>
          <p className="text-sm text-gray-400">Add any section of your choice (e.g. Publications, Extracurricular, Languages)</p>
        </div>
        <Button
          type="button"
          variant={enabled ? "destructive" : "outline"}
          onClick={handleToggle}
          className="flex gap-2"
        >
          {enabled ? (
            <>
              <Trash className="h-4 w-4" /> Remove Section
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add Custom Section
            </>
          )}
        </Button>
      </div>

      {enabled ? (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase">Section Title</label>
            <Input
              value={sectionTitle}
              placeholder="Ex: Publications, Languages, Extracurricular Activities"
              onChange={(e) => setSectionTitle(e.target.value)}
              className="text-black rounded-xl"
            />
          </div>

          <div className="my-2 space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase">
              What details do you want to add? (AI will optimize it)
            </label>
            <textarea
              rows={3}
              value={draftInput}
              onChange={(e) => setDraftInput(e.target.value)}
              placeholder="Ex: I spoke at React Conf about performance, wrote 2 research papers on AI safety, fluent in English and German."
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-black bg-slate-50/50 focus:bg-white transition-all outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-between my-2 items-center">
            <label className="text-xs font-bold text-gray-600 uppercase">Optimized Section Summary</label>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleAiOptimize}
              disabled={aiLoading}
              className="flex gap-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
            >
              {aiLoading ? (
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
              value={summaryValue}
              onChange={(e) => {
                setSummaryValue(e.target.value);
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

          <div className="flex justify-end pt-4">
            <Button onClick={onSave} disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 text-center text-gray-400 font-medium text-sm mt-4">
          Click the "Add Custom Section" button above if you would like to include a custom category on your resume.
        </div>
      )}
    </div>
  );
}

export default CustomSection;
