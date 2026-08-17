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
      throw new Error("Gemini API Key is missing. Please enter your API key in the AI Interview Coach panel settings.");
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
        console.warn(`Gemini model ${modelName} failed, attempting next fallback model:`, err.message);
      }
    }
    throw lastError;
  },

  parseResume: async (fileBase64, mimeType, rawText) => {
    const key = getApiKey();
    if (!key || key.includes("Create Your Own")) {
      throw new Error("Gemini API Key is missing. Please configure it in the setting panel or environment variables.");
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
    You are an expert ATS resume parser. Extract the information from the attached resume document/text and parse its content into a structured JSON object matching this schema:
    
    {
      "firstName": "String",
      "lastName": "String",
      "email": "String",
      "phone": "String",
      "address": "String (Location or full address)",
      "linkedin": "String (LinkedIn URL)",
      "github": "String (GitHub URL)",
      "jobTitle": "String (Target role or title)",
      "summary": "String",
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
          "workSummary": "String (HTML bullet points wrapped in <ul> and <li> tags, detailing responsibilities and achievements)"
        }
      ],
      "projects": [
        {
          "projectName": "String",
          "techStack": "String (Comma-separated tools/languages)",
          "githubLink": "String (GitHub Link)",
          "liveLink": "String (Live Demo Link)",
          "projectSummary": "String (HTML bullet points wrapped in <ul> and <li> tags, detailing project features and contributions)"
        }
      ],
      "skills": [
        {
          "name": "String (Category, e.g. Languages, Web Technologies, Tools)",
          "skillsList": "String (Comma-separated skills in this category, e.g. Java, JavaScript, Python)"
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
          "description": "String (Bullet point describing achievement)"
        }
      ]
    }
    
    Current resume raw text (use if file upload is missing): "${rawText || ""}"
    
    Extract all information carefully. If any section is not found in the source, leave it as an empty array or string. Do not invent any data. Write project summaries and experience points in a highly professional recruiter-friendly tech style.
    
    Output strictly as a JSON object matching this schema. Do not write markdown annotations.
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
