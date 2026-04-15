"use client";

import { useEffect, useRef, useState } from "react";
import { SCENARIOS } from "@/lib/gameConstants";

interface Props {
  scenarioId: number;
  /** Called when the full intro sequence completes */
  onDone: () => void;
  /** Debug: durations in seconds. Defaults: scenario=10, goal=5 */
  scenarioDuration?: number;
  goalDuration?: number;
}

type Phase = "scenario" | "goal";

export default function GameIntroScreen({
  scenarioId,
  onDone,
  scenarioDuration = 10,
  goalDuration = 5,
}: Props) {
  const scenario = SCENARIOS[scenarioId - 1];
  const [phase, setPhase] = useState<Phase>("scenario");
  const [secondsLeft, setSecondsLeft] = useState(scenarioDuration);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    setPhase("scenario");
    setSecondsLeft(scenarioDuration);
  }, [scenarioId, scenarioDuration]);

  useEffect(() => {
    setSecondsLeft(phase === "scenario" ? scenarioDuration : goalDuration);
    const duration = phase === "scenario" ? scenarioDuration : goalDuration;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (phase === "scenario") {
            setPhase("goal");
          } else if (!doneRef.current) {
            doneRef.current = true;
            onDone();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!scenario) return null;

  if (phase === "scenario") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#aaaaaa", textAlign: "center", marginBottom: "10px" }}>
            Your Story
          </p>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#111111", textAlign: "center", lineHeight: 1.2, marginBottom: "6px" }}>
            {scenario.name}
          </h2>
          <p style={{ fontSize: "13px", color: "#aaaaaa", textAlign: "center", marginBottom: "28px" }}>
            {scenario.location}
          </p>

          <p style={{ fontSize: "15px", color: "#444444", lineHeight: "1.65", textAlign: "center", marginBottom: "28px" }}>
            {scenario.description}
          </p>

          {/* Income / Expenses */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
            {[
              { label: "Monthly Income", value: `$${scenario.income}` },
              { label: "Monthly Expenses", value: `$${scenario.expenses}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ border: "1px solid #eeeeee", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                <p style={{ fontSize: "22px", fontWeight: 700, color: "#111111", margin: "0 0 4px 0" }}>{value}</p>
                <p style={{ fontSize: "11px", fontWeight: 500, color: "#bbbbbb", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", color: "#bbbbbb", fontSize: "13px" }}>
            Starting in <span style={{ fontWeight: 700, color: "#888888" }}>{secondsLeft}s</span>
          </p>
        </div>
      </div>
    );
  }

  // Goal screen
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#aaaaaa", marginBottom: "16px" }}>
          Your Goal
        </p>
        <h2 style={{ fontSize: "36px", fontWeight: 700, color: "#111111", lineHeight: 1.2, marginBottom: "16px" }}>
          Stay Out of Debt
        </h2>
        <p style={{ fontSize: "15px", color: "#666666", lineHeight: "1.65", marginBottom: "32px" }}>
          You will face six crises. Every decision affects your balance, income, and expenses — and some choices cannot be undone.
        </p>
        <p style={{ textAlign: "center", color: "#bbbbbb", fontSize: "13px" }}>
          Starting in <span style={{ fontWeight: 700, color: "#888888" }}>{secondsLeft}s</span>
        </p>
      </div>
    </div>
  );
}
