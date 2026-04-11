"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function JoinView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeParam = searchParams.get("code")?.toUpperCase() ?? "";

  const [code, setCode] = useState(codeParam);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const joinRoom = useMutation(api.rooms.joinRoom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    const trimmedUsername = username.trim();

    if (trimmedCode.length !== 6) {
      setError("Room code must be 6 characters.");
      return;
    }
    if (!trimmedUsername) {
      setError("Please enter a username.");
      return;
    }

    setError("");
    setJoining(true);
    try {
      const { playerId, code: roomCode } = await joinRoom({
        code: trimmedCode,
        username: trimmedUsername,
      });
      localStorage.setItem("playerId", playerId);
      router.push(`/play/${roomCode}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to join. Try again.";
      setError(msg);
      setJoining(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">
          Join Simulation
        </h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          Enter the room code your host shared with you.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Room Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              autoCapitalize="characters"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-[0.2em] text-gray-900 uppercase focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Your Name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a username"
              maxLength={30}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={joining}
            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {joining ? "Joining…" : "Join Room"}
          </button>
        </form>
      </div>
    </main>
  );
}
