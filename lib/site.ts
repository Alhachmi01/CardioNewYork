export const siteConfig = {
  name: "GuideVexa",
  url: "https://www.guidevexa.com",
  description:
    "Fast, practical web tools and clear guides that help you plan, calculate and get things done.",
};

export type ToolDefinition = {
  slug: string;
  name: string;
  description: string;
  category: "Travel" | "Calculators" | "Productivity";
  icon: string;
  featured?: boolean;
};

export const tools: ToolDefinition[] = [
  {
    slug: "travel-budget-planner",
    name: "Travel Budget Planner",
    description: "Estimate a complete trip budget with flights, lodging, food, activities, transport and a safety buffer.",
    category: "Travel",
    icon: "✈",
    featured: true,
  },
  {
    slug: "trip-packing-checklist",
    name: "Trip Packing Checklist",
    description: "Build a practical packing list based on trip type and duration.",
    category: "Travel",
    icon: "✓",
    featured: true,
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate percentages, discounts and percentage changes instantly.",
    category: "Calculators",
    icon: "%",
    featured: true,
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description: "Convert common length and weight units in a few clicks.",
    category: "Calculators",
    icon: "↔",
  },
];

export type GuideDefinition = {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  category: "Travel" | "Calculators";
};

export const guides: GuideDefinition[] = [
  {
    slug: "how-to-plan-a-travel-budget",
    title: "How to plan a realistic travel budget",
    description: "A simple framework for flights, lodging, food, activities, local transport and contingency money.",
    readTime: "7 min",
    category: "Travel",
  },
  {
    slug: "how-much-money-do-i-need-for-a-trip",
    title: "How much money do I need for a trip?",
    description: "A practical way to estimate total cost, daily spending and per-person budget before you book.",
    readTime: "6 min",
    category: "Travel",
  },
  {
    slug: "15-minute-packing-system",
    title: "The 15-minute packing system",
    description: "A repeatable checklist method that cuts last-minute packing mistakes.",
    readTime: "5 min",
    category: "Travel",
  },
  {
    slug: "percentage-calculations-without-confusion",
    title: "Percentage calculations without confusion",
    description: "Discounts, markups, percentage increase and percentage difference explained simply.",
    readTime: "7 min",
    category: "Calculators",
  },
  {
    slug: "choose-the-right-unit-for-conversions",
    title: "How to choose the right unit when converting measurements",
    description: "A quick guide to common metric and imperial measurement conversions.",
    readTime: "4 min",
    category: "Calculators",
  },
];
