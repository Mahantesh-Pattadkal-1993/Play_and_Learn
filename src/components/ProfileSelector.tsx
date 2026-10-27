"use client";

import { UserId } from "@/lib/types";
import { USERS_LIST } from "@/lib/users";

interface ProfileSelectorProps {
  onSelect: (userId: UserId) => void;
  selected?: UserId | null;
}

export default function ProfileSelector({
  onSelect,
  selected,
}: ProfileSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 justify-center">
      {USERS_LIST.map((user) => {
        const isSelected = selected === user.id;
        const isTester = user.role === "tester";
        const accent = isTester
          ? "border-emerald-500/60 hover:border-emerald-400"
          : "border-slate-600 hover:border-indigo-400";
        return (
          <button
            key={user.id}
            type="button"
            onClick={() => onSelect(user.id)}
            className={`group relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 
              ${isSelected
                ? "border-indigo-400 shadow-2xl scale-105"
                : `${accent} hover:scale-105`
              }
              bg-gradient-to-br from-slate-800 to-slate-900`}
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                isTester
                  ? "bg-gradient-to-br from-emerald-500/10 to-cyan-500/10"
                  : "bg-gradient-to-br from-indigo-500/10 to-pink-500/10"
              }`}
            />

            <span
              className={`absolute top-3 right-3 z-10 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isTester
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-700/70 text-slate-300 border border-slate-600"
              }`}
            >
              {isTester ? "🧪 Tester" : "Learner"}
            </span>

            <div className="relative z-10 flex flex-col items-center">
              <span className="text-5xl mb-3 drop-shadow-lg">{user.avatar}</span>
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{user.level}</p>
              <p className="text-xs text-slate-500 mt-2 text-center min-h-[2rem]">
                {user.tagline}
              </p>
              <div
                className={`mt-3 px-4 py-2 rounded-full text-xs ${
                  isTester
                    ? "bg-emerald-600/20 text-emerald-200"
                    : "bg-slate-700/50 text-slate-300"
                }`}
              >
                Continue as{" "}
                <span className="font-semibold text-white">{user.name}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
