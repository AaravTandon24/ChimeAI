import { google } from "googleapis";

export interface Email {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  body: string;
  labels: string[];
}

export class GmailClient {
  private gmail;

  constructor(accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    this.gmail = google.gmail({ version: "v1", auth });
  }

  async searchEmails(query: string, maxResults: number = 10): Promise<Email[]> {
    try {
      const response = await this.gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults,
      });

      if (!response.data.messages) {
        return [];
      }

      const emails = await Promise.all(
        response.data.messages.map(async (message) => {
          return await this.getEmailDetails(message.id!);
        })
      );

      return emails;
    } catch (error) {
      console.error("Error searching emails:", error);
      throw new Error("Failed to search emails");
    }
  }

  async getEmailDetails(messageId: string): Promise<Email> {
    try {
      const response = await this.gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
      });

      const message = response.data;
      const headers = message.payload?.headers || [];

      const getHeader = (name: string) => {
        return (
          headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())
            ?.value || ""
        );
      };

      const subject = getHeader("subject");
      const from = getHeader("from");
      const to = getHeader("to");
      const date = getHeader("date");

      // Extract body
      let body = "";
      if (message.payload?.body?.data) {
        body = Buffer.from(message.payload.body.data, "base64").toString(
          "utf-8"
        );
      } else if (message.payload?.parts) {
        // Handle multipart messages
        for (const part of message.payload.parts) {
          if (part.mimeType === "text/plain" && part.body?.data) {
            body += Buffer.from(part.body.data, "base64").toString("utf-8");
          }
        }
      }

      return {
        id: message.id!,
        threadId: message.threadId!,
        subject,
        from,
        to,
        date,
        snippet: message.snippet || "",
        body,
        labels: message.labelIds || [],
      };
    } catch (error) {
      console.error("Error getting email details:", error);
      throw new Error("Failed to get email details");
    }
  }

  async getRecentEmails(maxResults: number = 20): Promise<Email[]> {
    return this.searchEmails("is:inbox", maxResults);
  }

  async getUnreadEmails(maxResults: number = 20): Promise<Email[]> {
    return this.searchEmails("is:unread", maxResults);
  }
}
