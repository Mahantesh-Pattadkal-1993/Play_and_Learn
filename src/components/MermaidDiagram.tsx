"use client";

import { useEffect, useRef } from "react";

interface MermaidDiagramProps {
  chart: string;
  altText?: string;
  className?: string;
}

export default function MermaidDiagram({
  chart,
  altText = "Diagram",
  className = "",
}: MermaidDiagramProps) {
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    if (!chart) return;

    let isCancelled = false;

    const render = async () => {
      try {
        // Dynamic import to avoid SSR issues with mermaid
        const { default: mermaid } = await import("mermaid");

        mermaid.initialize({
          startOnLoad: true,
          // The app UI is always dark, so diagrams stay dark too. Every node
          // using an explicit light fill also declares a dark text colour.
          theme: "dark",
          themeVariables: {
            primaryColor: "#4F46E5",
            primaryTextColor: "#ffffff",
            primaryBorderColor: "#4F46E5",
            lineColor: "#64748b",
            secondaryColor: "#1E293B",
            tertiaryColor: "#0F172A",
          },
          flowchart: {
            curve: "basis",
            htmlLabels: true,
            useMaxWidth: true,
          },
          securityLevel: "loose",
        });

        // Clear previous content
        if (svgRef.current) {
          svgRef.current.innerHTML = "";
        }

        const { svg } = await mermaid.render(
          "mermaid-" + Math.random().toString(36).substr(2, 9),
          chart,
          svgRef.current ?? undefined,
        );

        if (!isCancelled && svgRef.current) {
          svgRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error("Mermaid render error:", error);
        if (svgRef.current && !isCancelled) {
          svgRef.current.innerHTML = `
            <div class="p-4 bg-slate-800 rounded-lg text-center text-slate-300">
              <p>Diagram could not be rendered.</p>
              <pre class="text-xs mt-2 whitespace-pre-wrap">${chart}</pre>
            </div>
          `;
        }
      }
    };

    render();

    return () => {
      isCancelled = true;
    };
  }, [chart]);

  return (
    <div
      ref={svgRef}
      className={`mermaid-diagram overflow-x-auto py-4 ${className}`}
      role="img"
      aria-label={altText}
    />
  );
}
