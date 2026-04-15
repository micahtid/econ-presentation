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
      "Cholera has swept through your village from the contaminated communal well. Your family is feverish and weak. Without medicine, you cannot work, and missing even a few days of wages could mean missing rent. Treatment is expensive. Waiting is more expensive.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Buy medicine immediately",
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
        effect: "–$5/month forever from recurring illness",
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
      "Overnight, the price of rice and cooking oil has nearly doubled. Vendors offer no credit, no warnings, no exceptions. Your family has to eat, but your budget is already stretched to its limits. Something has to give this month.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Dip into savings to cover the extra cost",
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
        effect: "+$10 now; +$10/month in repayments forever",
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
        label: "Let your working child's wages offset food",
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
      "A persistent cough has kept you from work for two full weeks. Your employer immediately cuts $20 from your wages, no questions asked. Rent is due in days, and your savings cannot stretch to cover it. You need a plan, fast.",
    autoPenalty: -20,
    options: [
      {
        key: "A",
        label: "Borrow from your employer or landlord",
        effect: "+$10/month in repayments forever",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: 10,
        statusChange: null,
        condition: null,
      },
      {
        key: "B",
        label: "Have your child work double shifts",
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
        effect: "+$5 to balance (one-time)",
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
        label: "Have trained child take extra work",
        effect: "+$15 to balance; –$5/month income (lost training hours)",
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
      "An international NGO has launched a free vocational training program in your district. Graduates are guaranteed placement in a certified workshop with real wages and safe conditions. But training takes months, and time spent learning is time not earning.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Enroll your child in the program",
        effect: "No cost; child begins training toward a stable future",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: "trained",
        condition: { childStatus: "school" },
      },
      {
        key: "B",
        label: "Pass up the opportunity",
        effect: "No change. Nothing improves.",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: 0,
        statusChange: null,
        condition: null,
      },
      {
        key: "C",
        label: "Pull your working child out of labor for training",
        effect: "–$15/month income while they train",
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
      "Disaster strikes without warning. A workplace injury, a flood, a fire. Whatever the cause, your livelihood is gone, and you need $30 immediately just to keep your family fed this week. There are no good options here. Only the least bad.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Sell your tools and take on emergency debt",
        effect: "+$20/month in debt payments forever",
        balanceDelta: 0,
        incomeDelta: 0,
        expenseDelta: 20,
        statusChange: null,
        condition: null,
      },
      {
        key: "B",
        label: "Send your child into hazardous labor",
        effect: "+$30 to balance; child enters dangerous work",
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
      "Years have passed. Your body, worn down by hard labor and untreated illness, can no longer keep up with the work. You can no longer provide. The future of your family now rests entirely on choices made long ago.",
    autoPenalty: null,
    options: [
      {
        key: "A",
        label: "Your trained child secures a stable, well-paying job",
        effect: "+$50/month income. Their training finally pays off.",
        balanceDelta: 0,
        incomeDelta: 50,
        expenseDelta: 0,
        statusChange: null,
        condition: { childStatus: "trained" },
      },
      {
        key: "B",
        label: "Your child takes over your dangerous work",
        effect: "+$30/month income. The cycle continues.",
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
        effect: "+$10/month income; +$5/month in membership fees",
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
        return "Your child dropped out of school last month to work—their wages are now part of your budget.";
      }
      if (balance < 0) {
        return `Last month's choices left you $${Math.abs(balance)} in debt—another hit could spiral out of control.`;
      }
      return null;
    }
    case 3: {
      if (childStatus === "working" && extraExpenses > 0) {
        return `Your child's wages help, but that $${extraExpenses}/month loan now stacks on top of the lost wages.`;
      }
      if (childStatus === "working") {
        return "Your child has been working for months, and you depend on their wages to stay afloat.";
      }
      if (childStatus === "trained" && extraExpenses > 0) {
        return `Your child is in training with no wages coming in—and that $${extraExpenses}/month loan still needs to be paid.`;
      }
      if (childStatus === "trained") {
        return "Your child is still in training, which means no wages, but you're betting on their future.";
      }
      if (extraExpenses > 0) {
        return `A previous loan adds $${extraExpenses}/month to your costs, and now you're losing wages too.`;
      }
      if (balance < 0) {
        return `You enter this month already $${Math.abs(balance)} in debt.`;
      }
      return null;
    }
    case 4: {
      if (childStatus === "working" && extraExpenses > 0) {
        return `Your child has been laboring instead of going to school, and past debts already add $${extraExpenses}/month to your burden.`;
      }
      if (childStatus === "working") {
        return "Your child has been laboring for months instead of going to school—this program could change that, if you can absorb the lost wages.";
      }
      if (childStatus === "trained" && extraExpenses > 0) {
        return `Your child is in training with no wages coming in, while past debts still cost you $${extraExpenses} every month.`;
      }
      if (childStatus === "trained") {
        return "Your child has been in training, sacrificing income for a better path.";
      }
      if (extraExpenses > 0) {
        return `Past debts cost you $${extraExpenses} every month, making every decision harder.`;
      }
      return null;
    }
    case 5: {
      if (childStatus === "working" && balance < 0) {
        return `Your child has kept your family afloat through every crisis, but you were still $${Math.abs(balance)} in debt when this hit.`;
      }
      if (childStatus === "working") {
        return "Your child has been your financial lifeline through every crisis, but they're still not in school.";
      }
      if (childStatus === "trained" && balance < 0) {
        return `Your child is almost done with training, but you were already $${Math.abs(balance)} in debt before this disaster struck.`;
      }
      if (childStatus === "trained") {
        return "Your child is nearly through their training—losing that progress now would be devastating.";
      }
      if (balance < 0) {
        return `You were already $${Math.abs(balance)} in debt before this disaster struck.`;
      }
      return null;
    }
    case 6: {
      if (childStatus === "school") {
        return "Against all odds, your child stayed in school through every crisis—now it's time to see if it pays off.";
      }
      if (childStatus === "working") {
        return "Your child spent their childhood working instead of studying, and that path now defines what comes next.";
      }
      if (childStatus === "trained") {
        return "Your child completed their training years ago—that decision is about to determine your family's future.";
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
