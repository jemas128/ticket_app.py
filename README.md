# 🍿 Neon Cinema - Smart Queue System

A lively, interactive queue simulation app built with **Python**, **Streamlit**, and **Google Gemini API**. It features a glassmorphism UI, animated backgrounds, and uses AI to generate witty, personalized messages for customers as they are served.

## 📂 Files Required
Ensure you have these files in your repository:
1. `ticket_app.py` (The main application logic)
2. `requirements.txt` (Dependencies)

---

## 🚀 Deployment Guide (Streamlit Cloud)

Follow these steps to deploy this app for free using Streamlit Cloud.

### Step 1: Prepare the Repository
1. Create a new repository on **GitHub**.
2. Upload `ticket_app.py` and `requirements.txt` to the repository.
3. Commit the changes.

### Step 2: Get Your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Create a new API key.
3. Copy the key string (you will need it for the next step).

### Step 3: Deploy to Streamlit Cloud
1. Go to [share.streamlit.io](https://share.streamlit.io/) and log in.
2. Click **"New app"**.
3. Select your **GitHub repository** from the list.
4. Verify the settings:
   - **Main file path**: `ticket_app.py`
5. **Before clicking Deploy**, click on **"Advanced settings"** (or "Secrets").

### Step 4: Configure Secrets (API Key)
In the Streamlit "Secrets" configuration area, add your API key in the TOML format:

```toml
API_KEY = "your-google-gemini-api-key-here"
```

*Note: Streamlit looks for secrets in `.streamlit/secrets.toml` locally, but on the cloud, you configure them in the dashboard settings.*

### Step 5: Launch
1. Click **"Deploy"**.
2. Wait for the app to build (it will install the libraries from `requirements.txt`).
3. Once finished, your app will be live on the web!

---

## 🛠️ Local Development

To run this app on your own computer:

1. **Install Python** (if not installed).
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Set the API Key**:
   - Linux/Mac: `export API_KEY="your-key"`
   - Windows (PowerShell): `$env:API_KEY="your-key"`
   - *Alternative*: Create a `.streamlit/secrets.toml` file locally.
4. **Run the app**:
   ```bash
   streamlit run ticket_app.py
   ```
