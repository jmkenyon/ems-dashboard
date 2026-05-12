"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";

import PageSkeleton from "../components/PageSkeleton";
import FormButton from "../components/FormButton";
import { Button } from "@/components/ui/button";
import { cn } from "../libs/utils";
import {
  ConvertResult,
  convertMany,
} from "@/lib/confluenceToSharepoint";

const LinkConverterPage = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ConvertResult[]>([]);

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

  const successCount = results.filter((r) => r.ok).length;

  return (
    <PageSkeleton
      title="Link Converter"
      subtitle="Convert Confluence URLs (confluence.ssnc-corp.cloud) to their SharePoint equivalents. Paste one or more URLs."
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
    </PageSkeleton>
  );
};

export default LinkConverterPage;
