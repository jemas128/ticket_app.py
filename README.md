# 🍿 Neon Cinema - React App

This is a modern React application powered by the Google Gemini API. It features a lively glassmorphism UI and uses AI to generate witty welcome messages for cinema guests.

## 🚀 Deploying to Vercel (Free)

The easiest way to host this application is using **Vercel**.

### Step 1: Get your Code on GitHub
1. Create a new repository on [GitHub](https://github.com).
2. Upload all the files from this project (`index.tsx`, `index.html`, `package.json`, `vite.config.js`) to that repository.

### Step 2: Get your API Key
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Create and copy your **Gemini API Key**.

### Step 3: Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com/signup) and sign up/login with GitHub.
2. Click **"Add New..."** -> **"Project"**.
3. Select the GitHub repository you just created.
4. In the "Configure Project" screen:
   - **Framework Preset**: It should auto-detect "Vite" (or select Vite).
   - **Environment Variables**:
     - Key: `API_KEY`
     - Value: `paste-your-google-api-key-here`
5. Click **"Deploy"**.

Vercel will build your site and give you a live URL (e.g., `https://cinema-queue.vercel.app`) in about a minute.

---

## 💻 Local Development

1. Install Node.js.
2. Open a terminal in the project folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory:
   ```
   API_KEY=your_actual_api_key_here
   ```
5. Run the dev server:
   ```bash
   npm run dev
   ```
