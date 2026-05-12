"use client";

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";

import PageSkeleton from "../components/PageSkeleton";
import FormButton from "../components/FormButton";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error("Paste at least one Confluence URL.");
      return;
    }
    setResults(convertMany(input));
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
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
      toast.error("Please drop an .html bookmark export.");
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

  const successCount = results.filter((r) => r.ok).length;

  return (
    <PageSkeleton
      title="Link Converter"
      subtitle="Convert Confluence URLs (confluence.ssnc-corp.cloud) to their SharePoint equivalents. Paste one or more URLs, or drop a browser bookmark export."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm sm:text-base font-medium text-blue-950">
          Paste Confluence URLs (one per line):
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://confluence.ssnc-corp.cloud/spaces/EMS/pages/33710135/EMS+Home"
          className="border border-gray-400 rounded bg-gray-50 px-3 py-2 font-mono text-xs h-40 resize-y"
        />
        <div className="flex gap-3 items-center">
          <FormButton>Convert</FormButton>
          {results.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={copyAll}
              className="rounded-full text-blue-950 hover:bg-blue-50"
            >
              Copy all converted
            </Button>
          )}
        </div>
      </form>

      {results.length > 0 && (
        <div className="mt-8 flex flex-col gap-3">
          <p className="text-sm text-gray-600">
            {successCount} of {results.length} converted
          </p>
          {results.map((r, i) => (
            <div
              key={i}
              className={cn(
                "border rounded p-3 flex flex-col gap-2 text-xs font-mono break-all",
                r.ok ? "border-gray-200 bg-gray-50" : "border-red-200 bg-red-50"
              )}
            >
              <div className="text-gray-500">{r.original}</div>
              {r.ok ? (
                <div className="flex items-start gap-2">
                  <div className="text-blue-950 flex-1">{r.converted}</div>
                  <button
                    type="button"
                    onClick={() => copy(r.converted)}
                    aria-label="Copy converted URL"
                    className="text-blue-950 hover:bg-blue-100 rounded p-1 shrink-0"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              ) : (
                <div className="text-red-700">{r.reason}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 border-t border-gray-200 pt-8 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-blue-950">
            Convert a bookmark folder
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Export a bookmark folder from your browser as HTML, drop it here,
            and you&apos;ll get back a rewritten file you can re-import.
          </p>
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
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragOver
              ? "border-blue-950 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100",
            isProcessingFile && "opacity-50 cursor-not-allowed"
          )}
        >
          <p className="text-blue-950 font-medium">
            {isProcessingFile
              ? "Processing..."
              : isDragOver
              ? "Drop to convert"
              : "Drop bookmark HTML here, or click to choose a file"}
          </p>
          {fileName && !isProcessingFile && (
            <p className="mt-2 text-xs text-gray-600 font-mono break-all">
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
          <p className="text-sm text-gray-600">
            Found {fileStats.matched} Confluence link
            {fileStats.matched === 1 ? "" : "s"}, converted {fileStats.converted}.
          </p>
        )}
      </div>
    </PageSkeleton>
  );
};

export default LinkConverterPage;
