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
    
    CRITICAL 1-PAGE HIERARCHICAL COMPRESSION RULES:
    The resulting resume MUST strictly fit onto ONE single 1-page A4 LaTeX format. To guarantee this, apply this exact summarization hierarchy:

    1. FIRST PRIORITY TO CONDENSE (Secondary Sections):
       - Leadership & Community / Volunteering / Custom Section (e.g. NeoG Camp, mentoring, clubs): MUST be captured into 'customSection'. Condense into strictly 1 single concise, punchy bullet point combining role, organization, and primary outcome in 1-2 lines maximum (e.g., "• Mentored 10K+ developers in React & web development at NeoG Camp, hosting regular problem-solving workshops (Sep 2021 – Jun 2023)").
       - Achievements & Awards: Condense into 1-2 ultra-concise, single-line bullets.
       - Certifications: Keep as clean 1-line title and date.

    2. SECOND PRIORITY TO CONDENSE (Skills & Projects):
       - Technical Skills: Group into strictly 3-4 clean categories (e.g., 'Languages & Frameworks', 'State & Tools', 'Architecture & Performance').
       - Projects: Exactly 2 tight, punchy bullet points per project focusing on architecture, tech stack, and quantified metrics.
       - Internships / Junior Roles: Max 2 concise bullet points highlighting core technical contributions.

    3. THIRD PRIORITY (Core Experience & Summary):
       - Primary Senior / Mid Experience: 2 to 3 strong, metric-driven bullet points using Google's XYZ formula: Accomplished [X], measured by [Y], by doing [Z].
       - Summary: Exactly 2 concise lines highlighting target role, years of experience, and primary tech stack.
       - Education: Clean 1 line per degree.

    4. PRESERVE 100% FACTUAL CONTEXT:
       - Keep all real companies, degrees, tech tools, metrics, GitHub/live links, and dates. Do not drop real sections—summarize them compactly so they all fit on 1 page!
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
  },

  condenseToSinglePage: async (resumeData) => {
    const key = getApiKey();
    if (!key || key.includes("Create Your Own")) {
      throw new Error("AI API Key is missing. Please configure it in settings.");
    }
    
    const genAI = new GoogleGenerativeAI(key);
    const generationConfig = {
      temperature: 0.2,
      responseMimeType: "application/json",
    };

    const prompt = `
    You are an elite LaTeX resume editor and executive resume coach.
    Take the following full resume JSON data and condense, tighten, and synthesize its summaries and bullet points so that the entire resume will strictly fit onto ONE single A4 page in standard LaTeX format without omitting any jobs, projects, degrees, or key metrics.

    Incoming Resume Data:
    ${JSON.stringify(resumeData, null, 2)}

    Compaction Rules:
    1. SUMMARY: Shorten into a crisp, powerful 2-line summary.
    2. EXPERIENCE: Limit each experience to exactly 2 concise, high-impact bullet points (or 1-2 if multiple roles exist). Eliminate conversational filler while retaining key tech stack, tools, and quantified metrics.
    3. PROJECTS: Limit each project to exactly 1-2 punchy bullet points highlighting technical architecture and measurable outcome.
    4. SKILLS: Consolidate into 3-4 clean categories.
    5. CUSTOM SECTION (e.g. Leadership & Community): Limit to 1-2 concise bullet points with role and organization.
    6. Maintain 100% of factual truth (names, dates, companies, links, degrees). Do not hallucinate or delete entire sections.
    
    Output strictly as a valid JSON object matching the exact incoming resume structure without markdown fences.
    `;

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
        console.warn(`Gemini model ${modelName} condense failed, trying next:`, err.message);
      }
    }
    throw lastError;
  }
};

