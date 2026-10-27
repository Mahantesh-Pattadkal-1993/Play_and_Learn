"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UserId, User, UserProgress } from "@/lib/types";
import { getStoredUserId, setStoredUserId } from "@/lib/storage";
import { USERS } from "@/lib/users";
import { useProgress as useProgressHook } from "@/lib/hooks";

interface UserContextType {
  userId: UserId | null;
  user: User | null;
  progress: UserProgress | null;
  /** Progress snapshot for every profile (Tester tools overview). */
  allProgress: Record<UserId, UserProgress> | null;
  setUser: (id: UserId) => void;
  completeLesson: (lessonId: string) => void;
  setQuizScore: (lessonId: string, score: number) => void;
  setCodeDraft: (lessonId: string, code: string) => void;
  saveCurrentProgress: (updated: UserProgress) => void;
  /** Reset a profile's progress (defaults to the current profile). */
  resetProgress: (targetId?: UserId) => void;
  /** Reset a single lesson's completion, quiz score and saved draft. */
  resetLesson: (lessonId: string, targetId?: UserId) => void;
  /** Reset progress for every profile. */
  resetAllProgress: () => void;
  refreshProgress: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used within UserProvider");
  return ctx;
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<UserId | null>(null);
  const [loading, setLoading] = useState(true);

  // Get progress hook (returns progress + mutation helpers bound to current userId)
  const progressHook = useProgressHook(userId);

  // On mount, restore from localStorage
  useEffect(() => {
    const stored = getStoredUserId();
    if (stored) {
      setUserId(stored);
    }
    setLoading(false);
  }, []);

  const setUser = (id: UserId) => {
    setUserId(id);
    setStoredUserId(id);
  };

  const user = userId ? USERS[userId] : null;

  return (
    <UserContext.Provider
      value={{
        userId,
        user,
        progress: progressHook.progress,
        allProgress: progressHook.allProgress,
        setUser,
        completeLesson: progressHook.completeLesson,
        setQuizScore: progressHook.setQuizScore,
        setCodeDraft: progressHook.setCodeDraft,
        saveCurrentProgress: progressHook.saveCurrentProgress,
        resetProgress: progressHook.resetProgress,
        resetLesson: progressHook.resetLesson,
        resetAllProgress: progressHook.resetAll,
        refreshProgress: progressHook.refreshProgress,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
