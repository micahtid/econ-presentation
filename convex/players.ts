import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { EVENTS, isOptionVisible, type ChildStatus } from "./gameData";

export const getPlayer = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, { playerId }) => {
    return ctx.db.get(playerId);
  },
});

export const submitChoice = mutation({
  args: {
    playerId: v.id("players"),
    eventNumber: v.number(),
    optionKey: v.union(v.literal("A"), v.literal("B"), v.literal("C"), v.literal("D"), v.literal("E")),
  },
  handler: async (ctx, { playerId, eventNumber, optionKey }) => {
    const player = await ctx.db.get(playerId);
    if (!player) throw new Error("Player not found");
    if (player.currentEvent !== eventNumber) {
      // Idempotency guard — already processed
      return;
    }

    const eventDef = EVENTS[eventNumber];
    if (!eventDef) throw new Error("Invalid event number");

    const option = eventDef.options[optionKey];
    if (!option) throw new Error("Invalid option");

    // Verify option is actually visible for this player's childStatus
    if (!isOptionVisible(option.condition, player.childStatus as ChildStatus)) {
      throw new Error("Option not available for current child status");
    }

    // Compute auto-penalty (Event 3)
    const autoPenalty = eventDef.autoPenalty ?? 0;
    const totalBalanceDelta = autoPenalty + option.balanceDelta;

    const newIncome = player.monthlyIncome + option.incomeDelta;
    const newExpenses = player.monthlyExpenses + option.expenseDelta;
    const newStatus =
      option.statusChange ?? (player.childStatus as ChildStatus);

    // Sticky: once true, always true — even if child later transitions to "trained"
    const usedChildLabor =
      option.statusChange === "working" || (player.usedChildLabor ?? false);

    const prevBalance = player.balance;
    const nextEvent = eventNumber + 1;
    const isLastEvent = eventNumber === 6;

    if (isLastEvent) {
      // No month-end screen after Event 6; just mark finished
      await ctx.db.patch(playerId, {
        monthlyIncome: newIncome,
        monthlyExpenses: newExpenses,
        childStatus: newStatus,
        usedChildLabor,
        isFinished: true,
        phase: "finished",
        currentEvent: nextEvent,
        prevBalance,
        eventDelta: totalBalanceDelta,
      });
    } else {
      // Compute new balance for month-end display
      const newBalance = prevBalance + newIncome - newExpenses + totalBalanceDelta;

      await ctx.db.patch(playerId, {
        balance: newBalance,
        monthlyIncome: newIncome,
        monthlyExpenses: newExpenses,
        childStatus: newStatus,
        usedChildLabor,
        phase: "month_end",
        currentEvent: nextEvent,
        prevBalance,
        eventDelta: totalBalanceDelta,
      });
    }
  },
});

export const advancePhase = mutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, { playerId }) => {
    const player = await ctx.db.get(playerId);
    if (!player || player.phase !== "month_end") return;
    await ctx.db.patch(playerId, { phase: "event" });
  },
});
