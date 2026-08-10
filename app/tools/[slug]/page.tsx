import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolRenderer } from "@/components/ToolRenderer";
import { tools } from "@/lib/site";
import { parseTravelBudgetSearchParams, type TravelBudgetSearchParams } from "@/lib/travelBudget";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<TravelBudgetSearchParams>;
};

export function generateStaticParams() {
  return tools.map(tool => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find(item => item.slug === slug);
  if (!tool) return { title: "Tool not found" };

  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: tool.name,
      description: tool.description,
      url: `/tools/${tool.slug}`,
      type: "website",
    },
  };
}

export default async function ToolPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const tool = tools.find(item => item.slug === slug);
  if (!tool) notFound();

  const isTravelBudget = slug === "travel-budget-planner";
  const initialTravelBudget = isTravelBudget
    ? parseTravelBudgetSearchParams(await searchParams)
    : undefined;

  return (
    <section className="page shell tool-page">
      <div className="breadcrumbs">
        <Link href="/">Home</Link><span>/</span><Link href="/tools">Tools</Link><span>/</span><span>{tool.name}</span>
      </div>
      <div className="page-intro compact">
        <span className="tool-icon large">{tool.icon}</span>
        <h1>{tool.name}</h1>
        <p>{tool.description}</p>
      </div>

      <ToolRenderer slug={slug} initialTravelBudget={initialTravelBudget} />

      {isTravelBudget ? (
        <div className="content-note">
          <h2>How to get a useful travel budget</h2>
          <p>Start with current prices for flights and accommodation, then estimate food, activities, local transport and insurance. Keep shared costs separate from per-person costs and add a safety buffer for price changes or unexpected expenses.</p>
          <p>The result is a planning estimate rather than a live quote. Recheck real prices before booking, especially airfare, hotel rates and exchange rates.</p>
          <p><Link className="text-link" href="/guides/how-to-plan-a-travel-budget">Read the travel budget guide →</Link></p>
        </div>
      ) : (
        <div className="content-note">
          <h2>How to use this tool</h2>
          <p>Enter your values, review the result and adjust the inputs until they match your real situation. GuideVexa tools run in your browser and are designed for quick, practical estimates.</p>
        </div>
      )}
    </section>
  );
}
