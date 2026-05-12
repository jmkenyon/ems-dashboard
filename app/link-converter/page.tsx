"use client";

import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Check, Copy, Link2, AlertCircle, Eraser } from "lucide-react";

import PageSkeleton from "../components/PageSkeleton";
import { Button } from "@/components/ui/button";
import { cn } from "../libs/utils";
import {
  ConvertResult,
  convertMany,
} from "@/lib/confluenceToSharepoint";

const EXAMPLE_URLS = `https://confluence.ssnc-corp.cloud/spaces/PST/pages/31327007/Eze+Product+Solutions+Home
https://confluence.ssnc-corp.cloud/spaces/EMS/pages/33710135/EMS+Home
https://confluence.ssnc-corp.cloud/spaces/OMS/pages/32499539/Eze+OMS+Home`;

const LinkConverterPage = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ConvertResult[]>([]);

  const lineCount = useMemo(
    () => input.split(/\r?\n/).filter((l) => l.trim()).length,
    [input]
  );

  const successCount = results.filter((r) => r.ok).length;
  const errorCount = results.length - successCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error("Paste at least one Confluence URL.");
      return;
    }
    setResults(convertMany(input));
  };

  const handleClear = () => {
    setInput("");
    setResults([]);
  };

  const loadExample = () => {
    setInput(EXAMPLE_URLS);
    setResults([]);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
      return true;
    } catch {
      toast.error("Copy failed");
      return false;
    }
  };

  const copyAll = async () => {
    const lines = results
      .filter((r): r is Extract<ConvertResult, { ok: true }> => r.ok)
      .map((r) => r.converted)
      .join("\n");
    if (!lines) {
      toast.error("Nothing to copy");
      return;
    }
    await copy(lines);
  };

  return (
    <PageSkeleton
      title="Link Converter"
      subtitle="Convert Confluence URLs (confluence.ssnc-corp.cloud) to their SharePoint equivalents. Paste one or many — one URL per line."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <label
            htmlFor="link-input"
            className="text-sm font-medium text-blue-950 flex items-center gap-2"
          >
            <Link2 size={16} />
            Confluence URLs
          </label>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>
              {lineCount} {lineCount === 1 ? "URL" : "URLs"}
            </span>
            <button
              type="button"
              onClick={loadExample}
              className="text-blue-900 hover:underline"
            >
              Load example
            </button>
          </div>
        </div>

        <textarea
          id="link-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://confluence.ssnc-corp.cloud/spaces/EMS/pages/33710135/EMS+Home"
          spellCheck={false}
          className="border border-gray-300 rounded-lg bg-white px-3 py-3 font-mono text-xs h-44 resize-y focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 transition-shadow"
        />

        <div className="flex flex-wrap gap-3 items-center">
          <Button
            type="submit"
            variant="elevated"
            className="rounded-full border-transparent px-5 bg-blue-950 text-white hover:bg-blue-900 hover:text-white hover:border-blue-950"
          >
            Convert
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={!input && results.length === 0}
            className="rounded-full"
          >
            <Eraser size={14} />
            Clear
          </Button>
          {results.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={copyAll}
              className="rounded-full ml-auto text-blue-900 hover:bg-blue-50"
            >
              <Copy size={14} />
              Copy all converted
            </Button>
          )}
        </div>
      </form>

      {results.length > 0 && (
        <>
          <div className="mt-8 flex flex-wrap gap-2 items-center">
            <StatPill
              tone="success"
              label={`${successCount} converted`}
            />
            {errorCount > 0 && (
              <StatPill tone="error" label={`${errorCount} skipped`} />
            )}
            <span className="text-xs text-gray-500 ml-1">
              of {results.length} total
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {results.map((r, i) => (
              <ResultCard key={i} result={r} onCopy={copy} />
            ))}
          </div>
        </>
      )}

      {results.length === 0 && (
        <div className="mt-10 border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-400">
          Converted URLs will appear here.
        </div>
      )}
    </PageSkeleton>
  );
};

export default LinkConverterPage;

function StatPill({
  tone,
  label,
}: {
  tone: "success" | "error";
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        tone === "success"
          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
          : "bg-red-50 text-red-800 border border-red-200"
      )}
    >
      {tone === "success" ? (
        <Check size={12} />
      ) : (
        <AlertCircle size={12} />
      )}
      {label}
    </span>
  );
}

function ResultCard({
  result,
  onCopy,
}: {
  result: ConvertResult;
  onCopy: (text: string) => Promise<boolean>;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result.ok) return;
    const ok = await onCopy(result.converted);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border bg-white shadow-sm overflow-hidden",
        result.ok ? "border-gray-200" : "border-red-200"
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1",
          result.ok ? "bg-emerald-500" : "bg-red-500"
        )}
      />
      <div className="pl-4 pr-3 py-3 flex flex-col gap-2 text-xs font-mono break-all">
        <div className="flex items-start gap-2">
          <span className="text-[10px] uppercase tracking-wide text-gray-400 font-sans font-medium shrink-0 mt-0.5">
            From
          </span>
          <a
            href={result.original}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-900 hover:underline flex-1"
          >
            {result.original}
          </a>
        </div>
        {result.ok ? (
          <div className="flex items-start gap-2">
            <span className="text-[10px] uppercase tracking-wide text-emerald-700 font-sans font-medium shrink-0 mt-0.5">
              To
            </span>
            <a
              href={result.converted}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-950 font-medium hover:underline flex-1"
            >
              {result.converted}
            </a>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy converted URL"
              className={cn(
                "rounded p-1.5 shrink-0 transition-colors",
                copied
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-blue-900 hover:bg-blue-50"
              )}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <span className="text-[10px] uppercase tracking-wide text-red-700 font-sans font-medium shrink-0 mt-0.5">
              Error
            </span>
            <span className="text-red-700 font-sans flex-1">
              {result.reason}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
