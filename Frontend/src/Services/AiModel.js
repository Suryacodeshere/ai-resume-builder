import { GEMENI_API_KEY } from "../config/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
  return GEMENI_API_KEY || localStorage.getItem("gemini_api_key") || "";
};

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-3.5-flash"];

export const AIChatSession = {
  sendMessage: async (prompt) => {
    const key = getApiKey();
    if (!key || key.includes("Create Your Own")) {
      throw new Error("AI API Key is missing. Please enter your API key in the settings.");
    }
    
    const genAI = new GoogleGenerativeAI(key);
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    let lastError = null;
    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        return await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig,
        });
      } catch (err) {
        lastError = err;
        console.warn(`AI model ${modelName} failed, attempting next fallback model:`, err.message);
      }
    }
    throw lastError;
  },

  parseResume: async (fileBase64, mimeType, rawText) => {
    const key = getApiKey();
    if (!key || key.includes("Create Your Own")) {
      throw new Error("AI API Key is missing. Please configure it in the setting panel or environment variables.");
    }
    
    const genAI = new GoogleGenerativeAI(key);

    let parts = [];
    if (fileBase64) {
      parts.push({
        inlineData: {
          data: fileBase64,
          mimeType: mimeType
        }
      });
    }

    const promptText = `
    You are an elite ATS resume parser and professional summarizer. Extract the information from the attached resume document/text and parse its content into a structured JSON object matching this schema.

    CRITICAL REQUIREMENT:
    Your primary objective is to condense, summarize, and optimize large resumes so that the final resume strictly fits within a single 1-page LaTeX format while preserving 100% of the core meaning, context, technologies, metrics, and achievements.

    Schema:
    {
      "firstName": "String",
      "lastName": "String",
      "email": "String",
      "phone": "String",
      "address": "String (Location or city/state)",
      "linkedin": "String (LinkedIn URL)",
      "github": "String (GitHub URL)",
      "jobTitle": "String (Target role or title)",
      "summary": "String (A concise, punchy 2-3 line executive summary highlighting key strengths and tech stack)",
      "education": [
        {
          "universityName": "String",
          "degree": "String",
          "major": "String",
          "grade": "String (CGPA or GPA value)",
          "gradeType": "String (CGPA or GPA)",
          "startDate": "String (e.g. 2023)",
          "endDate": "String (e.g. 2027)"
        }
      ],
      "experience": [
        {
          "title": "String (Job title)",
          "companyName": "String",
          "city": "String",
          "state": "String",
          "startDate": "String",
          "endDate": "String",
          "currentlyWorking": "String ('true'/'false')",
          "workSummary": "String (HTML bullet points wrapped in <ul> and <li> tags. Condense verbose descriptions into exactly 2 to 3 concise, high-impact bullet points following Google's XYZ formula: Accomplished [X], measured by [Y], by doing [Z]. Retain all metrics and tech stack while removing fluff.)"
        }
      ],
      "projects": [
        {
          "projectName": "String",
          "techStack": "String (Comma-separated tools/languages)",
          "githubLink": "String (GitHub Link)",
          "liveLink": "String (Live Demo Link)",
          "projectSummary": "String (HTML bullet points wrapped in <ul> and <li> tags. Exactly 2 compact, impactful bullet points detailing architecture and results.)"
        }
      ],
      "skills": [
        {
          "name": "String (Category, e.g. Languages, Frameworks & Libraries, Tools & Cloud)",
          "skillsList": "String (Comma-separated list of skills in this category)"
        }
      ],
      "certifications": [
        {
          "title": "String (Credential name - Issuer)",
          "date": "String (e.g. Apr 2026)"
        }
      ],
      "achievements": [
        {
          "description": "String (Single concise bullet point describing achievement or award)"
        }
      ],
      "customSection": {
        "sectionTitle": "String (Title of any custom or secondary section present in the resume, e.g. 'Leadership & Community', 'Community & Mentorship', 'Volunteering', 'Positions of Responsibility', 'Extracurricular Activities', 'Publications')",
        "summary": "String (HTML bullet points wrapped in <ul> and <li> tags detailing the roles, mentorship, community contributions, or activities with dates and impact)"
      }
    }
    
    Current resume raw text (use if file upload is missing): "${rawText || ""}"
    
    CRITICAL EXTRACTION RULES:
    1. NEVER SKIP CUSTOM OR LEADERSHIP SECTIONS: If the resume contains a section such as 'Leadership & Community', 'Community', 'Volunteering', 'Positions of Responsibility', 'Extracurricular', or 'Open Source', you MUST extract it into 'customSection'. Put the exact heading in 'sectionTitle' (e.g. 'Leadership & Community') and format the roles/bullets as HTML '<ul><li>...</li></ul>' in 'summary'.
    2. If the resume has an 'Achievements' or 'Honors & Awards' section, populate the 'achievements' array. If achievements are not present but another custom section is present (like 'Leadership & Community'), make sure it is captured in 'customSection'.
    3. Keep summaries and descriptions concise (2-3 punchy bullets) so the entire resume stays within 1 single A4 page.
    4. Do not invent fake details. Preserve 100% of real organizations (e.g., NeoG Camp, clubs, hackathons, companies), dates, and metrics.
    5. Output strictly as a JSON object matching this schema. Do not write markdown annotations.
    `;

    parts.push({ text: promptText });

    const generationConfig = {
      temperature: 0.1, // extremely low temperature for exact parsing
      responseMimeType: "application/json",
    };

    let lastError = null;
    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        return await model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig,
        });
      } catch (err) {
        lastError = err;
        console.warn(`Gemini model ${modelName} parse failed, trying next:`, err.message);
      }
    }
    throw lastError;
  }
};
