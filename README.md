# PrepAI 🚀
> A Premium AI-Powered Interview Question Generator & Preparation Platform.

PrepAI helps candidates and recruiters generate targeted, high-quality interview questions tailored to specific roles, companies, job descriptions, categories, and difficulty levels. It uses a resilient multi-provider AI fallback system to guarantee uptime and deliver top-tier results.

## 🌐 Live Deployments

- **Frontend Web Application (Vercel)**: [https://prepai-beta.vercel.app/](https://prepai-beta.vercel.app/)
- **Backend API Server (Render)**: [https://prepai-npz2.onrender.com/](https://prepai-npz2.onrender.com/)
- **Database (Supabase)**: Managed PostgreSQL Instance

---

## 🌟 Key Features

- **Resilient AI Fallback Engine**: Attempts generation using a fallback chain: **Gemini 2.0 Flash** ➔ **Groq (Llama 3.3 70B)** ➔ **Claude**. If one service fails or hits a rate limit, it automatically tries the next.
- **Dynamic Configuration**: Customize generation by:
  - **Target Role** (e.g. Frontend Engineer, Product Manager)
  - **Target Company** (e.g. Google, Stripe, Netflix)
  - **Job Description** (paste raw JDs to generate highly contextual questions)
  - **Difficulty** (Easy, Medium, Hard)
  - **Categories** (DSA, Technical, HR, System Design)
  - **Question Count** (5, 10, or 15)
- **Interactive Bookmarks**: Toggle bookmarks directly on generated question cards, and filter saved bookmarks by category with instant search.
- **Session History**: Track previous generation runs, review past questions, view metadata (such as which AI model generated the questions), or delete completed sessions.
- **Premium Glassmorphism UI**: Beautiful, modern dashboard featuring fluid hover animations, custom shimmer loading skeletons, ambient glow backdrops, and active-state styling.

---

## 🛠️ Technology Stack

### Frontend (`/prepAi`)
- **Core**: React 19, JavaScript (ES6+), Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios (with global auth interceptor and 401 automatic logout handling)
- **Feedback**: React Hot Toast

### Backend (`/server`)
- **Runtime**: Node.js & Express
- **Database ORM**: Prisma (configured with PostgreSQL)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs (password hashing)
- **AI Clients**: `@google/generative-ai`, `groq-sdk`, `@anthropic-ai/sdk`
- **Utility**: nodemon, dotenv, cors

---

## 📂 Project Structure

```text
Interview question generator/
├── prepAi/                   # React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable components (Navbar, QuestionCard, Footer, ProtectedRoute)
│   │   ├── context/          # Auth Context (State & Session storage)
│   │   ├── pages/            # Page Views (Landing, Login, Signup, Dashboard, Generator, Bookmarks, History)
│   │   ├── services/         # Axios API configuration & endpoints
│   │   ├── App.jsx           # App routes and shell
│   │   └── main.jsx          # Entry point
│   ├── vite.config.js
│   └── package.json
│
├── server/                   # Express Backend
│   ├── middleware/           # Auth middlewares
│   ├── prisma/               # Schema configuration and migrations
│   │   └── schema.prisma     # PostgreSQL data models (User, Session, Question)
│   ├── routes/               # API Router files (auth, generate, history/bookmarks)
│   ├── services/             # AI Multi-Provider Fallback handler (aiService.js)
│   ├── index.js              # Server entry point
│   └── package.json
```

---

## 🔌 API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user & return JWT token

### Generation
- `POST /api/generate` - Generate new questions (requires authentication)
  - **Request Body**:
    ```json
    {
      "role": "Software Engineer",
      "company": "Google",
      "jd": "Optional job description text...",
      "categories": ["DSA", "Technical"],
      "difficulty": "Medium",
      "count": 5
    }
    ```

### History & Bookmarks
- `GET /api/history` - Retrieve all user history sessions
- `GET /api/history/:id` - Fetch details for a specific session
- `DELETE /api/history/:id` - Delete a session (cascades and deletes questions)
- `GET /api/bookmarks` - Retrieve all bookmarked questions for the authenticated user
- `PATCH /api/questions/:id/bookmark` - Toggle bookmark status on a specific question

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- API Keys for at least one AI provider (Gemini, Groq, or Anthropic)

### 1. Database & Backend Setup (`/server`)

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the template:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/prepai?schema=public"
   JWT_SECRET="your_jwt_secret_here"
   CLIENT_URL="http://localhost:5173"

   # AI Provider Keys (at least one is required)
   GEMINI_API_KEY="your_gemini_api_key"
   GROQ_API_KEY="your_groq_api_key"
   ANTHROPIC_API_KEY="your_anthropic_api_key"
   ```
4. Run Prisma database migrations and generate the Prisma Client:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
5. Start the backend dev server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup (`/prepAi`)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd prepAi
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL="http://localhost:5000"
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or file an issue to help improve PrepAI.
