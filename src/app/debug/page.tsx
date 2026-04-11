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
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "14px" }}>
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
    title: "Landing",
    tag: "Home",
    render: () => <MockLandingPage />,
  },
  // ── Host flow ─────────────────────────────────────────────────────
  {
    title: "Host Lobby",
    tag: "Host",
    render: () => <MockHostLobby />,
  },
  // ── Player join ───────────────────────────────────────────────────
  {
    title: "Join",
    tag: "Join",
    render: () => <MockJoinPage />,
  },
  {
    title: "Waiting",
    tag: "Wait",
    render: () => (
      <WaitingScreen message="Waiting for the host to begin" subMessage="Joined as TestPlayer" />
    ),
  },
  // ── Host monitors game ────────────────────────────────────────────
  {
    title: "Host Monitor",
    tag: "Host",
    render: () => <MockHostMonitor />,
  },
  // ── Events & month-end summaries ──────────────────────────────────
  // Event 1 — three child statuses
  {
    title: "Event 1",
    tag: "Ev 1",
    render: () => (
      <EventScreen playerId="mock" eventNumber={1} childStatus="school"
        scenario={1} balance={0} monthlyIncome={40} monthlyExpenses={35}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 1",
    tag: "Ev 1",
    render: () => (
      <EventScreen playerId="mock" eventNumber={1} childStatus="working"
        scenario={1} balance={0} monthlyIncome={55} monthlyExpenses={35}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Month End 1",
    tag: "ME 1",
    render: () => (
      <MonthEndScreen playerId="mock" eventNumber={1}
        prevBalance={0} monthlyIncome={40} monthlyExpenses={35}
        eventDelta={-10} newBalance={-5} onAdvance={() => {}} />
    ),
  },
  // Event 2 — three child statuses
  {
    title: "Event 2",
    tag: "Ev 2",
    render: () => (
      <EventScreen playerId="mock" eventNumber={2} childStatus="school"
        scenario={1} balance={-5} monthlyIncome={40} monthlyExpenses={35}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 2",
    tag: "Ev 2",
    render: () => (
      <EventScreen playerId="mock" eventNumber={2} childStatus="working"
        scenario={1} balance={15} monthlyIncome={55} monthlyExpenses={35}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Month End 2",
    tag: "ME 2",
    render: () => (
      <MonthEndScreen playerId="mock" eventNumber={2}
        prevBalance={-5} monthlyIncome={40} monthlyExpenses={45}
        eventDelta={10} newBalance={0} onAdvance={() => {}} />
    ),
  },
  // Event 3 — three child statuses
  {
    title: "Event 3",
    tag: "Ev 3",
    render: () => (
      <EventScreen playerId="mock" eventNumber={3} childStatus="school"
        scenario={1} balance={0} monthlyIncome={40} monthlyExpenses={45}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 3",
    tag: "Ev 3",
    render: () => (
      <EventScreen playerId="mock" eventNumber={3} childStatus="working"
        scenario={1} balance={30} monthlyIncome={55} monthlyExpenses={45}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 3",
    tag: "Ev 3",
    render: () => (
      <EventScreen playerId="mock" eventNumber={3} childStatus="trained"
        scenario={1} balance={-20} monthlyIncome={40} monthlyExpenses={45}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Month End 3",
    tag: "ME 3",
    render: () => (
      <MonthEndScreen playerId="mock" eventNumber={3}
        prevBalance={0} monthlyIncome={40} monthlyExpenses={55}
        eventDelta={-20} newBalance={-35} onAdvance={() => {}} />
    ),
  },
  // Event 4 — three child statuses
  {
    title: "Event 4",
    tag: "Ev 4",
    render: () => (
      <EventScreen playerId="mock" eventNumber={4} childStatus="school"
        scenario={1} balance={-35} monthlyIncome={40} monthlyExpenses={55}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 4",
    tag: "Ev 4",
    render: () => (
      <EventScreen playerId="mock" eventNumber={4} childStatus="working"
        scenario={1} balance={10} monthlyIncome={55} monthlyExpenses={55}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 4",
    tag: "Ev 4",
    render: () => (
      <EventScreen playerId="mock" eventNumber={4} childStatus="trained"
        scenario={1} balance={-35} monthlyIncome={40} monthlyExpenses={55}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Month End 4",
    tag: "ME 4",
    render: () => (
      <MonthEndScreen playerId="mock" eventNumber={4}
        prevBalance={-35} monthlyIncome={40} monthlyExpenses={55}
        eventDelta={0} newBalance={-50} onAdvance={() => {}} />
    ),
  },
  // Event 5 — three child statuses
  {
    title: "Event 5",
    tag: "Ev 5",
    render: () => (
      <EventScreen playerId="mock" eventNumber={5} childStatus="school"
        scenario={1} balance={-50} monthlyIncome={40} monthlyExpenses={55}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 5",
    tag: "Ev 5",
    render: () => (
      <EventScreen playerId="mock" eventNumber={5} childStatus="working"
        scenario={1} balance={20} monthlyIncome={55} monthlyExpenses={55}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 5",
    tag: "Ev 5",
    render: () => (
      <EventScreen playerId="mock" eventNumber={5} childStatus="trained"
        scenario={1} balance={-50} monthlyIncome={40} monthlyExpenses={55}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Month End 5",
    tag: "ME 5",
    render: () => (
      <MonthEndScreen playerId="mock" eventNumber={5}
        prevBalance={-50} monthlyIncome={40} monthlyExpenses={75}
        eventDelta={0} newBalance={-85} onAdvance={() => {}} />
    ),
  },
  // Event 6 — three child statuses
  {
    title: "Event 6",
    tag: "Ev 6",
    render: () => (
      <EventScreen playerId="mock" eventNumber={6} childStatus="school"
        scenario={1} balance={-85} monthlyIncome={40} monthlyExpenses={75}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 6",
    tag: "Ev 6",
    render: () => (
      <EventScreen playerId="mock" eventNumber={6} childStatus="working"
        scenario={1} balance={50} monthlyIncome={55} monthlyExpenses={75}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  {
    title: "Event 6",
    tag: "Ev 6",
    render: () => (
      <EventScreen playerId="mock" eventNumber={6} childStatus="trained"
        scenario={1} balance={-85} monthlyIncome={40} monthlyExpenses={75}
        onChoice={() => {}} noAutoSubmit />
    ),
  },
  // ── End of game ───────────────────────────────────────────────────
  {
    title: "Waiting",
    tag: "Wait",
    render: () => (
      <WaitingScreen message="You're done!" subMessage="Waiting for everyone else to finish…" />
    ),
  },
  {
    title: "Results",
    tag: "Results",
    render: () => <ResultsScreen results={MOCK_RESULTS} />,
  },
  {
    title: "Host Results",
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
    <div className="bg-gray-950">

      {/* ── Mobile layout ── */}
      <div className="sm:hidden flex flex-col" style={{ height: "100dvh" }}>
        {/* Progress bar */}
        <div className="h-0.5 bg-white/10 flex-shrink-0">
          <div
            className="h-full bg-white/60 transition-all duration-200"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        {/* Content */}
        <div className="flex-1 min-h-0 bg-white overflow-y-auto">
          {frame.render()}
        </div>
        {/* Bottom nav */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-gray-900">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 disabled:opacity-25 transition-colors"
          >
            <LuChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-white text-xs font-medium leading-tight truncate max-w-[180px]">{frame.title}</p>
            <p className="text-gray-500 text-xs mt-0.5">{index + 1} / {total}</p>
          </div>
          <button
            onClick={goNext}
            disabled={index === total - 1}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 disabled:opacity-25 transition-colors"
          >
            <LuChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden sm:flex flex-col items-center justify-center gap-4 px-4" style={{ height: "100dvh" }}>
        {/* Phone frame — sized to fill viewport, capped at real phone dimensions */}
        <div
          className="relative bg-white overflow-hidden border border-gray-700 shadow-2xl"
          style={{
            height: "min(calc(100dvh - 96px), 780px)",
            width: "min(calc((100dvh - 96px) / 2), 390px)",
            borderRadius: "2.5rem",
          }}
        >
          <div className="absolute inset-0 overflow-y-auto">
            {frame.render()}
          </div>
        </div>
        {/* Navigation */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            title="Previous (←)"
          >
            <LuChevronLeft size={18} />
          </button>
          <div className="text-center min-w-[200px]">
            <p className="text-white text-sm font-medium truncate">{frame.title}</p>
            <p className="text-gray-500 text-xs mt-0.5">{index + 1} / {total}</p>
          </div>
          <button
            onClick={goNext}
            disabled={index === total - 1}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            title="Next (→)"
          >
            <LuChevronRight size={18} />
          </button>
        </div>
      </div>

    </div>
  );
}
