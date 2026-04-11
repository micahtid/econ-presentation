export type ChildStatus = "school" | "working" | "trained";

export interface Scenario {
  id: number;
  name: string;
  location: string;
  description: string;
  income: number;
  expenses: number;
  balance: number;
}

export type OptionCondition =
  | { childStatus: ChildStatus }
  | { childStatusNot: ChildStatus }
  | null;

export type OptionKey = "A" | "B" | "C" | "D" | "E";

export interface EventOption {
  key: OptionKey;
  label: string;
  effect: string;
  balanceDelta: number;
  incomeDelta: number;
  expenseDelta: number;
  statusChange: ChildStatus | null;
  condition: OptionCondition;
}

export interface GameEvent {
  id: number;
  title: string;
  description: string;
  /** Applied automatically before options are presented; null means no auto-penalty */
  autoPenalty: number | null;
  options: EventOption[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    name: "Cocoa Farmer",
    location: "Bouaké, Côte d'Ivoire",
    description:
      "You are a cocoa farmer in Bouaké, Côte d'Ivoire. Your family earns $40 a month. Your basic survival expenses are $35. A single drought or crop disease can wipe out your entire income.",
    income: 40,
    expenses: 35,
    balance: 0,
  },
  {
    id: 2,
    name: "Day Laborer",
    location: "Dhaka, Bangladesh",
    description:
      "You live in a slum in Dhaka, Bangladesh. You work as a day laborer on construction sites. You make $50 a month, but rent and clean water cost $45. You have zero job security and no savings.",
    income: 50,
    expenses: 45,
    balance: 0,
  },
  {
    id: 3,
    name: "Cobalt Miner",
    location: "Kolwezi, Democratic Republic of the Congo",
    description:
      "You are an artisanal cobalt miner in Kolwezi, Democratic Republic of the Congo. You earn $60 a month digging by hand. The local cost of living is $55. The work is dangerous and you have no medical insurance.",
    income: 60,
    expenses: 55,
    balance: 0,
  },
  {
    id: 4,
    name: "Garment Worker",
    location: "Tirupur, India",
    description:
      "You work in a garment factory in Tirupur, India. You earn $45 a month working 12 hours a day. Your living expenses are $40. If you get sick and miss a day, you are fired immediately without pay.",
    income: 45,
    expenses: 40,
    balance: 0,
  },
  {
    id: 5,
    name: "Brick Kiln Worker",
    location: "Lahore, Pakistan",
    description:
      "You work at a brick kiln outside Lahore, Pakistan. You earn $30 a month. The basic food supplies sold by your employer cost $35. You are already in debt to the kiln owner, and your balance drops every month.",
    income: 30,
    expenses: 35,
    balance: 0,
  },
];

export const EVENTS: GameEvent[] = [
  {
    id: 1,
    title: "Waterborne Illness",
    description:
      "A severe waterborne illness strikes your family. You need to act.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Pay for medicine",
        effect: "–$10 to balance",
        balanceDelta: -10,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: null,
        condition: null,
      },
      {
        key: "B",
        label: "Ignore it",
        effect: "–$5 to monthly income",
        balanceDelta: 0,
        incomeDelta: -5,
        expenseDelta: 0,
        statusChange: null,
        condition: null,
      },
      {
        key: "C",
        label: "Send child to work for medicine",
        effect: "+$15 to monthly income; child leaves school",
        balanceDelta: 0,
        incomeDelta: 15,
        expenseDelta: 0,
        statusChange: "working",
        condition: { childStatus: "school" },
      },
      {
        key: "D",
        label: "Use child's wages for medicine",
        effect: "+$10 to balance",
        balanceDelta: 10,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: null,
        condition: { childStatusNot: "school" },
      },
    ],
  },
  {
    id: 2,
    title: "Food Prices Double",
    description:
      "The cost of staple foods suddenly doubles this month. You must cover the extra cost.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Pay the extra from your savings",
        effect: "–$5 to balance",
        balanceDelta: -5,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: null,
        condition: null,
      },
      {
        key: "B",
        label: "Take a high-interest loan",
        effect: "+$10 to balance; +$10 to monthly expenses",
        balanceDelta: 10,
        incomeDelta: 0,
        expenseDelta: 10,
        statusChange: null,
        condition: null,
      },
      {
        key: "C",
        label: "Send child to work",
        effect: "+$15 to monthly income; child leaves school",
        balanceDelta: 0,
        incomeDelta: 15,
        expenseDelta: 0,
        statusChange: "working",
        condition: { childStatus: "school" },
      },
      {
        key: "D",
        label: "Cut food costs with child's wages",
        effect: "–$5 to monthly expenses",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: -5,
        statusChange: null,
        condition: { childStatusNot: "school" },
      },
    ],
  },
  {
    id: 3,
    title: "Lost Work",
    description:
      "The adult misses work due to lingering illness or lack of available jobs. You lose $20 immediately. You must find a way to cope.",
    autoPenalty: -20,
    options: [
      {
        key: "A",
        label: "Borrow from employer / landlord",
        effect: "+$10 to monthly expenses",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: 10,
        statusChange: null,
        condition: null,
      },
      {
        key: "B",
        label: "Have child work double shifts",
        effect: "+$10 to balance",
        balanceDelta: 10,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: null,
        condition: { childStatus: "working" },
      },
      {
        key: "C",
        label: "Sell a household possession",
        effect: "+$5 to balance",
        balanceDelta: 5,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: null,
        condition: null,
      },
      {
        key: "D",
        label: "Send child to work",
        effect: "+$10 to balance; child leaves school",
        balanceDelta: 10,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: "working",
        condition: { childStatus: "school" },
      },
      {
        key: "E",
        label: "Trained child covers the shortfall",
        effect: "+$15 to balance; –$5 to monthly income",
        balanceDelta: 15,
        incomeDelta: -5,
        expenseDelta: 0,
        statusChange: null,
        condition: { childStatus: "trained" },
      },
    ],
  },
  {
    id: 4,
    title: "Vocational Training Opens",
    description:
      "A free vocational training program opens in your district. It guarantees a safe, higher-paying job for graduates.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Enroll child in the program",
        effect: "$0; child begins training",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: "trained",
        condition: { childStatus: "school" },
      },
      {
        key: "B",
        label: "Pass up the opportunity",
        effect: "$0 change",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: null,
        condition: null,
      },
      {
        key: "C",
        label: "Enroll working child in training",
        effect: "–$15 to monthly income; child trains",
        balanceDelta: 0,
        incomeDelta: -15,
        expenseDelta: 0,
        statusChange: "trained",
        condition: { childStatus: "working" },
      },
      {
        key: "D",
        label: "Find higher-paying work yourself",
        effect: "+$5 to monthly income; +$3 to monthly expenses",
        balanceDelta: 0,
        incomeDelta: 5,
        expenseDelta: 3,
        statusChange: null,
        condition: null,
      },
      {
        key: "E",
        label: "Trained child mentors for a stipend",
        effect: "+$10 to balance; +$3 to monthly expenses",
        balanceDelta: 10,
        incomeDelta: 0,
        expenseDelta: 3,
        statusChange: null,
        condition: { childStatus: "trained" },
      },
    ],
  },
  {
    id: 5,
    title: "Catastrophe",
    description:
      "A major workplace injury or localized flood destroys your livelihood. You must find $30 immediately to survive.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Sell tools / take on debt",
        effect: "+$20 to monthly expenses",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: 20,
        statusChange: null,
        condition: null,
      },
      {
        key: "B",
        label: "Send child into hazardous labor",
        effect: "+$30 to balance; child leaves school",
        balanceDelta: 30,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: "working",
        condition: null,
      },
      {
        key: "C",
        label: "Take a predatory microloan",
        effect: "+$15 to balance; +$5 to monthly expenses",
        balanceDelta: 15,
        incomeDelta: 0,
        expenseDelta: 5,
        statusChange: null,
        condition: null,
      },
    ],
  },
  {
    id: 6,
    title: "The Long Term",
    description:
      "Years pass. The adult can no longer work due to age, untreated illness, or injury. How does the family survive?",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Trained child gets a stable job",
        effect: "+$50 to monthly income",
        balanceDelta: 0,
        incomeDelta: 50,
        expenseDelta: 0,
        statusChange: null,
        condition: { childStatus: "trained" },
      },
      {
        key: "B",
        label: "Child takes over dangerous work",
        effect: "+$30 to monthly income; child enters dangerous work",
        balanceDelta: 0,
        incomeDelta: 30,
        expenseDelta: 0,
        statusChange: "working",
        condition: { childStatusNot: "trained" },
      },
      {
        key: "C",
        label: "Relocate for better opportunities",
        effect: "+$20 to monthly income; +$10 to monthly expenses",
        balanceDelta: 0,
        incomeDelta: 20,
        expenseDelta: 10,
        statusChange: null,
        condition: null,
      },
      {
        key: "D",
        label: "Join a community cooperative",
        effect: "+$10 to monthly income; +$5 to monthly expenses",
        balanceDelta: 0,
        incomeDelta: 10,
        expenseDelta: 5,
        statusChange: null,
        condition: null,
      },
    ],
  },
];

/** Returns visible options for an event given the player's current child status */
export function getVisibleOptions(
  event: GameEvent,
  childStatus: ChildStatus
): EventOption[] {
  return event.options.filter((opt) => {
    if (!opt.condition) return true;
    if ("childStatus" in opt.condition) {
      return childStatus === opt.condition.childStatus;
    }
    if ("childStatusNot" in opt.condition) {
      return childStatus !== opt.condition.childStatusNot;
    }
    return true;
  });
}
