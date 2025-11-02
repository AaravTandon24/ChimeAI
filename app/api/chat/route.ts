import { google } from "@ai-sdk/google";
import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import { z } from "zod";
import { auth } from "@/auth";
import { GmailClient } from "@/lib/gmail";

export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("🔵 Chat API called");

  const session = await auth();
  console.log("🔵 Session:", session ? "✅ Authenticated" : "❌ No session");

  if (!session || !session.accessToken) {
    console.log("❌ Unauthorized - no session or access token");
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();
  console.log("🔵 Received messages:", messages.length, "messages");

  if (!messages || messages.length === 0) {
    return new Response("No messages provided", { status: 400 });
  }

  const gmailClient = new GmailClient(session.accessToken);

  try {
    console.log("🔵 Starting streamText with model: gemini-2.0-flash-exp");

    const result = streamText({
      model: google("models/gemini-2.0-flash-exp"),
      messages: convertToModelMessages(messages),
      system: `You are Chime, an intelligent Gmail AI assistant powered by Google's Gemini 2.0 model.

PERSONALITY & TONE:
- Be friendly, professional, and conversational
- Use clear, concise language with proper formatting
- Show enthusiasm when helping but remain professional
- Use emojis sparingly and appropriately (📧 ✉️ 📨 🔍 ⏰ etc.)

CAPABILITIES:
You have access to the user's Gmail inbox through these tools:
1. searchEmails - Search using Gmail query syntax
2. getEmailDetails - Get full content of specific emails
3. getUnreadEmails - Fetch unread messages
4. getRecentEmails - Get recent inbox activity

RESPONSE FORMAT:
When presenting email information:
- Use bullet points for multiple items
- Include sender, subject, and date for each email
- Highlight key information (deadlines, action items, important links)
- Summarize long content into digestible points
- Use line breaks for better readability

BEST PRACTICES:
- Always verify you have relevant emails before claiming "no results"
- Suggest follow-up queries when appropriate
- If a search returns many results, ask if the user wants more specific filtering
- When users ask vague questions, use the most relevant tool and explain what you're doing
- For time-based queries, always check recent emails first

FORMATTING EXAMPLES:
✅ Good: "I found 3 unread emails:\n\n📧 **From**: John Doe\n**Subject**: Q4 Report\n**Date**: Today at 2:30 PM\n**Summary**: Needs review by Friday\n\n..."
❌ Bad: "Email from John about Q4 report"

Current date: ${new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
Current time: ${new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}

Remember: Users trust you with their personal emails. Be helpful, accurate, and respect their privacy. Also answer in natural language to make the user feel comfortable.`,
      stopWhen: stepCountIs(5),
      onStepFinish: (step) => {
        console.log("🔵 Step finished:", JSON.stringify(step, null, 2));
      },
      tools: {
        searchEmails: tool({
          description:
            "Search for emails in the user's inbox using Gmail search syntax. Examples: 'from:john@example.com', 'subject:invoice', 'after:2024/01/01', 'has:attachment'",
          inputSchema: z.object({
            query: z.string().describe("Gmail search query"),
            maxResults: z
              .number()
              .optional()
              .describe("Maximum number of results to return (default: 10)"),
          }),
          execute: async ({ query, maxResults }) => {
            try {
              console.log("🔧 Searching emails with query:", query);
              const emails = await gmailClient.searchEmails(
                query,
                maxResults || 10
              );
              console.log("✅ Found", emails.length, "emails");
              return {
                success: true,
                count: emails.length,
                emails: emails.map((email) => ({
                  subject: email.subject,
                  from: email.from,
                  date: email.date,
                  snippet: email.snippet,
                  id: email.id,
                })),
              };
            } catch (error) {
              console.error("❌ Error in searchEmails tool:", error);
              return { success: false, error: "Failed to search emails" };
            }
          },
        }),
        getEmailDetails: tool({
          description:
            "Get full details of a specific email including the complete body text",
          inputSchema: z.object({
            emailId: z.string().describe("The ID of the email to retrieve"),
          }),
          execute: async ({ emailId }) => {
            try {
              console.log("🔧 Getting email details for:", emailId);
              const email = await gmailClient.getEmailDetails(emailId);
              console.log("✅ Got email details");
              return {
                success: true,
                email: {
                  subject: email.subject,
                  from: email.from,
                  to: email.to,
                  date: email.date,
                  body: email.body,
                  snippet: email.snippet,
                },
              };
            } catch (error) {
              console.error("❌ Error in getEmailDetails tool:", error);
              return { success: false, error: "Failed to get email details" };
            }
          },
        }),
        getUnreadEmails: tool({
          description: "Get all unread emails from the inbox",
          inputSchema: z.object({
            maxResults: z
              .number()
              .optional()
              .describe(
                "Maximum number of unread emails to return (default: 20)"
              ),
          }),
          execute: async ({ maxResults }) => {
            try {
              console.log("🔧 Getting unread emails");
              const emails = await gmailClient.getUnreadEmails(
                maxResults || 20
              );
              console.log("✅ Found", emails.length, "unread emails");
              return {
                success: true,
                count: emails.length,
                emails: emails.map((email) => ({
                  subject: email.subject,
                  from: email.from,
                  date: email.date,
                  snippet: email.snippet,
                  id: email.id,
                })),
              };
            } catch (error) {
              console.error("❌ Error in getUnreadEmails tool:", error);
              return { success: false, error: "Failed to get unread emails" };
            }
          },
        }),
        getRecentEmails: tool({
          description: "Get recent emails from the inbox",
          inputSchema: z.object({
            maxResults: z
              .number()
              .optional()
              .describe(
                "Maximum number of recent emails to return (default: 20)"
              ),
          }),
          execute: async ({ maxResults }) => {
            try {
              console.log("🔧 Getting recent emails");
              const emails = await gmailClient.getRecentEmails(
                maxResults || 20
              );
              console.log("✅ Found", emails.length, "recent emails");
              return {
                success: true,
                count: emails.length,
                emails: emails.map((email) => ({
                  subject: email.subject,
                  from: email.from,
                  date: email.date,
                  snippet: email.snippet,
                  id: email.id,
                })),
              };
            } catch (error) {
              console.error("❌ Error in getRecentEmails tool:", error);
              return { success: false, error: "Failed to get recent emails" };
            }
          },
        }),
      },
    });

    console.log("✅ streamText completed successfully");

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("❌ Error in chat API:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
