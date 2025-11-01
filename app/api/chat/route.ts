import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { tool } from "@ai-sdk/provider-utils";
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

  const body = await req.json();
  console.log("🔵 Received body:", JSON.stringify(body));

  const messages = body.messages || [];
  console.log("🔵 Received messages:", messages.length, "messages");
  if (messages.length > 0) {
    console.log("🔵 First message:", JSON.stringify(messages[0]));
  }

  if (!messages || messages.length === 0) {
    return new Response("No messages provided", { status: 400 });
  }

  const gmailClient = new GmailClient(session.accessToken);

  try {
    console.log("🔵 Starting streamText with model: gemini-2.5-flash");

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: convertToModelMessages(messages),
      system: `You are a helpful AI assistant that can access and analyze the user's Gmail inbox. 
You can search for emails, summarize them, extract information like deadlines, links, and important details.
Always be concise and helpful. When presenting email information, format it clearly.
The current date is ${new Date().toLocaleDateString()}.`,
      tools: {
        searchEmails: tool({
          description:
            "Search for emails in the user's inbox using Gmail search syntax. Examples: 'from:john@example.com', 'subject:invoice', 'after:2024/01/01', 'has:attachment'",
          inputSchema: z.object({
            query: z.string().describe("Gmail search query"),
            maxResults: z
              .number()
              .optional()
              .default(10)
              .describe("Maximum number of results to return"),
          }),
          execute: async ({
            query,
            maxResults,
          }: {
            query: string;
            maxResults?: number;
          }) => {
            try {
              const emails = await gmailClient.searchEmails(
                query,
                maxResults || 10
              );
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
              console.error("Error in searchEmails tool:", error);
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
          execute: async ({ emailId }: { emailId: string }) => {
            try {
              const email = await gmailClient.getEmailDetails(emailId);
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
              console.error("Error in getEmailDetails tool:", error);
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
              .default(20)
              .describe("Maximum number of unread emails to return"),
          }),
          execute: async ({ maxResults }: { maxResults?: number }) => {
            try {
              const emails = await gmailClient.getUnreadEmails(
                maxResults || 20
              );
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
              console.error("Error in getUnreadEmails tool:", error);
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
              .default(20)
              .describe("Maximum number of recent emails to return"),
          }),
          execute: async ({ maxResults }: { maxResults?: number }) => {
            try {
              const emails = await gmailClient.getRecentEmails(
                maxResults || 20
              );
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
              console.error("Error in getRecentEmails tool:", error);
              return { success: false, error: "Failed to get recent emails" };
            }
          },
        }),
      },
    });

    console.log("✅ streamText completed successfully");

    // Return the proper response for @ai-sdk/react useChat
    return result.toTextStreamResponse();
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
