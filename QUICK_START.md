# 🚀 Quick Setup Checklist

## ✅ Step 1: Get Gemini API Key (2 min)

1. Visit https://aistudio.google.com/
2. Click "Get API Key" → "Create API key"
3. Copy the key

## ✅ Step 2: Set Up Google Cloud for Gmail (10 min)

1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable **Gmail API** in APIs & Services → Library
4. Create **OAuth 2.0 credentials**:
   - Go to Credentials → Create Credentials → OAuth client ID
   - Application type: Web application
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Configure consent screen (add yourself as test user)
6. Copy Client ID and Client Secret

## ✅ Step 3: Configure .env.local

Edit `.env.local` with your values:

```env
# From Google AI Studio
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# From Google Cloud Console
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx

# Generate this: openssl rand -base64 32
AUTH_SECRET=xxxxx

# Keep as is
NEXTAUTH_URL=http://localhost:3000
```

## ✅ Step 4: Run the App

```bash
npm run dev
```

Open http://localhost:3000

## 🎯 That's It!

Sign in with Google → Start asking questions about your emails!

---

**Example queries:**

- "Summarize my unread emails"
- "Find emails from john@example.com"
- "When is the project deadline?"
- "Show me emails with attachments"

**Need help?** Check:

- `GEMINI_UPDATE.md` - What changed to Gemini
- `SETUP.md` - Detailed setup guide
- `GEMINI.md` - Gemini-specific info
- `GETTING_STARTED.md` - Feature overview
