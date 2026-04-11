"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface Props {
  playerId: string;
  eventNumber: number; // the event that just completed (1–5)
  prevBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  eventDelta: number;
  newBalance: number;
  /** Debug override: called instead of the Convex mutation */
  onAdvance?: () => void;
}

const DISPLAY_SECONDS = 5;

export default function MonthEndScreen({
  playerId,
  eventNumber,
  prevBalance,
  monthlyIncome,
  monthlyExpenses,
  eventDelta,
  newBalance,
  onAdvance,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState(DISPLAY_SECONDS);
  const advancePhase = useMutation(api.players.advancePhase);

  useEffect(() => {
    setSecondsLeft(DISPLAY_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onAdvance) {
            onAdvance();
          } else {
            advancePhase({ playerId: playerId as Id<"players"> });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventNumber]);

  const formatAmount = (n: number) =>
    n >= 0 ? `+$${n}` : `–$${Math.abs(n)}`;

  const rows: { label: string; value: number; sign?: boolean }[] = [
    { label: "Previous balance", value: prevBalance },
    { label: "Monthly income", value: monthlyIncome, sign: true },
    { label: "Monthly expenses", value: -monthlyExpenses, sign: true },
    ...(eventDelta !== 0
      ? [{ label: "This month's event", value: eventDelta, sign: true }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 text-center mb-1">
          Month {eventNumber} Summary
        </p>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          End of Month
        </h2>

        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex justify-between items-center px-4 py-3 border-b border-gray-100 last:border-0"
            >
              <span className="text-sm text-gray-600">{row.label}</span>
              <span
                className={`text-sm font-semibold tabular-nums ${
                  row.sign
                    ? row.value >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                    : "text-gray-900"
                }`}
              >
                {row.sign ? formatAmount(row.value) : `$${row.value}`}
              </span>
            </div>
          ))}

          {/* New balance */}
          <div className="flex justify-between items-center px-4 py-4 bg-gray-50 border-t-2 border-gray-900">
            <span className="text-base font-bold text-gray-900">
              New balance
            </span>
            <span
              className={`text-xl font-bold tabular-nums ${
                newBalance < 0 ? "text-red-600" : "text-gray-900"
              }`}
            >
              ${newBalance}
            </span>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Next event in{" "}
          <span className="font-bold text-gray-600">{secondsLeft}</span>s
        </p>
      </div>
    </div>
  );
}
