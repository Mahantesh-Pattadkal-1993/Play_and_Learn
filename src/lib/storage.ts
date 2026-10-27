import { UserProgress, UserId } from "./types";

const STORAGE_KEY = "playandlearn_progress";
const USER_KEY = "playandlearn_current_user";

/** All profiles supported by the platform (learners + tester). */
export const ALL_USER_IDS: UserId[] = ["shweta", "raj", "tester"];

/** Event dispatched after any progress mutation so every mounted component refreshes. */
export const PROGRESS_EVENT = "playandlearn:progress-updated";

export const createEmptyProgress = (): UserProgress => ({
  completedLessons: [],
  quizScores: {},
  codeDrafts: {},
  currentLessonId: null,
});

const notifyProgressChange = (): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PROGRESS_EVENT));
};

export const getProgress = (userId: UserId): UserProgress => {
  if (typeof window === "undefined") return createEmptyProgress();
  const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
  if (!raw) return createEmptyProgress();
  try {
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      ...createEmptyProgress(),
      ...parsed,
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons
        : [],
      quizScores: parsed.quizScores ?? {},
      codeDrafts: parsed.codeDrafts ?? {},
    };
  } catch {
    return createEmptyProgress();
  }
};

export const saveProgress = (userId: UserId, progress: UserProgress): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(progress));
  notifyProgressChange();
};

/** Snapshot of every profile's progress (used by the Tester tools panel). */
export const getAllProgress = (): Record<UserId, UserProgress> => {
  return ALL_USER_IDS.reduce((acc, id) => {
    acc[id] = getProgress(id);
    return acc;
  }, {} as Record<UserId, UserProgress>);
};

/**
 * Reset a single profile's progress. Returns the fresh, empty progress object.
 * Used by the Tester profile to wipe its own data or a learner's data.
 */
export const resetProgress = (userId: UserId): UserProgress => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${STORAGE_KEY}_${userId}`);
  }
  notifyProgressChange();
  return createEmptyProgress();
};

/** Reset progress for every profile at once. */
export const resetAllProgress = (): void => {
  if (typeof window === "undefined") return;
  ALL_USER_IDS.forEach((id) => localStorage.removeItem(`${STORAGE_KEY}_${id}`));
  notifyProgressChange();
};

/**
 * Reset a single lesson for a profile: removes completion, quiz score and draft.
 */
export const resetLessonProgress = (
  userId: UserId,
  lessonId: string,
): UserProgress => {
  const progress = getProgress(userId);
  progress.completedLessons = progress.completedLessons.filter(
    (id) => id !== lessonId,
  );
  delete progress.quizScores[lessonId];
  delete progress.codeDrafts[lessonId];
  saveProgress(userId, progress);
  return progress;
};

export const getStoredUserId = (): UserId | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return ALL_USER_IDS.includes(raw as UserId) ? (raw as UserId) : null;
};

export const setStoredUserId = (userId: UserId): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, userId);
};

export const clearStoredUserId = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
};

// Helpers for updating specific progress fields
export const markLessonComplete = (
  userId: UserId,
  lessonId: string,
): UserProgress => {
  const progress = getProgress(userId);
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  saveProgress(userId, progress);
  return progress;
};

export const saveQuizScore = (
  userId: UserId,
  lessonId: string,
  score: number,
): UserProgress => {
  const progress = getProgress(userId);
  progress.quizScores[lessonId] = score;
  saveProgress(userId, progress);
  return progress;
};

export const saveCodeDraft = (
  userId: UserId,
  lessonId: string,
  code: string,
): UserProgress => {
  const progress = getProgress(userId);
  progress.codeDrafts[lessonId] = code;
  saveProgress(userId, progress);
  return progress;
};
