// Game data duplicated here for Convex server-side use.
// The canonical types live in src/lib/gameConstants.ts.

export type ChildStatus = "school" | "working" | "trained";

export interface Scenario {
  id: number;
  income: number;
  expenses: number;
  balance: number;
}

export interface OptionEffect {
  balanceDelta: number;
  incomeDelta: number;
  expenseDelta: number;
  statusChange: ChildStatus | null;
  /** null = always visible */
  condition:
    | { childStatus: ChildStatus }
    | { childStatusNot: ChildStatus }
    | null;
}

export type OptionKey = "A" | "B" | "C" | "D" | "E";

export interface EventDef {
  id: number;
  autoPenalty: number | null;
  options: Partial<Record<OptionKey, OptionEffect>>;
}

export const SCENARIOS: Record<number, Scenario> = {
  1: { id: 1, income: 40, expenses: 35, balance: 0 },
  2: { id: 2, income: 50, expenses: 45, balance: 0 },
  3: { id: 3, income: 60, expenses: 55, balance: 0 },
  4: { id: 4, income: 45, expenses: 40, balance: 0 },
  5: { id: 5, income: 30, expenses: 35, balance: 0 },
};

export const EVENTS: Record<number, EventDef> = {
  1: {
    id: 1,
    autoPenalty: null,
    options: {
      A: { balanceDelta: -10, incomeDelta: 0,   expenseDelta: 0,  statusChange: null,      condition: null },
      B: { balanceDelta: 0,   incomeDelta: -5,  expenseDelta: 0,  statusChange: null,      condition: null },
      C: { balanceDelta: 0,   incomeDelta: 15,  expenseDelta: 0,  statusChange: "working", condition: { childStatus: "school" } },
      D: { balanceDelta: 10,  incomeDelta: 0,   expenseDelta: 0,  statusChange: null,      condition: { childStatusNot: "school" } },
    },
  },
  2: {
    id: 2,
    autoPenalty: null,
    options: {
      A: { balanceDelta: -5,  incomeDelta: 0,   expenseDelta: 0,  statusChange: null,      condition: null },
      B: { balanceDelta: 10,  incomeDelta: 0,   expenseDelta: 10, statusChange: null,      condition: null },
      C: { balanceDelta: 0,   incomeDelta: 15,  expenseDelta: 0,  statusChange: "working", condition: { childStatus: "school" } },
      D: { balanceDelta: 0,   incomeDelta: 0,   expenseDelta: -5, statusChange: null,      condition: { childStatusNot: "school" } },
    },
  },
  3: {
    id: 3,
    autoPenalty: -20,
    options: {
      A: { balanceDelta: 0,   incomeDelta: 0,   expenseDelta: 10, statusChange: null,      condition: null },
      B: { balanceDelta: 10,  incomeDelta: 0,   expenseDelta: 0,  statusChange: null,      condition: { childStatus: "working" } },
      C: { balanceDelta: 5,   incomeDelta: 0,   expenseDelta: 0,  statusChange: null,      condition: null },
      D: { balanceDelta: 10,  incomeDelta: 0,   expenseDelta: 0,  statusChange: "working", condition: { childStatus: "school" } },
      E: { balanceDelta: 15,  incomeDelta: -5,  expenseDelta: 0,  statusChange: null,      condition: { childStatus: "trained" } },
    },
  },
  4: {
    id: 4,
    autoPenalty: null,
    options: {
      A: { balanceDelta: 0,   incomeDelta: 0,   expenseDelta: 0,  statusChange: "trained", condition: { childStatus: "school" } },
      B: { balanceDelta: 0,   incomeDelta: 0,   expenseDelta: 0,  statusChange: null,      condition: null },
      C: { balanceDelta: 0,   incomeDelta: -15, expenseDelta: 0,  statusChange: "trained", condition: { childStatus: "working" } },
      D: { balanceDelta: 0,   incomeDelta: 5,   expenseDelta: 3,  statusChange: null,      condition: null },
      E: { balanceDelta: 10,  incomeDelta: 0,   expenseDelta: 3,  statusChange: null,      condition: { childStatus: "trained" } },
    },
  },
  5: {
    id: 5,
    autoPenalty: null,
    options: {
      A: { balanceDelta: 0,   incomeDelta: 0,   expenseDelta: 20, statusChange: null,      condition: null },
      B: { balanceDelta: 30,  incomeDelta: 0,   expenseDelta: 0,  statusChange: "working", condition: null },
      C: { balanceDelta: 15,  incomeDelta: 0,   expenseDelta: 5,  statusChange: null,      condition: null },
    },
  },
  6: {
    id: 6,
    autoPenalty: null,
    options: {
      A: { balanceDelta: 0,   incomeDelta: 50,  expenseDelta: 0,  statusChange: null,      condition: { childStatus: "trained" } },
      B: { balanceDelta: 0,   incomeDelta: 30,  expenseDelta: 0,  statusChange: "working", condition: { childStatusNot: "trained" } },
      C: { balanceDelta: 0,   incomeDelta: 20,  expenseDelta: 10, statusChange: null,      condition: null },
      D: { balanceDelta: 0,   incomeDelta: 10,  expenseDelta: 5,  statusChange: null,      condition: null },
    },
  },
};

export function isOptionVisible(
  condition: OptionEffect["condition"],
  childStatus: ChildStatus
): boolean {
  if (!condition) return true;
  if ("childStatus" in condition) return childStatus === condition.childStatus;
  if ("childStatusNot" in condition)
    return childStatus !== condition.childStatusNot;
  return true;
}
