/**
 * Type definitions for the Play and Learn platform.
 */

export type UserId = "shweta" | "raj" | "tester";

export type UserRole = "learner" | "tester";

export interface User {
  id: UserId;
  name: string;
  avatar: string;
  level: string;
  color: string;
  role: UserRole;
  tagline: string;
  canResetProgress: boolean;
}

export type QuestionType = "single" | "multiple";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndices: number[];
  explanation: string;
  type: QuestionType;
}

export interface TestCase {
  description: string;
  code: string; // JS code snippet to run inside the sandbox
  expected: string; // What to match in stdout
}

export interface CodingTask {
  description: string;
  starterCode: string;
  solution: string;
  tests: TestCase[];
}

export interface CodeExample {
  language: "typescript";
  code: string;
  description: string;
}

export interface Diagram {
  type: "mermaid";
  chart: string;
  altText: string;
}

export interface Analogy {
  title: string;
  description: string;
  visual: string; // emoji key
}

export interface Lesson {
  id: string; // e.g. "1.1"
  moduleId: string; // e.g. "1"
  title: string;
  slug: string;
  duration: string;
  description: string;
  analogy: Analogy;
  diagram: Diagram;
  codeExample: CodeExample;
  quiz: QuizQuestion[];
  codingTask: CodingTask;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface UserProgress {
  completedLessons: string[];
  quizScores: Record<string, number>; // lessonId → score (0–100)
  codeDrafts: Record<string, string>; // lessonId → saved code
  currentLessonId: string | null;
}
