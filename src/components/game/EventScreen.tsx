"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  EVENTS,
  SCENARIOS,
  getVisibleOptions,
  getContextNote,
  type ChildStatus,
  type OptionKey,
} from "@/lib/gameConstants";

interface Props {
  playerId: string;
  eventNumber: number;
  childStatus: ChildStatus;
  scenario: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  /** Debug override: called instead of the Convex mutation */
  onChoice?: (key: OptionKey) => void;
  /** Debug: disable the 30s auto-submit so the timer counts down but doesn't fire */
  noAutoSubmit?: boolean;
}

const TIMER_SECONDS = 35;

const CHILD_STATUS_LABEL: Record<ChildStatus, string> = {
  school: "In School",
  working: "Working",
  trained: "In Training",
};

export default function EventScreen({
  playerId,
  eventNumber,
  childStatus,
  scenario,
  balance,
  monthlyIncome,
  monthlyExpenses,
  onChoice,
  noAutoSubmit,
}: Props) {
  const [timerPct, setTimerPct] = useState(100);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [submitting, setSubmitting] = useState(false);
  const submitChoice = useMutation(api.players.submitChoice);
  const hasSubmittedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const event = EVENTS[eventNumber - 1];
  const scenarioData = SCENARIOS[scenario - 1];
  const visibleOptions = event ? getVisibleOptions(event, childStatus) : [];
  const contextNote = getContextNote(eventNumber, childStatus, balance, monthlyExpenses, scenario);

  const handleChoice = async (optionKey: OptionKey) => {
    if (hasSubmittedRef.current || submitting) return;
    hasSubmittedRef.current = true;
    setSubmitting(true);
    if (onChoice) {
      onChoice(optionKey);
      return;
    }
    try {
      await submitChoice({
        playerId: playerId as Id<"players">,
        eventNumber,
        optionKey,
      });
    } catch {
      hasSubmittedRef.current = false;
      setSubmitting(false);
    }
  };

  // Keep a ref so the RAF callback always has fresh access to visibleOptions/noAutoSubmit
  const autoSubmitRef = useRef(() => {});
  autoSubmitRef.current = () => {
    if (!hasSubmittedRef.current && visibleOptions.length > 0 && !noAutoSubmit) {
      handleChoice(visibleOptions[0].key);
    }
  };

  // Smooth countdown using requestAnimationFrame
  useEffect(() => {
    hasSubmittedRef.current = false;
    setSubmitting(false);
    setTimerPct(100);
    setSecondsLeft(TIMER_SECONDS);

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const remaining = Math.max(0, TIMER_SECONDS - elapsed);
      setTimerPct((remaining / TIMER_SECONDS) * 100);
      setSecondsLeft(Math.ceil(remaining));

      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        autoSubmitRef.current();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventNumber]);

  if (!event) return null;

  const timerColor =
    secondsLeft > 15
      ? "#111111"
      : secondsLeft > 7
        ? "#f59e0b"
        : "#dc2626";

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Stats header ──────────────────────────────────────────── */}
      {scenarioData && (
        <div style={{ borderBottom: "1px solid #eeeeee", padding: "20px 20px 24px" }}>
          {/* Location */}
          <p style={{ fontSize: "13px", fontWeight: 500, color: "#999999", marginBottom: "18px", margin: "0 0 18px 0" }}>
            {scenarioData.location}
          </p>
          {/* 2×2 stat grid — value above label */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: "18px", columnGap: "24px" }}>
            {[
              { label: "Balance", value: `$${balance}`, danger: balance < 0 },
              { label: "Income", value: `$${monthlyIncome}/mo`, danger: false },
              { label: "Expenses", value: `$${monthlyExpenses}/mo`, danger: false },
              { label: "Child", value: CHILD_STATUS_LABEL[childStatus], danger: false },
            ].map(({ label, value, danger }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "17px", fontWeight: 700, color: danger ? "#dc2626" : "#111111", lineHeight: 1 }}>
                  {value}
                </span>
                <span style={{ fontSize: "11px", fontWeight: 500, color: "#bbbbbb", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Smooth timer bar ──────────────────────────────────────── */}
      <div style={{ height: "3px", background: "#f0f0f0" }}>
        <div
          style={{
            height: "100%",
            width: `${timerPct}%`,
            background: timerColor,
            transition: "background-color 0.5s ease",
          }}
        />
      </div>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col px-5 py-7 max-w-lg mx-auto w-full">

        {/* Event header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#aaaaaa" }}>
              Month {eventNumber}
            </span>
            <span style={{ fontSize: "13px", fontWeight: 700, fontVariantNumeric: "tabular-nums", color: secondsLeft <= 7 ? "#dc2626" : "#999999" }}>
              {secondsLeft}s
            </span>
          </div>

          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111111", lineHeight: 1.25, marginBottom: contextNote ? "8px" : "12px" }}>
            {event.title}
          </h2>

          {contextNote && (
            <p style={{ fontSize: "13px", color: "#999999", lineHeight: "1.55", margin: "0 0 12px 0", fontStyle: "italic" }}>
              {contextNote}
            </p>
          )}

          <p style={{ fontSize: "15px", color: "#444444", lineHeight: "1.6", margin: 0 }}>
            {event.description}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {visibleOptions.map((opt, i) => (
            <button
              key={opt.key}
              onClick={() => handleChoice(opt.key)}
              disabled={submitting}
              style={{
                width: "100%",
                height: "106px",
                textAlign: "left",
                border: "1.5px solid #e5e5e5",
                borderRadius: "14px",
                padding: "0 18px",
                background: "#ffffff",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.5 : 1,
                transition: "border-color 0.15s ease, background 0.15s ease",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#111111";
                  (e.currentTarget as HTMLButtonElement).style.background = "#fafafa";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e5e5";
                (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%" }}>
                {/* Letter badge — sequential A/B/C/D regardless of underlying option key */}
                <span style={{
                  flexShrink: 0,
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#111111",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
                  <p style={{
                    fontWeight: 600,
                    color: "#111111",
                    fontSize: "14px",
                    lineHeight: 1.35,
                    margin: 0,
                  }}>
                    {opt.label}
                  </p>
                  <p style={{
                    fontSize: "12px",
                    color: "#888888",
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    {opt.effect.split("; ").map((part, i) => (
                      <span key={i} style={{ display: "block" }}>{part}</span>
                    ))}
                  </p>
                </div>
              </div>
            </button>
          ))}

          {visibleOptions.length === 0 && (
            <p style={{ color: "#bbbbbb", fontSize: "14px", textAlign: "center", padding: "16px 0" }}>
              No options available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
