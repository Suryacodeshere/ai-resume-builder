# AI Resume Builder

🔗 **Live Demo:** [AI Resume Builder](https://ai-resume-builder-tau-six.vercel.app)

## Features

### 1. 🔒 Secure User Authentication  
- Custom authentication with **bcrypt** password hashing  
- **JWT-based** session management and secure cookie authentication

### 2. 🏠 User Dashboard  
- View, edit, copy, or delete previous resume versions  
- **Upload & Transform Existing Resumes**: Drag-and-drop your existing PDF or copy-paste raw text, and the built-in Gemini parser will automatically extract and structure your information into the LaTeX template format

### 3. 🎓 Premium LaTeX Styling & Typography  
- Overleaf-inspired clean LaTeX aesthetic based on classic templates
- Custom typography force-overrides using elegant serif styles (`Lora`, Georgia)
- Strictly formatted margins, clean page dividers, and print-ready CSS optimized for standard A4 layouts

### 4. ✍️ Personalized AI Summaries  
- Dynamic professional summary suggestions generated for three target levels: **Fresher, Mid-Level, and Senior**
- Tailored directly to what you type (e.g. typing `backend expert` produces optimized backend-focused profiles) or parsed from your existing resume

### 5. 🚀 AI Bullet Points Optimizer (Google STAR/XYZ Formula)  
- Direct text draft fields for Experience and Projects where you write what you did
- **Optimize with AI** button that rewrites your rough drafts into highly professional, metric-driven achievements using Google's XYZ formula: *Accomplished [X], as measured by [Y], by doing [Z]*

### 6. 🛠️ Interactive Resume Editor  
- Step-by-step accordion editor including:
  - **Personal Details** (Phone, Email, LinkedIn, GitHub with real-time browser autofill syncing)
  - **Summary** (Personalized professional summaries)
  - **Experience** (Position titles, companies, and optimized bullet summaries)
  - **Projects** (Project names, tech stack tags, and implementation details)
  - **Education** (Degrees, schools, majors, and dates)
  - **Skills** (Categorized skills with custom labeling)
  - **Certifications** (Licenses and course credentials)
  - **Achievements** (Awards, highlights, and milestones)
- **Custom Choose-Your-Own Categories**: Toggle and add extra sections of your choice (e.g. *Languages*, *Publications*, *Extracurriculars*) with full AI draft optimization support

### 7. 🔍 Real-Time Live Preview  
- Interactive side-by-side interface showing real-time rendering changes as you type
- Responsive viewport toggles to view the full canvas on all screen sizes

### 8. 📄 Print & Export Options  
- Dedicated completion screen to quickly **Download PDF** via standard print layout
- Clean, customizable theme styling colors

---

## Tech Stack

### Frontend
- **Core Library**: React.js
- **Build Tool**: Vite.js
- **State Management**: Redux Toolkit & React-Redux
- **Styling**: Tailwind CSS & Vanilla CSS
- **Component Libraries**: Shadcn UI & Radix UI primitives
- **Icons**: Lucide React
- **Rich Text Editing**: React Simple WYSIWYG
- **AI Integrations**: Google Generative AI SDK (Gemini 2.5 Flash API)

### Backend
- **Environment**: Node.js
- **Web Framework**: Express.js
- **Database Client**: Mongoose ODM
- **Authentication**: JSON Web Token (JWT) & bcrypt hashing
- **Middleware**: Cookie-Parser, CORS, Express JSON Parser

### Database
- **Storage**: MongoDB Atlas (NoSQL cloud database)

---

## Getting Started

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

## Developer 👨‍💻

- [@Surya](https://github.com/suryacodeshere)