import { auth, signIn } from "@/auth";
import { Chat } from "@/components/chat";
import { Mail, Sparkles, Shield, Zap, CheckCircle } from "lucide-react";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F7F9FC] via-white to-[#ECEFF1] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6">
        <div className="w-full max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-[#4A90E2] to-[#FF6F61] rounded-2xl shadow-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-[#1A1A2E] dark:text-white">
                    Chime AI
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Powered by Gemini 2.0
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-[#1A1A2E] dark:text-white">
                  Your AI-Powered Gmail Assistant
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Transform how you manage emails with intelligent AI
                  assistance. Search, summarize, and analyze your inbox
                  effortlessly.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                    <Zap className="w-5 h-5 text-[#4A90E2] dark:text-[#4A90E2]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E] dark:text-white">
                      Instant Search
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Find any email in seconds with natural language queries
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-950/30 rounded-lg">
                    <Mail className="w-5 h-5 text-[#FF6F61] dark:text-[#FF6F61]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E] dark:text-white">
                      Smart Summaries
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get concise summaries of long email threads
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                    <Shield className="w-5 h-5 text-[#4A90E2] dark:text-[#4A90E2]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E] dark:text-white">
                      Secure & Private
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your data is encrypted and never stored
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-800 p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-4 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-950/30 dark:to-orange-950/30 rounded-2xl">
                      <Mail className="w-12 h-12 text-[#4A90E2] dark:text-[#4A90E2]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1A1A2E] dark:text-white">
                      Get Started
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Connect your Gmail to unlock AI-powered email management
                    </p>
                  </div>

                  <form
                    action={async () => {
                      "use server";
                      await signIn("google");
                    }}
                  >
                    <button
                      type="submit"
                      className="w-full group relative px-6 py-4 bg-gradient-to-br from-[#4A90E2] to-[#FF6F61] hover:from-[#3A7FD5] hover:to-[#FF5F51] text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span>Sign in with Google</span>
                      </div>
                    </button>
                  </form>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span>Free to use</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span>Read-only access to Gmail</span>
                    </div>
                  </div>

                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    By signing in, you agree to our terms and privacy policy. We
                    only request read-only access to your Gmail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen">
      <Chat />
    </main>
  );
}
