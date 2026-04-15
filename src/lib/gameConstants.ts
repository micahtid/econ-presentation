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
      "The shared well water has made your family sick. Without treatment, you risk missing work — and losing income you cannot afford to lose. Every day you delay costs you more than medicine would.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Buy medicine now",
        effect: "–$10 to balance",
        balanceDelta: -10,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: null,
        condition: null,
      },
      {
        key: "B",
        label: "Push through without treatment",
        effect: "–$5/month from recurring illness",
        balanceDelta: 0,
        incomeDelta: -5,
        expenseDelta: 0,
        statusChange: null,
        condition: null,
      },
      {
        key: "C",
        label: "Pull child out of school to earn medicine money",
        effect: "+$15/month income; child leaves school permanently",
        balanceDelta: 0,
        incomeDelta: 15,
        expenseDelta: 0,
        statusChange: "working",
        condition: { childStatus: "school" },
      },
      {
        key: "D",
        label: "Use child's wages to cover the medicine",
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
    title: "Food Prices Spike",
    description:
      "The market price of rice and cooking oil has doubled overnight. Vendors offer no credit and no warnings. The extra cost is unavoidable — but your budget has no room to absorb it.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Dip into savings to cover it",
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
        effect: "+$10 to balance now; +$10/month in repayments forever after",
        balanceDelta: 10,
        incomeDelta: 0,
        expenseDelta: 10,
        statusChange: null,
        condition: null,
      },
      {
        key: "C",
        label: "Send child to work to cover food costs",
        effect: "+$15/month income; child leaves school permanently",
        balanceDelta: 0,
        incomeDelta: 15,
        expenseDelta: 0,
        statusChange: "working",
        condition: { childStatus: "school" },
      },
      {
        key: "D",
        label: "Let child's wages offset food costs",
        effect: "–$5/month to expenses",
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
    title: "Lost Wages",
    description:
      "A lingering illness forces you to miss two weeks of work. Your employer docks the pay immediately — $20 gone before you see it. You still owe rent at the end of the month.",
    autoPenalty: -20,
    options: [
      {
        key: "A",
        label: "Borrow from your employer or landlord",
        effect: "+$10/month to repayments — they will collect every month",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: 10,
        statusChange: null,
        condition: null,
      },
      {
        key: "B",
        label: "Have child work double shifts to make up the gap",
        effect: "+$10 to balance — your child works harder",
        balanceDelta: 10,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: null,
        condition: { childStatus: "working" },
      },
      {
        key: "C",
        label: "Sell a household possession",
        effect: "+$5 to balance — a one-time fix",
        balanceDelta: 5,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: null,
        condition: null,
      },
      {
        key: "D",
        label: "Pull child out of school to cover the shortfall",
        effect: "+$10 to balance; child leaves school permanently",
        balanceDelta: 10,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: "working",
        condition: { childStatus: "school" },
      },
      {
        key: "E",
        label: "Trained child picks up extra work to cover it",
        effect: "+$15 to balance; –$5/month as they reduce training hours",
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
    title: "A Rare Opportunity",
    description:
      "An NGO has launched a free vocational training program in your district. Graduates are promised placement in a certified workshop — real wages, safe conditions. But training takes time away from work.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Enroll child in the program",
        effect: "No immediate cost; child enters training toward a stable future",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: "trained",
        condition: { childStatus: "school" },
      },
      {
        key: "B",
        label: "Pass up the opportunity",
        effect: "No change — things stay as they are",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: null,
        condition: null,
      },
      {
        key: "C",
        label: "Pull working child out of labor for training",
        effect: "–$15/month while child trains; they lose their wages",
        balanceDelta: 0,
        incomeDelta: -15,
        expenseDelta: 0,
        statusChange: "trained",
        condition: { childStatus: "working" },
      },
      {
        key: "D",
        label: "Take on riskier, higher-paying work yourself",
        effect: "+$5/month income; +$3/month in added costs",
        balanceDelta: 0,
        incomeDelta: 5,
        expenseDelta: 3,
        statusChange: null,
        condition: null,
      },
      {
        key: "E",
        label: "Have trained child mentor others for a stipend",
        effect: "+$10 to balance; +$3/month in program fees",
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
      "Disaster strikes without warning — a serious workplace injury or a flood destroys your tools and livelihood. You need $30 right now just to keep your family fed. There are no good options.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Sell tools and take on emergency debt",
        effect: "+$20/month in debt payments — a crushing long-term burden",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: 20,
        statusChange: null,
        condition: null,
      },
      {
        key: "B",
        label: "Send child into hazardous labor immediately",
        effect: "+$30 to balance now; child enters dangerous work",
        balanceDelta: 30,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: "working",
        condition: null,
      },
      {
        key: "C",
        label: "Take a predatory microloan",
        effect: "+$15 to balance; +$5/month in fees",
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
    title: "The Long Run",
    description:
      "Years have passed. Your body, worn down by labor and untreated ailments, can no longer keep up with the work. The future of your family now rests on choices made long ago.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Trained child secures a stable, well-paying job",
        effect: "+$50/month — their training finally pays off",
        balanceDelta: 0,
        incomeDelta: 50,
        expenseDelta: 0,
        statusChange: null,
        condition: { childStatus: "trained" },
      },
      {
        key: "B",
        label: "Child takes over your dangerous work",
        effect: "+$30/month — the cycle continues",
        balanceDelta: 0,
        incomeDelta: 30,
        expenseDelta: 0,
        statusChange: "working",
        condition: { childStatusNot: "trained" },
      },
      {
        key: "C",
        label: "Uproot the family and relocate for opportunity",
        effect: "+$20/month income; +$10/month in relocation costs",
        balanceDelta: 0,
        incomeDelta: 20,
        expenseDelta: 10,
        statusChange: null,
        condition: null,
      },
      {
        key: "D",
        label: "Join a community cooperative",
        effect: "+$10/month income; +$5/month in membership costs",
        balanceDelta: 0,
        incomeDelta: 10,
        expenseDelta: 5,
        statusChange: null,
        condition: null,
      },
    ],
  },
];

/**
 * Returns a short narrative note shown at the top of an event screen,
 * contextualizing the player's current situation based on prior decisions.
 */
export function getContextNote(
  eventNumber: number,
  childStatus: ChildStatus,
  balance: number,
  monthlyExpenses: number,
  scenarioId: number
): string | null {
  const scenario = SCENARIOS[scenarioId - 1];
  if (!scenario || eventNumber <= 1) return null;

  const extraExpenses = monthlyExpenses - scenario.expenses;

  switch (eventNumber) {
    case 2: {
      if (childStatus === "working") {
        return "Because of last month's crisis, your child dropped out of school to work. Their wages are helping — but they won't be going back to school.";
      }
      if (balance < 0) {
        return `Last month's choices left you $${Math.abs(balance)} in debt. Another hit could spiral out of control.`;
      }
      return null;
    }
    case 3: {
      const parts: string[] = [];
      if (childStatus === "working") {
        parts.push("Your child has been working for months now, bringing in wages you rely on.");
      } else if (childStatus === "trained") {
        parts.push("Your child is in training — no wages coming in, but the promise of something better.");
      }
      if (extraExpenses > 0) {
        parts.push(`A previous loan adds $${extraExpenses}/month to your costs — and now you're losing wages too.`);
      } else if (balance < 0) {
        parts.push(`You enter this month already $${Math.abs(balance)} in debt.`);
      }
      return parts.length > 0 ? parts.join(" ") : null;
    }
    case 4: {
      const parts: string[] = [];
      if (childStatus === "working") {
        parts.push("Your child has been working for months instead of going to school. This training program could change their future — but only if you can afford the lost wages.");
      } else if (childStatus === "trained") {
        parts.push("Your child has been in training, sacrificing income for a better path.");
      }
      if (extraExpenses > 0) {
        parts.push(`Past debts cost you $${extraExpenses} every month — that makes every decision harder.`);
      }
      return parts.length > 0 ? parts.join(" ") : null;
    }
    case 5: {
      const parts: string[] = [];
      if (childStatus === "working") {
        parts.push("Your child has been your financial lifeline through every crisis — but they're still not in school.");
      } else if (childStatus === "trained") {
        parts.push("Your child is nearly through their training. Losing them to this catastrophe would undo everything.");
      }
      if (balance < 0) {
        parts.push(`You were already $${Math.abs(balance)} in debt before this disaster struck.`);
      }
      return parts.length > 0 ? parts.join(" ") : null;
    }
    case 6: {
      if (childStatus === "school") {
        return "Against all odds, your child stayed in school through every crisis. The years of sacrifice are about to reveal whether they were worth it.";
      }
      if (childStatus === "working") {
        return "Your child spent their entire childhood laboring to keep your family afloat. They never finished school. That decision now defines what comes next.";
      }
      if (childStatus === "trained") {
        return "Your child completed their vocational training. A decision made years ago — pulling them from work and into a program — is about to determine your family's future.";
      }
      return null;
    }
    default:
      return null;
  }
}

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
