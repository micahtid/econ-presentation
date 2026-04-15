"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Lobby from "@/components/host/Lobby";
import GameMonitor from "@/components/host/GameMonitor";
import LeaderboardScreen from "@/components/game/LeaderboardScreen";
import ResultsScreen from "@/components/game/ResultsScreen";

export default function HostView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("room")?.toUpperCase() ?? null;

  const [creating, setCreating] = useState(false);
  const createRoom = useMutation(api.rooms.createRoom);
  const revealStats = useMutation(api.rooms.revealStats);

  const room = useQuery(api.rooms.getRoom, code ? { code } : "skip");

  const players = useQuery(
    api.rooms.getPlayers,
    room?._id ? { roomId: room._id as Id<"rooms"> } : "skip"
  );

  const results = useQuery(
    api.rooms.getRoomResults,
    room?._id && room.revealResults
      ? { roomId: room._id as Id<"rooms"> }
      : "skip"
  );

  const handleCreate = useCallback(async () => {
    if (creating) return;
    setCreating(true);
    try {
      const { code: newCode } = await createRoom({});
      router.push(`/host?room=${newCode}`);
    } catch (err) {
      console.error(err);
      setCreating(false);
    }
  }, [creating, createRoom, router]);

  if (!code) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-sm w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Host a Session
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Create a room and share the code with your audience.
          </p>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create Room"}
          </button>
        </div>
      </main>
    );
  }

  if (room === undefined || players === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </main>
    );
  }

  if (room === null) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-900 font-bold text-xl mb-2">Room not found</p>
        <p className="text-gray-500 text-sm">
          The code <strong>{code}</strong> doesn&apos;t match any active room.
        </p>
        <button
          onClick={() => router.push("/host")}
          className="mt-6 text-sm text-gray-600 underline"
        >
          Create a new room
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">
            Economics Simulation
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Host Dashboard &middot; Room{" "}
            <span className="font-bold text-gray-900">{code}</span>
          </p>
        </div>

        {room.revealStats && results ? (
          <ResultsScreen
            results={results}
            isHost
            onLeave={() => router.push("/")}
          />
        ) : room.revealResults && results ? (
          <LeaderboardScreen
            results={results}
            isHost
            onRevealStats={() => revealStats({ roomId: room._id as Id<"rooms"> })}
          />
        ) : room.status === "waiting" ? (
          <Lobby
            roomId={room._id}
            code={code}
            players={players.map((p) => ({
              _id: p._id,
              username: p.username,
            }))}
          />
        ) : (
          <GameMonitor
            roomId={room._id}
            players={players.map((p) => ({
              _id: p._id,
              username: p.username,
              isFinished: p.isFinished,
              currentEvent: p.currentEvent,
              childStatus: p.childStatus,
            }))}
          />
        )}
      </div>
    </main>
  );
}
