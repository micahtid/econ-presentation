"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import EventScreen from "@/components/game/EventScreen";
import MonthEndScreen from "@/components/game/MonthEndScreen";
import WaitingScreen from "@/components/game/WaitingScreen";
import ResultsScreen from "@/components/game/ResultsScreen";
import type { ChildStatus } from "@/lib/gameConstants";

export default function PlayPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("playerId");
    setPlayerId(stored);
  }, []);

  const player = useQuery(
    api.players.getPlayer,
    playerId ? { playerId: playerId as Id<"players"> } : "skip"
  );

  const room = useQuery(
    api.rooms.getRoom,
    roomCode ? { code: roomCode.toUpperCase() } : "skip"
  );

  const results = useQuery(
    api.rooms.getRoomResults,
    room?._id && room.revealResults
      ? { roomId: room._id as Id<"rooms"> }
      : "skip"
  );

  // Not yet hydrated from localStorage
  if (playerId === null) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </main>
    );
  }

  // No playerId in localStorage — they haven't joined
  if (!playerId) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-900 font-bold text-lg mb-2">
          Session not found
        </p>
        <p className="text-gray-500 text-sm">
          Please go back and join the room using your code.
        </p>
        <a
          href={`/join?code=${roomCode}`}
          className="mt-6 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold text-sm"
        >
          Go to Join
        </a>
      </main>
    );
  }

  // Loading
  if (player === undefined || room === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </main>
    );
  }

  if (player === null) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-900 font-bold text-lg mb-2">Player not found</p>
        <a
          href={`/join?code=${roomCode}`}
          className="mt-4 text-sm text-gray-600 underline"
        >
          Rejoin
        </a>
      </main>
    );
  }

  // Results revealed
  if (room?.revealResults && results) {
    return <ResultsScreen results={results} />;
  }

  // Waiting for host to start
  if (player.phase === "waiting") {
    return (
      <WaitingScreen
        message="Waiting for the host to begin"
        subMessage={`Joined as ${player.username}`}
      />
    );
  }

  // Month-end summary (after events 1–5)
  if (player.phase === "month_end") {
    return (
      <MonthEndScreen
        playerId={player._id}
        eventNumber={player.currentEvent - 1}
        prevBalance={player.prevBalance}
        monthlyIncome={player.monthlyIncome}
        monthlyExpenses={player.monthlyExpenses}
        eventDelta={player.eventDelta}
        newBalance={player.balance}
      />
    );
  }

  // Finished — waiting for others or reveal
  if (player.phase === "finished" || player.isFinished) {
    return (
      <WaitingScreen
        message="You're done!"
        subMessage="Waiting for everyone else to finish…"
      />
    );
  }

  // Active event
  if (player.phase === "event" && player.scenario) {
    return (
      <EventScreen
        playerId={player._id}
        eventNumber={player.currentEvent}
        childStatus={player.childStatus as ChildStatus}
        scenario={player.scenario}
        balance={player.balance}
        monthlyIncome={player.monthlyIncome}
        monthlyExpenses={player.monthlyExpenses}
      />
    );
  }

  // Fallback
  return (
    <WaitingScreen
      message="Loading…"
      subMessage="Please wait while the game loads."
    />
  );
}
