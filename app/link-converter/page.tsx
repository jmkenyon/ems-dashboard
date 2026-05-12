"use client";

import React, { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Check,
  Copy,
  Link2,
  AlertCircle,
  Eraser,
  Upload,
  FileCode,
} from "lucide-react";

import PageSkeleton from "../components/PageSkeleton";
import { Button } from "@/components/ui/button";
import { cn } from "../libs/utils";
import {
  ConvertResult,
  convertMany,
  rewriteBookmarkHtml,
} from "@/lib/confluenceToSharepoint";

const LinkConverterPage = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ConvertResult[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [fileStats, setFileStats] = useState<{
    matched: number;
    converted: number;
  } | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const lineCount = useMemo(
    () => input.split(/\r?\n/).filter((l) => l.trim()).length,
    [input]
  );

  const successCount = results.filter((r) => r.ok).length;
  const skippedCount = results.length - successCount;

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

  const processFile = (file: File) => {
    if (!/\.html?$/i.test(file.name) && file.type !== "text/html") {
      toast.error("Please choose an .html bookmark export.");
      return;
    }
    setIsProcessingFile(true);
    setFileName(file.name);
    setFileStats(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== "string") return;
        const { rewritten, converted, matched } = rewriteBookmarkHtml(content);
        setFileStats({ converted, matched });
        if (matched === 0) {
          toast.error("No Confluence links found in that file.");
          return;
        }
        const blob = new Blob([rewritten], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name.replace(/(\.html?)?$/i, "-converted.html");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Converted ${converted} of ${matched} links`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to process file");
      } finally {
        setIsProcessingFile(false);
      }
    };
    reader.onerror = () => {
      setIsProcessingFile(false);
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  return (
    <PageSkeleton
      title="Link Converter"
      subtitle="Convert Confluence URLs (confluence.ssnc-corp.cloud) to their SharePoint equivalents. Paste URLs below, or drop a bookmark HTML export."
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
          <span className="text-xs text-gray-500">
            {lineCount} {lineCount === 1 ? "URL" : "URLs"}
          </span>
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
            {skippedCount > 0 && (
              <StatPill
                tone="error"
                label={`${skippedCount} not Confluence`}
              />
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

      {/* ── Bookmark HTML upload ─────────────────────────────────────── */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 size-9 rounded-lg bg-blue-50 text-blue-950 flex items-center justify-center">
            <FileCode size={16} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-blue-950">
              Convert a bookmark HTML export
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Export your bookmarks as HTML, drop it here, and get back a
              rewritten file you can re-import. Non-Confluence links are left
              untouched.
            </p>
          </div>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={cn(
            "border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-all",
            isDragOver
              ? "border-blue-950 bg-blue-50 scale-[1.01]"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400",
            isProcessingFile && "opacity-50 cursor-not-allowed"
          )}
        >
          <Upload
            size={24}
            className={cn(
              "mx-auto mb-2",
              isDragOver ? "text-blue-950" : "text-gray-400"
            )}
          />
          <p className="text-sm font-medium text-blue-950">
            {isProcessingFile
              ? "Processing..."
              : isDragOver
              ? "Drop to convert"
              : "Drop bookmark HTML here, or click to choose a file"}
          </p>
          {fileName && !isProcessingFile && (
            <p className="mt-2 text-xs text-gray-500 font-mono break-all">
              {fileName}
            </p>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm,text/html"
          className="hidden"
          onChange={handleFileUpload}
        />
        {fileStats && (
          <p className="mt-3 text-sm text-gray-600">
            Found {fileStats.matched} Confluence link
            {fileStats.matched === 1 ? "" : "s"}, converted{" "}
            {fileStats.converted}.
          </p>
        )}
      </div>
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
          : "bg-amber-50 text-amber-800 border border-amber-200"
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
        result.ok ? "border-gray-200" : "border-amber-200"
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1",
          result.ok ? "bg-emerald-500" : "bg-amber-500"
        )}
      />
      <div className="pl-4 pr-3 py-3 flex flex-col gap-2 text-xs font-mono break-all">
        <div className="flex items-start gap-2">
          <span
            className={cn(
              "text-[10px] uppercase tracking-wide font-sans font-medium shrink-0 mt-0.5 w-10",
              result.ok ? "text-gray-400" : "text-amber-700"
            )}
          >
            {result.ok ? "From" : "Input"}
          </span>
          <a
            href={result.original}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex-1 hover:underline",
              result.ok
                ? "text-gray-600 hover:text-blue-900"
                : "text-amber-900"
            )}
          >
            {result.original}
          </a>
        </div>
        {result.ok ? (
          <div className="flex items-start gap-2">
            <span className="text-[10px] uppercase tracking-wide text-emerald-700 font-sans font-medium shrink-0 mt-0.5 w-10">
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
          <div className="flex items-start gap-2 pt-1 border-t border-amber-100">
            <AlertCircle
              size={14}
              className="text-amber-600 shrink-0 mt-0.5"
            />
            <span className="text-amber-800 font-sans flex-1 text-xs">
              Not a Confluence URL — left unchanged.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
