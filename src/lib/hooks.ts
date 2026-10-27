import { useCallback, useEffect, useState } from "react";
import { UserProgress, UserId } from "./types";
import {
  PROGRESS_EVENT,
  createEmptyProgress,
  getAllProgress,
  getProgress,
  resetAllProgress as resetAllProgressStorage,
  resetLessonProgress as resetLessonProgressStorage,
  resetProgress as resetProgressStorage,
  saveProgress,
  getStoredUserId,
  setStoredUserId,
  clearStoredUserId,
  markLessonComplete,
  saveQuizScore,
  saveCodeDraft,
} from "./storage";

export const useUser = () => {
  const [userId, setUserId] = useState<UserId | null>(null);

  useEffect(() => {
    const stored = getStoredUserId();
    if (stored) {
      setUserId(stored);
    }
  }, []);

  const setUser = useCallback((id: UserId) => {
    setUserId(id);
    setStoredUserId(id);
  }, []);

  const clearUser = useCallback(() => {
    setUserId(null);
    clearStoredUserId();
  }, []);

  return { userId, setUser, clearUser };
};

export const useProgress = (userId: UserId | null) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [allProgress, setAllProgress] = useState<Record<
    UserId,
    UserProgress
  > | null>(null);

  const refresh = useCallback(() => {
    if (userId) {
      setProgress(getProgress(userId));
    } else {
      setProgress(null);
    }
    setAllProgress(getAllProgress());
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Keep every mounted consumer in sync (profile switches + Tester resets).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => refresh();
    window.addEventListener(PROGRESS_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  const completeLesson = useCallback(
    (lessonId: string) => {
      if (!userId) return;
      const updated = markLessonComplete(userId, lessonId);
      setProgress(updated);
    },
    [userId],
  );

  const setQuizScore = useCallback(
    (lessonId: string, score: number) => {
      if (!userId) return;
      const updated = saveQuizScore(userId, lessonId, score);
      setProgress(updated);
    },
    [userId],
  );

  const setCodeDraft = useCallback(
    (lessonId: string, code: string) => {
      if (!userId) return;
      const updated = saveCodeDraft(userId, lessonId, code);
      setProgress(updated);
    },
    [userId],
  );

  const saveCurrentProgress = useCallback(
    (updated: UserProgress) => {
      if (!userId) return;
      saveProgress(userId, updated);
      setProgress({ ...updated });
    },
    [userId],
  );

  /**
   * Reset progress for the current profile (or a specific profile).
   * Available to the Tester profile from the dashboard / navigation.
   */
  const resetProgress = useCallback(
    (targetId?: UserId) => {
      const target = targetId ?? userId;
      if (!target) return;
      const fresh = resetProgressStorage(target);
      if (target === userId) {
        setProgress(fresh);
      }
      setAllProgress(getAllProgress());
    },
    [userId],
  );

  const resetLesson = useCallback(
    (lessonId: string, targetId?: UserId) => {
      const target = targetId ?? userId;
      if (!target) return;
      const updated = resetLessonProgressStorage(target, lessonId);
      if (target === userId) {
        setProgress({ ...updated });
      }
      setAllProgress(getAllProgress());
    },
    [userId],
  );

  const resetAll = useCallback(() => {
    resetAllProgressStorage();
    setProgress(userId ? createEmptyProgress() : null);
    setAllProgress(getAllProgress());
  }, [userId]);

  return {
    progress,
    allProgress,
    completeLesson,
    setQuizScore,
    setCodeDraft,
    saveCurrentProgress,
    resetProgress,
    resetLesson,
    resetAll,
    refreshProgress: refresh,
  };
};
