# Using Google Gemini

Your Gmail AI Assistant is now powered by Google Gemini 1.5 Pro! 🎉

## Why Gemini?

- **Cost-effective**: Significantly cheaper than GPT-4
- **High quality**: Excellent reasoning and comprehension
- **Large context**: 1M+ token context window (great for long email threads)
- **Fast**: Low latency responses
- **Free tier**: 15 requests per minute on free tier

## Getting Your API Key

### Quick Start (2 minutes)

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **"Get API Key"** in the left sidebar
4. Click **"Create API key"**
5. Select a Google Cloud project (or create new one)
6. Copy your API key

### Add to Your Project

Add to `.env.local`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

That's it! No credit card required for the free tier.

## Gemini Models Available

In `app/api/chat/route.ts`, you can choose from:

```typescript
// Current default - Best for complex reasoning
model: google("gemini-1.5-pro-latest");

// Faster, cheaper alternative
model: google("gemini-1.5-flash-latest");

// Experimental - even larger context
model: google("gemini-1.5-pro-exp-0801");
```

### Model Comparison

| Model                   | Speed  | Cost   | Best For                                  |
| ----------------------- | ------ | ------ | ----------------------------------------- |
| gemini-1.5-pro-latest   | Medium | Medium | Complex queries, detailed analysis        |
| gemini-1.5-flash-latest | Fast   | Low    | Quick searches, simple queries            |
| gemini-1.5-pro-exp-0801 | Medium | Medium | Experimental features, very long contexts |

## Pricing

**Free Tier:**

- 15 requests per minute
- 1,500 requests per day
- Perfect for personal use!

**Paid Tier** (if you need more):

- Gemini 1.5 Pro: $3.50 / 1M input tokens, $10.50 / 1M output tokens
- Gemini 1.5 Flash: $0.075 / 1M input tokens, $0.30 / 1M output tokens

Compare to GPT-4: $30 / 1M input tokens 💰

## Features Specific to Gemini

### 1. Large Context Window

Gemini 1.5 Pro can handle up to 1M tokens, meaning you can:

- Analyze entire email threads
- Summarize hundreds of emails at once
- Keep long conversation history

### 2. Multimodal (Future Enhancement)

Gemini can understand images, which means you could add:

- Analyze email attachments
- Extract text from images
- Process screenshots

### 3. Code Execution (Experimental)

Gemini can execute Python code, useful for:

- Data analysis of emails
- Complex calculations
- Generating charts/visualizations

## Switching Models

To switch to Flash for faster responses:

```typescript
// In app/api/chat/route.ts
const result = streamText({
  model: google("gemini-1.5-flash-latest"), // Changed from pro
  // ... rest of config
});
```

## Rate Limits

Free tier limits:

- 15 RPM (requests per minute)
- 1,500 RPD (requests per day)
- 1M TPM (tokens per minute)

Your app handles rate limits gracefully - users will see an error message if limits are exceeded.

## API Key Security

⚠️ **Important**:

- Never commit `.env.local` to git (already in .gitignore)
- Use environment variables in production
- Rotate keys if exposed

## Troubleshooting

### "API key not valid"

- Check that you copied the full key
- Ensure no extra spaces in `.env.local`
- Restart the dev server after changing env variables

### "Resource exhausted" error

- You've hit the rate limit
- Wait 60 seconds and try again
- Consider upgrading to paid tier if needed

### Slow responses

- Switch to `gemini-1.5-flash-latest` for faster responses
- Reduce the number of emails fetched
- Check your internet connection

## Resources

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Vercel AI SDK - Google Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai)
- [Gemini Pricing](https://ai.google.dev/pricing)

## Need Help?

Check the main [SETUP.md](./SETUP.md) for complete setup instructions!
