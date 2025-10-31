import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { tool } from "@ai-sdk/provider-utils";
import { z } from "zod";
import { auth } from "@/auth";
import { GmailClient } from "@/lib/gmail";

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();
  const gmailClient = new GmailClient(session.accessToken);

  // @ts-ignore - AI SDK tool typing compatibility
  const result = streamText({
    model: google("models/gemini-2.5-flash"),
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
          maxResults: number;
        }) => {
          try {
            const emails = await gmailClient.searchEmails(query, maxResults);
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
        execute: async ({ maxResults }: { maxResults: number }) => {
          try {
            const emails = await gmailClient.getUnreadEmails(maxResults);
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
        execute: async ({ maxResults }: { maxResults: number }) => {
          try {
            const emails = await gmailClient.getRecentEmails(maxResults);
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
            return { success: false, error: "Failed to get recent emails" };
          }
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
