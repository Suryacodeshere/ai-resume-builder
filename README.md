# AI Resume Builder

🔗 **Live Demo:** [AI Resume Builder](https://ai-resume-builder-tau-six.vercel.app)

A full-stack, AI-powered resume builder designed to create interview-ready, ATS-friendly LaTeX-style resumes that strictly fit on **1 single A4 page**.

---

## ✨ Key Features

### 1. 📄 Smart 1-Page Automatic Summarization & Formatting
- **Automatic Hierarchical Condensation**: When importing or parsing verbose or multi-page resumes, the AI automatically condenses secondary sections (e.g., *Leadership & Community*, *Achievements*) first, followed by projects and internships, ensuring the entire resume strictly fits onto a **single A4 page** while preserving 100% of the core metrics, tech stack, and contextual accomplishments.
- **Optimal Space Utilization**: Calibrated LaTeX margins and typographic density to eliminate awkward blank space at the bottom while preventing accidental page spills.

### 2. ⚡ AI Resume Parser & Importer
- **Drag-and-Drop Resume Import**: Upload existing PDF or plain text resumes. The AI parser extracts personal details, summary, education, experience, projects, categorized skills, certifications, achievements, and custom sections (*Leadership & Community*, *Volunteering*, *Open Source*) directly into editable form steps.
- **Multi-Model Fallback Resilience**: Features resilient multi-model failover (`gemini-2.5-flash` ➔ `gemini-3.6-flash` ➔ `gemini-3.5-flash`) to ensure zero downtime during high-traffic Google endpoint spikes.

### 3. 🎓 Premium LaTeX Styling & Typography
- Overleaf-inspired clean LaTeX aesthetic based on standard CS/engineering templates.
- Custom typography force-overrides using elegant serif styles (`Lora`, Georgia).
- Strictly formatted margins, clean page dividers (`<hr />`), and print-ready CSS optimized for standard A4 paper size.

### 4. ✍️ Personalized AI Summaries
- Dynamic professional summary suggestions generated for three target levels: **Fresher, Mid-Level, and Senior**.
- Tailored directly to what you type (e.g. typing `backend expert` produces optimized backend-focused profiles) or parsed from your existing resume.

### 5. 🚀 AI Bullet Points Optimizer (Google STAR / XYZ Formula)
- Direct text draft fields for Experience and Projects where you write what you did.
- **Optimize with AI** button that rewrites rough drafts into highly professional, metric-driven achievements using Google's XYZ formula: *Accomplished [X], as measured by [Y], by doing [Z]*.

### 6. 🛠️ Interactive Multi-Step Editor
- Step-by-step accordion editor including:
  - **Personal Details** (Phone, Email, LinkedIn, GitHub with real-time browser autofill syncing)
  - **Summary** (Personalized professional summaries)
  - **Education** (Degrees, schools, majors, GPA, and dates)
  - **Experience** (Job titles, companies, locations, dates, and optimized bullet summaries)
  - **Projects** (Project names, tech stack tags, GitHub/Live links, and implementation details)
  - **Technical Skills** (Categorized skills with custom labeling)
  - **Certifications** (Licenses and course credentials)
  - **Achievements** (Awards, highlights, and milestones)
  - **Leadership & Community / Custom Section** (Full support for extra sections like *Leadership & Community*, *Volunteering*, *Publications*, *Extracurriculars*)

### 7. 🔒 Secure Authentication & 1-Click Guest Login
- Custom authentication with **bcrypt** password hashing and **JWT-based** session management.
- **1-Click Guest Access**: Try all features immediately with demo guest login.
- Production-ready cross-origin cookie security (`sameSite: "none"`, `secure: true`).

### 8. 🖨️ Clean 1-Page PDF Print & Export
- Dedicated completion screen to quickly **Download PDF** via standard print layout.
- Hides all UI navigation, buttons, and form cards during print export, producing a clean, full-width single-page PDF document.

---

## 💻 Tech Stack

### Frontend
- **Core Library**: React.js 18
- **Build Tool**: Vite.js
- **State Management**: Redux Toolkit & React-Redux
- **Styling**: Tailwind CSS & Vanilla CSS (LaTeX Print Styles)
- **Component Libraries**: Shadcn UI & Radix UI primitives
- **Icons**: Lucide React
- **Rich Text Editing**: React Simple WYSIWYG
- **AI Integrations**: Google Generative AI SDK (Multi-model failover)

### Backend
- **Environment**: Node.js
- **Web Framework**: Express.js
- **Database Client**: Mongoose ODM
- **Authentication**: JSON Web Token (JWT) & bcryptjs
- **Middleware**: Cookie-Parser, CORS, Express JSON Parser

### Database & Deployment
- **Database**: MongoDB Atlas (Cloud NoSQL)
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render

---

## 🚀 Getting Started

### 📂 Setup Environment Variables

#### Backend `.env`
Create a `.env` file in the `Backend` directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET_KEY=your_jwt_secret_key
JWT_SECRET_EXPIRES_IN=1d
NODE_ENV=Dev
ALLOWED_SITE=http://localhost:5173
```

#### Frontend `.env.local`
Create a `.env.local` file in the `Frontend` directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_APP_URL=http://localhost:5001/
```

### ⚙️ Installation & Running Locally

1. **Clone the repository**:
   ```bash
   git clone git@github.com:Suryacodeshere/ai-resume-builder.git
   cd ai-resume-builder
   ```

2. **Run the Backend Server**:
   ```bash
   cd Backend
   npm install
   npm run dev
   ```

3. **Run the Frontend Application**:
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173/`.

---

## 👨‍💻 Author

- **Surya** - [@suryacodeshere](https://github.com/suryacodeshere)