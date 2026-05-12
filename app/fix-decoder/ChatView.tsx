"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
  Sparkles,
  ArrowUp,
  RotateCcw,
  Copy,
  Check,
  Zap,
  Eraser,
  AlertCircle,
} from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import toast from "react-hot-toast";

import PageSkeleton from "../components/PageSkeleton";
import { cn } from "../libs/utils";

// ── FIX helpers ───────────────────────────────────────────────────────────────

const MSG_TYPE_MAP: Record<string, string> = {
  "0": "Heartbeat",
  "1": "Test Request",
  "2": "Resend Request",
  "3": "Reject",
  "4": "Sequence Reset",
  "5": "Logout",
  "8": "Execution Report",
  "9": "Order Cancel Reject",
  A: "Logon",
  D: "New Order Single",
  F: "Order Cancel Request",
  G: "Order Cancel/Replace",
  H: "Order Status Request",
  V: "Market Data Request",
  W: "Market Data Snapshot",
};

function detectMsgType(raw: string): string | undefined {
  const match = raw.match(/35=([^|\x01\s]+)/);
  if (!match) return undefined;
  return MSG_TYPE_MAP[match[1]] ?? `MsgType ${match[1]}`;
}

const EXAMPLE_FIX =
  "8=FIX.4.2|9=287|35=8|49=EXCHANGE_1|56=TRDR_ALPHA|34=67|52=20240315-09:32:11.923|11=ORD-20240315-001|37=EXCH-ORD-88821|17=EXEC-20240315-004|150=1|39=1|55=AAPL|54=1|38=500|32=200|31=182.71|14=200|151=300|6=182.71|30=NYSE|58=Partial fill - liquidity exhausted at level|75=20240315|60=20240315-09:32:11.901|207=XNAS|9430=DARKPOOL_ROUTE|9431=1|10=214|";

// ── Sub-components ────────────────────────────────────────────────────────────

function Prose({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-gray-700">
      {text
        .split(/\n\n+/)
        .filter(Boolean)
        .map((para, pi) => (
          <p key={pi}>
            {para.split("\n").map((line, li) => (
              <span key={li}>
                {li > 0 && <br />}
                {line.split(/(\*\*[^*]+\*\*)/).map((chunk, ci) =>
                  chunk.startsWith("**") && chunk.endsWith("**") ? (
                    <strong key={ci} className="font-semibold text-blue-950">
                      {chunk.slice(2, -2)}
                    </strong>
                  ) : (
                    <span key={ci}>{chunk}</span>
                  )
                )}
              </span>
            ))}
          </p>
        ))}
    </div>
  );
}

function FixTokens({ raw }: { raw: string }) {
  return (
    <div className="font-mono text-xs leading-relaxed break-all">
      {raw
        .split(/\||\x01/)
        .filter(Boolean)
        .map((part, pi) => {
          const eq = part.indexOf("=");
          const key = eq > -1 ? part.slice(0, eq) : part;
          const val = eq > -1 ? part.slice(eq + 1) : "";
          return (
            <span key={pi}>
              {pi > 0 && (
                <span className="text-gray-300 mx-1 select-none">│</span>
              )}
              <span className="text-gray-500">{key}</span>
              <span className="text-gray-400">=</span>
              <span className="text-blue-900">{val}</span>
            </span>
          );
        })}
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Analyzing</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-blue-900 animate-bounce"
            style={{ animationDelay: `${i * 180}ms`, animationDuration: "1s" }}
          />
        ))}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast.success("Copied");
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error("Copy failed");
        }
      }}
      aria-label="Copy"
      className={cn(
        "rounded p-1.5 transition-colors",
        copied
          ? "text-emerald-600 bg-emerald-50"
          : "text-blue-900 hover:bg-blue-50"
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FixPlainer() {
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/fix-decoder/chat" }),
  });
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [input]);

  const canSubmit = input.trim().length > 0 && status === "ready";

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;
    const messageToSend = input;
    setInput("");
    await sendMessage({ text: messageToSend });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const isEmpty = messages.length === 0 && status === "ready";

  return (
    <PageSkeleton
      title="FIX Decoder"
      subtitle="Paste any raw FIX message for an instant field-by-field analysis, lifecycle context, and anomaly flagging."
      size="lg"
    >
      {/* ── Conversation ── */}
      <div className="flex flex-col gap-4">
        {isEmpty ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
            <div className="font-mono text-[11px] leading-relaxed mb-4 break-all">
              {[
                "8=FIX.4.2",
                "35=D",
                "49=TRDR_ALPHA",
                "56=EXCHANGE_1",
                "55=AAPL",
                "44=182.75",
              ].map((part, i) => {
                const [k, ...vs] = part.split("=");
                const v = vs.join("=");
                return (
                  <span key={i}>
                    {i > 0 && (
                      <span className="text-gray-300 mx-1">│</span>
                    )}
                    <span className="text-gray-500">{k}</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-blue-900">{v}</span>
                  </span>
                );
              })}
              <span className="text-gray-400"> ...</span>
            </div>
            <p className="text-sm text-gray-500">
              Paste a FIX message below to get started.
            </p>
          </div>
        ) : (
          <>
            {messages
              .filter(
                (msg) =>
                  msg.role === "user" ||
                  msg.parts?.some(
                    (p) => p.type === "text" && p.text?.length
                  )
              )
              .map((msg) => {
                const userText =
                  msg.parts?.find((p) => p.type === "text")?.text ?? "";

                if (msg.role === "user") {
                  return (
                    <div
                      key={msg.id}
                      className="relative rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-950" />
                      <div className="pl-4 pr-3 py-3">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                              Input
                            </span>
                            {detectMsgType(userText) && (
                              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-100">
                                <Zap size={9} />
                                {detectMsgType(userText)}
                              </span>
                            )}
                          </div>
                          <CopyButton text={userText} />
                        </div>
                        <FixTokens raw={userText} />
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className="relative rounded-lg border border-gray-200 bg-gray-50 shadow-sm overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                    <div className="pl-4 pr-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={12} className="text-blue-900" />
                        <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                          Analysis
                        </span>
                      </div>
                      {msg.parts?.map((part, i) => {
                        if (part.type !== "text") return null;
                        return (
                          <Prose key={`${msg.id}-${i}`} text={part.text} />
                        );
                      })}
                      {status === "streaming" && (
                        <span className="inline-block w-1 h-3.5 bg-blue-900 ml-0.5 align-text-bottom animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}

            {status === "submitted" && (
              <div className="relative rounded-lg border border-gray-200 bg-gray-50 shadow-sm overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-900" />
                <div className="pl-4 pr-4 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={12} className="text-blue-900" />
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                      Analysis
                    </span>
                  </div>
                  <ThinkingDots />
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="relative rounded-lg border border-amber-200 bg-amber-50 shadow-sm overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                <div className="pl-4 pr-4 py-3 flex items-start gap-2">
                  <AlertCircle
                    size={14}
                    className="text-amber-600 shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-amber-900">
                    Something went wrong. Check the server and try again.
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* ── Input ── */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <label
            htmlFor="fix-input"
            className="text-sm font-medium text-blue-950 flex items-center gap-2"
          >
            <Sparkles size={16} />
            FIX message
          </label>
          <div className="flex items-center gap-3">
            {!input.trim() && (
              <button
                type="button"
                onClick={() => {
                  setInput(EXAMPLE_FIX);
                  textareaRef.current?.focus();
                }}
                className="text-xs text-blue-900 hover:underline flex items-center gap-1"
              >
                <Zap size={12} />
                Load example
              </button>
            )}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
              >
                <RotateCcw size={12} />
                Clear chat
              </button>
            )}
          </div>
        </div>

        <textarea
          id="fix-input"
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="8=FIX.4.2|35=D|49=CLIENT|56=BROKER|..."
          spellCheck={false}
          autoFocus
          className="border border-gray-300 rounded-lg bg-white px-3 py-3 font-mono text-xs min-h-[88px] max-h-40 resize-y focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 transition-shadow"
        />

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-[11px] text-gray-400">
            ↵ submit · ⇧↵ newline
          </span>
          <div className="flex gap-3 ml-auto">
            {input && (
              <button
                type="button"
                onClick={() => setInput("")}
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
              >
                <Eraser size={14} />
                Clear input
              </button>
            )}
            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all",
                canSubmit
                  ? "bg-blue-950 text-white hover:bg-blue-900 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[3px] hover:-translate-y-[3px]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              <ArrowUp size={14} strokeWidth={2.5} />
              {status === "submitted" || status === "streaming"
                ? "Decoding..."
                : "Decode"}
            </button>
          </div>
        </div>
      </form>
    </PageSkeleton>
  );
}
