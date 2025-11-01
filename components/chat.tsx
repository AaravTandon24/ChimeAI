"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import type { UIMessage } from "@ai-sdk/react";
import { Mail, Send, Sparkles, Inbox, Search, Clock } from "lucide-react";

// Function to render text with markdown formatting
function renderMarkdown(text: string) {
  // Split text into paragraphs and list items
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let inList = false;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const paragraphText = currentParagraph.join("\n");
      elements.push(
        <p key={elements.length} className="mb-3 last:mb-0">
          {renderInlineMarkdown(paragraphText)}
        </p>
      );
      currentParagraph = [];
    }
  };

  lines.forEach((line, index) => {
    // Code block detection
    if (line.trim().startsWith("```")) {
      flushParagraph();
      inList = false;
      return;
    }

    // List items (bullets)
    if (line.match(/^[\s]*[-•*]\s+/) || line.match(/^[\s]*\d+\.\s+/)) {
      flushParagraph();
      inList = true;
      const content = line
        .replace(/^[\s]*[-•*]\s+/, "")
        .replace(/^[\s]*\d+\.\s+/, "");
      elements.push(
        <div key={elements.length} className="flex gap-2 mb-2">
          <span className="text-blue-500 font-bold mt-0.5">•</span>
          <span className="flex-1">{renderInlineMarkdown(content)}</span>
        </div>
      );
      return;
    }

    // Empty lines create paragraph breaks
    if (line.trim() === "") {
      flushParagraph();
      inList = false;
      if (elements.length > 0 && index < lines.length - 1) {
        elements.push(<div key={`space-${elements.length}`} className="h-2" />);
      }
      return;
    }

    // Regular text
    if (inList && !line.match(/^[\s]*[-•*]\s+/)) {
      flushParagraph();
      inList = false;
    }

    currentParagraph.push(line);
  });

  flushParagraph();

  return <div className="space-y-0">{elements}</div>;
}

// Function to render inline markdown (bold, italic, code)
function renderInlineMarkdown(text: string) {
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);

  return parts.map((part, i) => {
    // Code block
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).trim();
      return (
        <pre
          key={i}
          className="bg-gray-800 dark:bg-gray-950 text-gray-100 p-3 rounded-lg my-3 overflow-x-auto font-mono text-sm"
        >
          <code>{code}</code>
        </pre>
      );
    }

    // Inline code
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-gray-200 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded font-mono text-sm"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Process inline formatting (bold, italic)
    return (
      <span key={i}>
        {part
          .split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*|__[^_\n]+__|_[^_\n]+_)/g)
          .map((segment, j) => {
            // Bold with **
            if (segment.startsWith("**") && segment.endsWith("**")) {
              return (
                <strong
                  key={j}
                  className="font-bold text-gray-900 dark:text-white"
                >
                  {segment.slice(2, -2)}
                </strong>
              );
            }
            // Bold with __
            if (segment.startsWith("__") && segment.endsWith("__")) {
              return (
                <strong
                  key={j}
                  className="font-bold text-gray-900 dark:text-white"
                >
                  {segment.slice(2, -2)}
                </strong>
              );
            }
            // Italic with *
            if (
              segment.startsWith("*") &&
              segment.endsWith("*") &&
              !segment.startsWith("**")
            ) {
              return (
                <em key={j} className="italic">
                  {segment.slice(1, -1)}
                </em>
              );
            }
            // Italic with _
            if (
              segment.startsWith("_") &&
              segment.endsWith("_") &&
              !segment.startsWith("__")
            ) {
              return (
                <em key={j} className="italic">
                  {segment.slice(1, -1)}
                </em>
              );
            }
            return segment;
          })}
      </span>
    );
  });
}

export function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestions = [
    {
      icon: Inbox,
      text: "Show me my unread emails",
      color: "text-cyan-600 dark:text-cyan-400",
      bgHover:
        "hover:bg-cyan-50 dark:hover:bg-cyan-950/30 hover:border-cyan-400",
    },
    {
      icon: Search,
      text: "Find emails about project deadlines",
      color: "text-purple-600 dark:text-purple-400",
      bgHover:
        "hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-400",
    },
    {
      icon: Clock,
      text: "What are my recent emails?",
      color: "text-emerald-600 dark:text-emerald-400",
      bgHover:
        "hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-400",
    },
    {
      icon: Mail,
      text: "Search for emails with attachments",
      color: "text-orange-600 dark:text-orange-400",
      bgHover:
        "hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-400",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      {/* Gmail-style Header */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chime AI
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Powered by Gemini 2.0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container - No visible scrollbar */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="max-w-5xl mx-auto px-6 py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh] space-y-8">
                <div className="text-center space-y-3">
                  <div className="inline-flex p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl">
                    <Mail className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    How can I help with your emails?
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    I can search, summarize, and analyze your Gmail inbox. Ask
                    me anything!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
                  {suggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setInput(suggestion.text);
                          sendMessage({ text: suggestion.text });
                        }}
                        className={`group flex items-center gap-3 p-4 text-left border-2 border-gray-200 dark:border-gray-800 rounded-xl ${suggestion.bgHover} transition-all duration-200 shadow-sm hover:shadow-md`}
                      >
                        <div className="flex-shrink-0">
                          <Icon
                            className={`w-5 h-5 ${suggestion.color} group-hover:scale-110 transition-transform`}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                          {suggestion.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-6">
                {messages.map((message: UIMessage, index: number) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    } animate-in fade-in slide-in-from-bottom-4 duration-500`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-2 ring-white dark:ring-gray-900">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-5 py-3.5 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-600 via-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/30 ring-1 ring-blue-400/50"
                          : "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-800 shadow-md"
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="leading-relaxed">
                          {renderMarkdown(
                            message.parts
                              .filter((part) => part.type === "text")
                              .map((part: any) => part.text)
                              .join("")
                          )}
                        </div>
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0 ml-3 mt-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900">
                          <span className="text-xs font-semibold text-white">
                            You
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-2 ring-white dark:ring-gray-900">
                        <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-4 shadow-md">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1.5">
                          <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                        </div>
                        <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gmail-style Input */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !isLoading) {
                sendMessage({ text: input });
                setInput("");
              }
            }}
            className="relative"
          >
            <div className="flex items-center gap-3 p-1 rounded-full border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-gray-950 focus-within:shadow-lg focus-within:shadow-blue-500/20 transition-all duration-200">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about your emails..."
                className="flex-1 px-5 py-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 mr-1 p-3 bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-700 hover:via-blue-700 hover:to-purple-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100 shadow-lg shadow-blue-500/30"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
