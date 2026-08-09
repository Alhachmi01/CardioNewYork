export const siteConfig = {
  name: "GuideVexa",
  url: "https://guidevexa.com",
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
    description: "Estimate a trip budget by days, travelers, lodging, food and activities.",
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

export const guides = [
  {
    title: "How to build a realistic travel budget",
    description: "A simple framework for transport, lodging, food, activities and contingency money.",
    readTime: "6 min",
    category: "Travel",
  },
  {
    title: "The 15-minute packing system",
    description: "A repeatable checklist method that cuts last-minute packing mistakes.",
    readTime: "5 min",
    category: "Travel",
  },
  {
    title: "Percentage calculations without confusion",
    description: "Discounts, markups, percentage increase and percentage difference explained simply.",
    readTime: "7 min",
    category: "Calculators",
  },
  {
    title: "How to choose the right unit when converting measurements",
    description: "A quick guide to common metric and imperial measurement conversions.",
    readTime: "4 min",
    category: "Calculators",
  },
];
