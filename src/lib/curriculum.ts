/**
 * Central curriculum index — combines all modules.
 */
import { Module, Lesson } from "./types";
import { module1 } from "./curriculum.module1";
import { module2 } from "./curriculum.module2";
import { module3 } from "./curriculum.module3";
import { module4 } from "./curriculum.module4";
import { module5 } from "./curriculum.module5";
import { module6 } from "./curriculum.module6";
import { module7 } from "./curriculum.module7";

export const CURRICULUM: Module[] = [
  module1,
  module2,
  module3,
  module4,
  module5,
  module6,
  module7,
];

export const TOTAL_LESSONS = CURRICULUM.reduce(
  (sum, mod) => sum + mod.lessons.length,
  0,
);

export const getModule = (id: string): Module | undefined =>
  CURRICULUM.find((m) => m.id === id);

export const getLesson = (id: string): Lesson | undefined => {
  for (const mod of CURRICULUM) {
    const found = mod.lessons.find((l) => l.id === id);
    if (found) return found;
  }
  return undefined;
};

