import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

type ArticleSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type ArticleContent = {
  intro: string;
  sections: ArticleSection[];
  callout?: string;
  toolHref?: string;
  toolLabel?: string;
};

const articles: Record<string, ArticleContent> = {
  "how-to-plan-a-travel-budget": {
    intro: "A useful travel budget is not one big guess. It is a set of smaller estimates you can check and adjust before you book.",
    sections: [
      {
        heading: "1. Start with the fixed costs",
        paragraphs: [
          "Begin with the expenses that are easiest to estimate: flights or long-distance transport, accommodation, travel insurance and any visa or entry fees. These costs usually decide whether a trip fits your budget at all.",
          "For lodging, multiply the price per room by the number of rooms and nights. If your trip is seven days but you return on the seventh day, you may only need six hotel nights.",
        ],
      },
      {
        heading: "2. Estimate daily spending",
        paragraphs: [
          "Next, estimate food, local transport and activities per day. Use the number of travelers where the cost is per person. Keep shared costs, such as a taxi or rental car, separate so you do not accidentally multiply them twice.",
        ],
        bullets: [
          "Food: daily amount × travelers × trip days",
          "Activities: daily amount × travelers × trip days",
          "Local transport: daily shared estimate × trip days",
        ],
      },
      {
        heading: "3. Add a realistic safety buffer",
        paragraphs: [
          "Prices change, plans move and small expenses add up. A contingency amount helps absorb those changes without breaking the trip budget. Ten percent is a useful starting point, but the right amount depends on how predictable your trip is.",
        ],
      },
      {
        heading: "4. Compare the total with a target",
        paragraphs: [
          "Once you have a total, compare it with the maximum amount you actually want to spend. If you are over target, change one category at a time. Lodging, flights and activities usually give you more room to save than cutting a small daily food budget.",
          "Also look at cost per traveler and cost per day. Those two numbers make it easier to compare different trip lengths and destinations.",
        ],
      },
      {
        heading: "5. Recheck prices before booking",
        paragraphs: [
          "A budget calculator is a planning tool, not a live quote. Recheck current airfare, hotel rates, exchange rates and activity prices before you commit money.",
        ],
      },
    ],
    callout: "The fastest way to improve a travel budget is to replace guesses with current prices, one category at a time.",
    toolHref: "/tools/travel-budget-planner",
    toolLabel: "Build your travel budget",
  },
  "how-much-money-do-i-need-for-a-trip": {
    intro: "The amount you need for a trip depends on destination, trip length, number of travelers and how you travel. A simple formula gives you a much better answer than a generic daily-budget number.",
    sections: [
      {
        heading: "Use a complete trip-cost formula",
        paragraphs: [
          "Add your transport to the destination, accommodation, food, activities, local transport, insurance and other known costs. Then add a contingency buffer. This produces a total trip estimate instead of a daily-spending estimate that ignores major expenses.",
        ],
      },
      {
        heading: "Separate shared and per-person costs",
        paragraphs: [
          "Flights and meals are normally per person. A hotel room, taxi or rental car may be shared. Separating those categories avoids one of the most common budgeting errors for couples, families and groups.",
        ],
      },
      {
        heading: "Calculate three useful numbers",
        bullets: [
          "Total trip budget: the full amount you expect to spend",
          "Per-person budget: useful when travelers are splitting costs",
          "Per-day budget: useful when comparing trip lengths",
        ],
        paragraphs: [
          "These numbers answer different questions. A seven-day trip may have a higher total but a lower daily cost than a short weekend trip because flights are spread across more days.",
        ],
      },
      {
        heading: "Do not forget the costs before and after the trip",
        paragraphs: [
          "Airport transfers, baggage fees, travel insurance, phone data, parking, pet care and small pre-trip purchases can sit outside the obvious holiday budget. Add them under miscellaneous rather than pretending they do not exist.",
        ],
      },
      {
        heading: "Set a maximum before you book",
        paragraphs: [
          "Choose a budget target first, then compare your estimate with it. If the plan is over target, reduce the largest flexible categories before cutting essentials. This is usually more effective than trying to save tiny amounts everywhere.",
        ],
      },
    ],
    callout: "There is no universal amount you need for a trip. The useful answer is the total for your specific dates, travelers and travel style.",
    toolHref: "/tools/travel-budget-planner",
    toolLabel: "Estimate how much your trip needs",
  },
  "15-minute-packing-system": {
    intro: "Packing gets easier when you stop trying to remember everything at once and work through a few repeatable categories.",
    sections: [
      {
        heading: "Start with essentials",
        bullets: ["ID or passport", "Money and payment methods", "Medication", "Phone and charger", "Tickets or booking details"],
        paragraphs: ["Pack these first because forgetting one can create a real travel problem. Everything else is easier to replace."],
      },
      {
        heading: "Pack by activity, not by item type",
        paragraphs: ["Think through a normal day at your destination: sleep, breakfast, walking, planned activities, dinner and weather changes. This catches missing items faster than staring at an empty suitcase."],
      },
      {
        heading: "Use a final five-minute check",
        paragraphs: ["Before closing the bag, check documents, medication, chargers, weather-specific gear and anything you cannot easily buy after departure."],
      },
    ],
    toolHref: "/tools/trip-packing-checklist",
    toolLabel: "Open the packing checklist",
  },
  "percentage-calculations-without-confusion": {
    intro: "Most percentage problems become simple once you identify the base value and the percentage you are applying to it.",
    sections: [
      {
        heading: "Finding a percentage of a value",
        paragraphs: ["Convert the percentage to a decimal and multiply it by the value. For example, 20% of 250 is 0.20 × 250."],
      },
      {
        heading: "Discounts and markups",
        paragraphs: ["For a discount, subtract the percentage amount from the original value. For a markup, add it. Keep the original value clear because it is the base for the calculation."],
      },
      {
        heading: "Percentage change",
        paragraphs: ["Subtract the old value from the new value, divide the difference by the old value, then multiply by 100. A negative result means a decrease."],
      },
    ],
    toolHref: "/tools/percentage-calculator",
    toolLabel: "Use the percentage calculator",
  },
  "choose-the-right-unit-for-conversions": {
    intro: "A unit conversion is reliable only when you know the starting unit, target unit and conversion factor.",
    sections: [
      {
        heading: "Identify the measurement type",
        paragraphs: ["Length, mass, volume and temperature use different conversion rules. Do not mix factors from different measurement types."],
      },
      {
        heading: "Keep the direction clear",
        paragraphs: ["Kilometres to miles uses a different factor from miles to kilometres. Writing the starting and target units beside the number prevents accidental reversal."],
      },
      {
        heading: "Round only at the end",
        paragraphs: ["Keep extra decimal places during the calculation and round the final result to the precision you actually need."],
      },
    ],
    toolHref: "/tools/unit-converter",
    toolLabel: "Open the unit converter",
  },
};

export function generateStaticParams() {
  return guides.map(guide => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find(item => item.slug === slug);
  if (!guide) return { title: "Guide not found" };

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: `/guides/${guide.slug}`,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find(item => item.slug === slug);
  const article = articles[slug];

  if (!guide || !article) notFound();

  return (
    <article className="page shell guide-article">
      <div className="breadcrumbs">
        <Link href="/">Home</Link><span>/</span><Link href="/guides">Guides</Link><span>/</span><span>{guide.title}</span>
      </div>

      <header className="page-intro">
        <div className="category-label">{guide.category}</div>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
        <div className="guide-meta"><span>{guide.readTime} read</span><span>GuideVexa editorial guide</span></div>
      </header>

      <div className="guide-body">
        <p className="lead">{article.intro}</p>

        {article.sections.map(section => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets ? <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul> : null}
          </section>
        ))}

        {article.callout ? <div className="guide-callout">{article.callout}</div> : null}

        {article.toolHref && article.toolLabel ? (
          <div className="guide-cta">
            <h2>Put the guide into practice</h2>
            <p>Use the matching GuideVexa tool with your own numbers and adjust the result as your plan changes.</p>
            <Link className="button" href={article.toolHref}>{article.toolLabel}</Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
