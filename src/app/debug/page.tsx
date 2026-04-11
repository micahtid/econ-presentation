"use client";

import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import EventScreen from "@/components/game/EventScreen";
import MonthEndScreen from "@/components/game/MonthEndScreen";
import WaitingScreen from "@/components/game/WaitingScreen";
import ResultsScreen from "@/components/game/ResultsScreen";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_RESULTS = {
  totalPlayers: 24,
  finishedCount: 24,
  childLaborCount: 15,
  negativeNoLabor: 6,
  playerList: [
    { username: "Alice", childStatus: "working", balance: 25, scenario: 2 },
    { username: "Marco", childStatus: "working", balance: 15, scenario: 3 },
    { username: "Priya", childStatus: "trained", balance: -20, scenario: 4 },
    { username: "Chen", childStatus: "school", balance: -35, scenario: 1 },
    { username: "Fatima", childStatus: "working", balance: 10, scenario: 5 },
    { username: "David", childStatus: "school", balance: -55, scenario: 1 },
    { username: "Yuki", childStatus: "trained", balance: -40, scenario: 2 },
    { username: "Lena", childStatus: "working", balance: 0, scenario: 3 },
  ],
};

const MOCK_HOST_PLAYERS = [
  { _id: "p1", username: "Alice", isFinished: true, currentEvent: 7, childStatus: "working" },
  { _id: "p2", username: "Marco", isFinished: true, currentEvent: 7, childStatus: "school" },
  { _id: "p3", username: "Priya", isFinished: false, currentEvent: 4, childStatus: "school" },
  { _id: "p4", username: "Chen", isFinished: false, currentEvent: 2, childStatus: "school" },
  { _id: "p5", username: "Fatima", isFinished: true, currentEvent: 7, childStatus: "working" },
  { _id: "p6", username: "David", isFinished: false, currentEvent: 5, childStatus: "working" },
];

// ─── Inline mock screens ──────────────────────────────────────────────────────

function MockLandingPage() {
  return (
    <div style={{ minHeight: "100%", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "680px", width: "100%", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "36px", textAlign: "center" }}>
        <p style={{ fontSize: "14px", fontWeight: 600, lineHeight: "20px", color: "#aaaaaa", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
          Economics Presentation
        </p>
        <h1 style={{ fontSize: "clamp(32px, 6.8vw, 52px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#111111", margin: 0 }}>
          Economics Simulation
        </h1>
        <p style={{ fontSize: "16px", fontWeight: 400, lineHeight: "24px", letterSpacing: "0.32px", color: "#666666", maxWidth: "400px", margin: 0 }}>
          A live multiplayer simulation for presentations. Explore how extreme poverty forces families into impossible choices.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "340px", margin: 0 }}>
          <div className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>Host a Session</div>
          <div className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>Join as Player</div>
        </div>
      </div>
    </div>
  );
}

function MockJoinPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Join Simulation</h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          Enter the room code your host shared with you.
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Room Code</label>
            <div className="w-full border-2 border-gray-900 rounded-xl px-4 py-3 text-center text-2xl font-bold  tracking-[0.2em] text-gray-900">
              AB3K7Q
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
            <div className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-400">
              Enter a username
            </div>
          </div>
          <div className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold text-base text-center">
            Join Room
          </div>
        </div>
      </div>
    </div>
  );
}

function MockHostLobby() {
  return (
    <div style={{ minHeight: "100%", background: "#ffffff", position: "relative" }}>
      {/* Scrollable content */}
      <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: "32px", paddingBottom: "120px" }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: "15px", fontWeight: 700, color: "#111111", margin: "0 0 2px 0" }}>Economics Simulation</h1>
          <p style={{ fontSize: "12px", color: "#aaaaaa", margin: 0 }}>
            Host Dashboard · Room <span style={{ fontWeight: 700, color: "#111111" }}>AB3K7Q</span>
          </p>
        </div>

        {/* QR + code card */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "28px 20px", border: "1px solid #eeeeee", borderRadius: "20px", background: "#fafafa" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#aaaaaa", margin: 0 }}>
            Scan to Join
          </p>
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "14px", boxShadow: "rgba(0,0,0,0.06) 0px 2px 12px 0px" }}>
            <div style={{ width: "140px", height: "140px", background: "#f0f0f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "11px", color: "#bbbbbb", textAlign: "center", lineHeight: 1.5 }}>QR at runtime</span>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "0.15em", color: "#111111", lineHeight: 1, margin: "0 0 8px 0" }}>AB3K7Q</p>
            <p style={{ fontSize: "11px", color: "#bbbbbb", margin: 0 }}>yourapp.vercel.app/join?code=AB3K7Q</p>
          </div>
        </div>

        {/* Player list */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111111", margin: 0 }}>Players Joined</h3>
            {/* Circle badge */}
            <span style={{ background: "#111111", color: "#ffffff", fontSize: "12px", fontWeight: 700, width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>6</span>
          </div>
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px", margin: 0, padding: 0, listStyle: "none" }}>
            {MOCK_HOST_PLAYERS.map((p) => (
              <li key={p._id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", border: "1px solid #f0f0f0", borderRadius: "12px", background: "#ffffff" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#111111" }}>{p.username}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pinned footer inside phone frame */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none" }}>
        <div style={{ height: "56px", background: "linear-gradient(to bottom, transparent, #ffffff)" }} />
        <div style={{ background: "#ffffff", padding: "0 16px 28px", pointerEvents: "all" }}>
          <div className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Start Simulation
          </div>
        </div>
      </div>
    </div>
  );
}

function MockHostMonitor() {
  const finished = MOCK_HOST_PLAYERS.filter((p) => p.isFinished).length;
  const total = MOCK_HOST_PLAYERS.length;
  const pct = Math.round((finished / total) * 100);

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="mb-6">
        <h1 className="text-base font-bold text-gray-900">Economics Simulation</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Host Dashboard · Room <span className=" font-bold text-gray-900">AB3K7Q</span>
        </p>
      </div>

      <div className="flex items-end justify-between mb-2">
        <h3 className="text-base font-bold text-gray-900">Progress</h3>
        <span className="text-2xl font-bold text-gray-900 tabular-nums">{finished}/{total}</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-gray-900 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-sm text-gray-500 mb-5">{pct}% finished</p>

      <div className="btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: "24px" }}>
        {pct === 100 ? "Reveal Results" : `Reveal (${pct}% Done)`}
      </div>

      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Player Status</h3>
      <div className="space-y-2">
        {MOCK_HOST_PLAYERS.map((p) => (
          <div key={p._id} className="flex items-center justify-between border border-gray-100 rounded-xl px-3 py-2.5">
            <span className="font-medium text-gray-900 text-sm">{p.username}</span>
            <div className="flex items-center gap-2">
              {p.isFinished ? (
                <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full">Finished</span>
              ) : (
                <span className="text-xs bg-gray-50 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                  Month {Math.max(1, p.currentEvent - 1)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Frame definitions ────────────────────────────────────────────────────────

type Frame = {
  title: string;
  tag: string;
  render: () => React.ReactNode;
};

const FRAMES: Frame[] = [
  // ── Landing ──────────────────────────────────────────────────────
  {
    title: "Landing Page",
    tag: "Home",
    render: () => <MockLandingPage />,
  },
  // ── Host flow ─────────────────────────────────────────────────────
  {
    title: "Host: Lobby",
    tag: "Host",
    render: () => <MockHostLobby />,
  },
  // ── Player join ───────────────────────────────────────────────────
  {
    title: "Join: Enter Code + Name",
    tag: "Join",
    render: () => <MockJoinPage />,
  },
  {
    title: "Waiting: Host hasn't started yet",
    tag: "Wait",
    render: () => (
      <WaitingScreen message="Waiting for the host to begin" subMessage="Joined as TestPlayer" />
    ),
  },
  // ── Host monitors game ────────────────────────────────────────────
  {
    title: "Host: Game Monitor",
    tag: "Host",
    render: () => <MockHostMonitor />,
  },
  // ── Events & month-end summaries ──────────────────────────────────
  // Event 1 — three child statuses
  {
    title: "Event 1 · Waterborne Illness (school)",
    tag: "Ev 1",
    render: () => (
      <EventScreen playerId="mock" eventNumber={1} childStatus="school"
        scenario={1} balance={0} monthlyIncome={40} monthlyExpenses={35}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 1 · Waterborne Illness (working)",
    tag: "Ev 1",
    render: () => (
      <EventScreen playerId="mock" eventNumber={1} childStatus="working"
        scenario={1} balance={0} monthlyIncome={55} monthlyExpenses={35}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Month End 1 · Paid for medicine",
    tag: "ME 1",
    render: () => (
      <MonthEndScreen playerId="mock" eventNumber={1}
        prevBalance={0} monthlyIncome={40} monthlyExpenses={35}
        eventDelta={-10} newBalance={-5} onAdvance={() => {}} />
    ),
  },
  // Event 2 — three child statuses
  {
    title: "Event 2 · Food Prices Double (school)",
    tag: "Ev 2",
    render: () => (
      <EventScreen playerId="mock" eventNumber={2} childStatus="school"
        scenario={1} balance={-5} monthlyIncome={40} monthlyExpenses={35}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 2 · Food Prices Double (working)",
    tag: "Ev 2",
    render: () => (
      <EventScreen playerId="mock" eventNumber={2} childStatus="working"
        scenario={1} balance={15} monthlyIncome={55} monthlyExpenses={35}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Month End 2 · Took high-interest loan",
    tag: "ME 2",
    render: () => (
      <MonthEndScreen playerId="mock" eventNumber={2}
        prevBalance={-5} monthlyIncome={40} monthlyExpenses={45}
        eventDelta={10} newBalance={0} onAdvance={() => {}} />
    ),
  },
  // Event 3 — three child statuses
  {
    title: "Event 3 · Lost Work (school)",
    tag: "Ev 3",
    render: () => (
      <EventScreen playerId="mock" eventNumber={3} childStatus="school"
        scenario={1} balance={0} monthlyIncome={40} monthlyExpenses={45}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 3 · Lost Work (working)",
    tag: "Ev 3",
    render: () => (
      <EventScreen playerId="mock" eventNumber={3} childStatus="working"
        scenario={1} balance={30} monthlyIncome={55} monthlyExpenses={45}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 3 · Lost Work (trained)",
    tag: "Ev 3",
    render: () => (
      <EventScreen playerId="mock" eventNumber={3} childStatus="trained"
        scenario={1} balance={-20} monthlyIncome={40} monthlyExpenses={45}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Month End 3 · Borrowed from employer",
    tag: "ME 3",
    render: () => (
      <MonthEndScreen playerId="mock" eventNumber={3}
        prevBalance={0} monthlyIncome={40} monthlyExpenses={55}
        eventDelta={-20} newBalance={-35} onAdvance={() => {}} />
    ),
  },
  // Event 4 — three child statuses
  {
    title: "Event 4 · Vocational Training (school)",
    tag: "Ev 4",
    render: () => (
      <EventScreen playerId="mock" eventNumber={4} childStatus="school"
        scenario={1} balance={-35} monthlyIncome={40} monthlyExpenses={55}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 4 · Vocational Training (working)",
    tag: "Ev 4",
    render: () => (
      <EventScreen playerId="mock" eventNumber={4} childStatus="working"
        scenario={1} balance={10} monthlyIncome={55} monthlyExpenses={55}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 4 · Vocational Training (trained)",
    tag: "Ev 4",
    render: () => (
      <EventScreen playerId="mock" eventNumber={4} childStatus="trained"
        scenario={1} balance={-35} monthlyIncome={40} monthlyExpenses={55}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Month End 4 · Enrolled child in training",
    tag: "ME 4",
    render: () => (
      <MonthEndScreen playerId="mock" eventNumber={4}
        prevBalance={-35} monthlyIncome={40} monthlyExpenses={55}
        eventDelta={0} newBalance={-50} onAdvance={() => {}} />
    ),
  },
  // Event 5 — three child statuses
  {
    title: "Event 5 · Catastrophe (school)",
    tag: "Ev 5",
    render: () => (
      <EventScreen playerId="mock" eventNumber={5} childStatus="school"
        scenario={1} balance={-50} monthlyIncome={40} monthlyExpenses={55}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 5 · Catastrophe (working)",
    tag: "Ev 5",
    render: () => (
      <EventScreen playerId="mock" eventNumber={5} childStatus="working"
        scenario={1} balance={20} monthlyIncome={55} monthlyExpenses={55}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 5 · Catastrophe (trained)",
    tag: "Ev 5",
    render: () => (
      <EventScreen playerId="mock" eventNumber={5} childStatus="trained"
        scenario={1} balance={-50} monthlyIncome={40} monthlyExpenses={55}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Month End 5 · Took massive debt",
    tag: "ME 5",
    render: () => (
      <MonthEndScreen playerId="mock" eventNumber={5}
        prevBalance={-50} monthlyIncome={40} monthlyExpenses={75}
        eventDelta={0} newBalance={-85} onAdvance={() => {}} />
    ),
  },
  // Event 6 — three child statuses
  {
    title: "Event 6 · The Long Term (school)",
    tag: "Ev 6",
    render: () => (
      <EventScreen playerId="mock" eventNumber={6} childStatus="school"
        scenario={1} balance={-85} monthlyIncome={40} monthlyExpenses={75}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 6 · The Long Term (working)",
    tag: "Ev 6",
    render: () => (
      <EventScreen playerId="mock" eventNumber={6} childStatus="working"
        scenario={1} balance={50} monthlyIncome={55} monthlyExpenses={75}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 6 · The Long Term (trained)",
    tag: "Ev 6",
    render: () => (
      <EventScreen playerId="mock" eventNumber={6} childStatus="trained"
        scenario={1} balance={-85} monthlyIncome={40} monthlyExpenses={75}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  // ── End of game ───────────────────────────────────────────────────
  {
    title: "Waiting: Game finished, waiting for reveal",
    tag: "Wait",
    render: () => (
      <WaitingScreen message="You're done!" subMessage="Waiting for everyone else to finish…" />
    ),
  },
  {
    title: "Results: Player View",
    tag: "Results",
    render: () => <ResultsScreen results={MOCK_RESULTS} />,
  },
  {
    title: "Host: Results Dashboard",
    tag: "Host",
    render: () => <ResultsScreen results={MOCK_RESULTS} isHost />,
  },
];

// ─── Debug Page ───────────────────────────────────────────────────────────────

export default function DebugPage() {
  const [index, setIndex] = useState(0);

  const frame = FRAMES[index];
  const total = FRAMES.length;

  const goNext = () => setIndex((i) => Math.min(i + 1, total - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Nav bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 bg-gray-700 text-gray-300">
            {frame.tag}
          </span>
          <span className="text-sm text-white font-medium truncate">{frame.title}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous (←)"
          >
            <LuChevronLeft size={18} />
          </button>
          <span className="text-xs text-gray-400 tabular-nums w-14 text-center">
            {index + 1} / {total}
          </span>
          <button
            onClick={goNext}
            disabled={index === total - 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Next (→)"
          >
            <LuChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Frame strip */}
      <div className="flex-shrink-0 overflow-x-auto bg-gray-900 border-b border-gray-800">
        <div className="flex gap-1 px-3 py-2 min-w-max">
          {FRAMES.map((f, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              title={f.title}
              className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                i === index
                  ? "bg-white text-gray-900"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="flex-shrink-0 w-[390px]">
          {/* Phone frame */}
          <div
            className="relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-700 shadow-2xl"
            style={{ height: "780px" }}
          >
            {/* Fake status bar */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-white z-10 flex items-center justify-between px-6 border-b border-gray-100">
              <span className="text-[10px] text-gray-500 font-medium">9:41</span>
              <span className="text-[10px] text-gray-500">●●●</span>
            </div>
            {/* Scrollable content */}
            <div className="absolute inset-0 top-6 overflow-y-auto">
              {frame.render()}
            </div>
          </div>
          <p className="text-center text-gray-600 text-xs mt-3 flex items-center justify-center gap-1">
            <LuChevronLeft size={12} /><LuChevronRight size={12} /> arrow keys · click frame numbers to jump
          </p>
        </div>
      </div>
    </div>
  );
}
