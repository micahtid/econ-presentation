"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface Player {
  _id: string;
  username: string;
  isFinished: boolean;
  currentEvent: number;
  childStatus: string;
}

interface Props {
  roomId: string;
  players: Player[];
}

const STATUS_LABEL: Record<string, string> = {
  school: "school",
  working: "working",
  trained: "training",
};

export default function GameMonitor({ roomId, players }: Props) {
  const revealResults = useMutation(api.rooms.revealResults);
  const finished = players.filter((p) => p.isFinished).length;
  const total = players.length;
  const pct = total > 0 ? Math.round((finished / total) * 100) : 0;

  const handleReveal = () => {
    revealResults({ roomId: roomId as Id<"rooms"> });
  };

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-end justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">Progress</h3>
          <span className="text-3xl font-bold text-gray-900 tabular-nums">
            {finished}/{total}
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1.5">{pct}% finished</p>
      </div>

      {/* Reveal button */}
      <button
        onClick={handleReveal}
        className="btn-primary"
        style={{ width: "100%", justifyContent: "center" }}
      >
        {pct === 100 ? "Reveal Results" : `Reveal (${pct}% Done)`}
      </button>

      {/* Player status grid */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Player Status
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {players.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
            >
              <span className="font-medium text-gray-900 text-sm truncate max-w-[60%]">
                {p.username}
              </span>
              <div className="flex items-center gap-3 flex-shrink-0">
                {p.isFinished ? (
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full">
                    Finished
                  </span>
                ) : (
                  <span className="text-xs bg-gray-50 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                    Month {p.currentEvent - 1 <= 0 ? 1 : p.currentEvent - 1}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
