import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { SCENARIOS } from "./gameData";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // omit ambiguous chars (0/O, 1/I)
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const createRoom = mutation({
  args: {},
  handler: async (ctx) => {
    // Generate a unique code (retry if collision)
    let code = generateCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await ctx.db
        .query("rooms")
        .withIndex("by_code", (q) => q.eq("code", code))
        .first();
      if (!existing) break;
      code = generateCode();
      attempts++;
    }

    const roomId = await ctx.db.insert("rooms", {
      code,
      status: "waiting",
      revealResults: false,
    });

    return { roomId, code };
  },
});

export const joinRoom = mutation({
  args: {
    code: v.string(),
    username: v.string(),
  },
  handler: async (ctx, { code, username }) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("code", code.toUpperCase()))
      .first();

    if (!room) throw new Error("Room not found");
    if (room.status !== "waiting") throw new Error("Game has already started");

    // Check for duplicate username in this room
    const existing = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();
    if (existing.some((p) => p.username.toLowerCase() === username.toLowerCase())) {
      throw new Error("Username already taken in this room");
    }

    const playerId = await ctx.db.insert("players", {
      roomId: room._id,
      username,
      balance: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      childStatus: "school",
      isFinished: false,
      currentEvent: 1,
      phase: "waiting",
      prevBalance: 0,
      eventDelta: 0,
    });

    return { playerId, roomId: room._id, code: room.code };
  },
});

export const startGame = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const room = await ctx.db.get(roomId);
    if (!room || room.status !== "waiting") throw new Error("Invalid room state");

    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect();

    if (players.length === 0) throw new Error("No players to start with");

    const scenarioIds = [1, 2, 3, 4, 5];

    for (const player of players) {
      const scenarioId =
        scenarioIds[Math.floor(Math.random() * scenarioIds.length)];
      const scenario = SCENARIOS[scenarioId];

      await ctx.db.patch(player._id, {
        scenario: scenarioId,
        balance: scenario.balance,
        monthlyIncome: scenario.income,
        monthlyExpenses: scenario.expenses,
        phase: "event",
        currentEvent: 1,
        prevBalance: 0,
        eventDelta: 0,
      });
    }

    await ctx.db.patch(roomId, { status: "playing" });
  },
});

export const revealResults = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    await ctx.db.patch(roomId, { revealResults: true, status: "finished" });
  },
});

export const getRoom = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    return ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("code", code.toUpperCase()))
      .first();
  },
});

export const getRoomById = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    return ctx.db.get(roomId);
  },
});

export const getPlayers = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    return ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect();
  },
});

export const getRoomResults = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect();

    const finished = players.filter((p) => p.isFinished);
    const totalPlayers = players.length;
    const childLaborCount = finished.filter(
      (p) => p.childStatus === "working"
    ).length;
    const negativeNoLabor = finished.filter(
      (p) => p.childStatus === "school" && p.balance < 0
    ).length;

    const playerList = finished
      .map((p) => ({
        username: p.username,
        childStatus: p.childStatus,
        balance: p.balance,
        scenario: p.scenario ?? 0,
      }))
      .sort((a, b) => b.balance - a.balance);

    return {
      totalPlayers,
      finishedCount: finished.length,
      childLaborCount,
      negativeNoLabor,
      playerList,
    };
  },
});
