import { User, UserId } from "./types";

export const USERS: Record<UserId, User> = {
  shweta: {
    id: "shweta",
    name: "Shweta",
    avatar: "👩‍💻",
    level: "Beginner",
    color: "purple",
    role: "learner",
    tagline: "TypeScript & Playwright from scratch",
    canResetProgress: false,
  },
  raj: {
    id: "raj",
    name: "Raj",
    avatar: "👨‍💻",
    level: "Beginner",
    color: "blue",
    role: "learner",
    tagline: "TypeScript & Playwright from scratch",
    canResetProgress: false,
  },
  tester: {
    id: "tester",
    name: "Tester",
    avatar: "🧪",
    level: "QA / Evaluator",
    color: "emerald",
    role: "tester",
    tagline: "Test any module • inspect & reset progress",
    canResetProgress: true,
  },
};

export const USERS_LIST: User[] = Object.values(USERS);

export const getUser = (id: UserId): User => USERS[id];
