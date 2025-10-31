# Gmail AI Assistant

An AI-powered assistant that helps you manage and query your Gmail inbox using natural language.

## Features

- 🔐 Secure Google OAuth authentication
- 💬 Natural language chat interface
- 📧 Search and summarize emails
- 📅 Extract deadlines and important dates
- 🔗 Find links and attachments
- 🤖 Powered by GPT-4 and Vercel AI SDK

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Gmail API:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API" and enable it
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID and Client Secret

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then fill in the values:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
AUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
```

Generate AUTH_SECRET with:

```bash
openssl rand -base64 32
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click "Sign in with Google" to authenticate
2. Grant permission to access your Gmail
3. Start asking questions like:
   - "Summarize my unread emails"
   - "When is the deadline for the project proposal?"
   - "Find the link to the registration form"
   - "Show me emails from John this week"

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI**: Vercel AI SDK with Google Gemini 1.5 Pro
- **Auth**: NextAuth.js v5
- **Gmail**: Google APIs
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript + Zod

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth routes
│   │   └── chat/          # AI chat endpoint
│   ├── layout.tsx
│   └── page.tsx           # Main page with auth
├── components/
│   └── chat.tsx           # Chat interface
├── lib/
│   └── gmail.ts           # Gmail API client
├── types/
│   └── next-auth.d.ts     # Type definitions
└── auth.ts                # Auth configuration
```

## Available AI Tools

The AI agent has access to these tools:

- `searchEmails`: Search emails using Gmail query syntax
- `getEmailDetails`: Get full details of a specific email
- `getUnreadEmails`: Get all unread emails
- `getRecentEmails`: Get recent emails from inbox

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
