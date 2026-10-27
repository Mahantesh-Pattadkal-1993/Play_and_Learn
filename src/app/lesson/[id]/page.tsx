"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserContext } from "@/components/UserContext";
import Navigation from "@/components/Navigation";
import LessonContent from "@/components/LessonContent";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { userId, setUser } = useUserContext();
  const lessonId = params?.id as string;

  // If no user is logged in, redirect to home
  useEffect(() => {
    if (!userId) {
      router.push("/");
    }
  }, [userId, router]);

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Redirecting to profile selection...</p>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <LessonContent lessonId={lessonId} />
    </>
  );
}
