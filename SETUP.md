# Setup Instructions

Follow these steps to get your Gmail AI Assistant up and running.

## Prerequisites

- Node.js 18+ installed
- A Google account
- A Google AI Studio API key (for Gemini)

## Step 1: Get Google Gemini API Key (5 minutes)

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **Get API Key** in the left sidebar
4. Click **Create API key**
5. Select an existing Google Cloud project or create a new one
6. Copy the API key - you'll need this!

## Step 2: Google Cloud Setup (10 minutes)

### Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Name it "Gmail AI Assistant" (or your preferred name)
5. Click "Create"

### Enable Gmail API

1. In your project, go to **APIs & Services** > **Library**
2. Search for "Gmail API"
3. Click on it and press **Enable**

### Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Configure Consent Screen**

   - Choose "External" user type
   - Fill in app name: "Gmail AI Assistant"
   - Add your email as support and developer contact
   - Click "Save and Continue"
   - On Scopes, click "Add or Remove Scopes"
   - Add: `https://www.googleapis.com/auth/gmail.readonly`
   - Click "Save and Continue"
   - Add yourself as a test user
   - Click "Save and Continue"

3. Go back to **Credentials** tab
4. Click **Create Credentials** > **OAuth client ID**
5. Choose "Web application"
6. Name it "Gmail AI Web Client"
7. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. Click **Create**
9. **Important**: Copy the Client ID and Client Secret - you'll need these!

## Step 3: Configure Environment Variables

1. In your project root, copy the example file:

   ```bash
   copy .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your values:

   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key-here
   GOOGLE_CLIENT_ID=...your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=...your-client-secret-here
   AUTH_SECRET=...generate-this-below
   NEXTAUTH_URL=http://localhost:3000
   ```

3. Generate `AUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as the `AUTH_SECRET` value.

## Step 4: Install and Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Application

1. Click "Sign in with Google"
2. Choose your Google account
3. You'll see a warning screen (because the app is in testing mode)
   - Click "Advanced" > "Go to Gmail AI Assistant (unsafe)"
   - This is normal for apps in development
4. Grant the requested permissions
5. You should now see the chat interface!

## Testing Queries

Try these example queries:

- "Show me my unread emails"
- "Summarize the latest 5 emails"
- "Find emails from [someone@example.com]"
- "What are the emails about [topic]?"
- "Find emails with attachments"

## Troubleshooting

### "Redirect URI mismatch" error

- Make sure you added `http://localhost:3000/api/auth/callback/google` exactly in Google Cloud Console
- Check that `NEXTAUTH_URL` in `.env.local` is set to `http://localhost:3000`

### "Invalid client" error

- Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
- Make sure there are no extra spaces

### AI not responding

- Verify your `OPENAI_API_KEY` is correct
- Check the terminal for error messages
- Make sure you have API credits in your OpenAI account

### Gmail API errors

- Ensure Gmail API is enabled in Google Cloud Console
- Check that you granted the Gmail read permission during OAuth

## Moving to Production

When you're ready to deploy:

1. In Google Cloud Console, publish your OAuth consent screen
2. Add your production domain to authorized redirect URIs:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
3. Update `NEXTAUTH_URL` in your production environment variables
4. Deploy to Vercel or your preferred hosting platform

## Need Help?

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Vercel AI SDK docs](https://sdk.vercel.ai/docs)
- See [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2)
