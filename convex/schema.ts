import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    code: v.string(),
    status: v.union(
      v.literal("waiting"),
      v.literal("playing"),
      v.literal("finished")
    ),
    revealResults: v.boolean(),
  }).index("by_code", ["code"]),

  players: defineTable({
    roomId: v.id("rooms"),
    username: v.string(),
    scenario: v.optional(v.number()),
    balance: v.number(),
    monthlyIncome: v.number(),
    monthlyExpenses: v.number(),
    childStatus: v.union(
      v.literal("school"),
      v.literal("working"),
      v.literal("trained")
    ),
    isFinished: v.boolean(),
    currentEvent: v.number(),
    phase: v.union(
      v.literal("waiting"),
      v.literal("event"),
      v.literal("month_end"),
      v.literal("finished")
    ),
    prevBalance: v.number(),
    eventDelta: v.number(),
  }).index("by_room", ["roomId"]),
});
