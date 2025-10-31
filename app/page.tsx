import { auth, signIn } from "@/auth";
import { Chat } from "@/components/chat";
import { SignOutButton } from "@/components/sign-out-button";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold">Gmail AI Assistant</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your Gmail account to start asking questions about your
            emails
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h1 className="text-xl font-semibold">Gmail AI Assistant</h1>
            <p className="text-sm text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
          <SignOutButton />
        </div>
        <Chat />
      </div>
    </main>
  );
}
