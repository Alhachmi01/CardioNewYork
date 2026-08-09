import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolRenderer } from "@/components/ToolRenderer";
import { tools } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tools.map(tool => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find(item => item.slug === slug);
  if (!tool) return { title: "Tool not found" };
  return { title: tool.name, description: tool.description };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find(item => item.slug === slug);
  if (!tool) notFound();
  return (
    <section className="page shell tool-page">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/tools">Tools</Link><span>/</span><span>{tool.name}</span></div>
      <div className="page-intro compact"><span className="tool-icon large">{tool.icon}</span><h1>{tool.name}</h1><p>{tool.description}</p></div>
      <ToolRenderer slug={slug} />
      <div className="content-note"><h2>How to use this tool</h2><p>Enter your values, review the result and adjust the inputs until they match your real situation. GuideVexa tools run in your browser and are designed for quick, practical estimates.</p></div>
    </section>
  );
}
