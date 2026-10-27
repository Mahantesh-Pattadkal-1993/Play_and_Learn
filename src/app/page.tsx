"use client";

import { useRouter } from "next/navigation";
import { useUserContext } from "@/components/UserContext";
import ProfileSelector from "@/components/ProfileSelector";

export default function HomePage() {
  const router = useRouter();
  const { userId, setUser } = useUserContext();

  const handleSelect = (id: typeof userId) => {
    if (id) {
      setUser(id);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Play and Learn
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An interactive platform to learn TypeScript and Playwright from
          scratch — with analogies, diagrams, quizzes, and a built-in code runner.
        </p>
        <p className="text-sm text-slate-400 mt-4">
          7 modules • 35 lessons • from TypeScript basics to a CI-ready
          Playwright suite
        </p>
      </div>

      <div className="w-full max-w-4xl animate-fadeIn" style={{ animationDelay: "100ms" }}>
        <p className="text-sm uppercase tracking-wider text-slate-400 mb-4 text-center">
          Choose your profile to begin
        </p>
        <ProfileSelector onSelect={handleSelect} selected={userId} />
      </div>

      <footer className="absolute bottom-6 text-center text-sm text-slate-500">
        <p>Built with Next.js, TypeScript, Tailwind & Playwright</p>
      </footer>
    </div>
  );
}

