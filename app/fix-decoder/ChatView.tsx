"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
  Sparkles,
  ArrowUp,
  RotateCcw,
  Terminal,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

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

function getTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

const EXAMPLE_FIX =
  "8=FIX.4.2|9=287|35=8|49=EXCHANGE_1|56=TRDR_ALPHA|34=67|52=20240315-09:32:11.923|11=ORD-20240315-001|37=EXCH-ORD-88821|17=EXEC-20240315-004|150=1|39=1|55=AAPL|54=1|38=500|32=200|31=182.71|14=200|151=300|6=182.71|30=NYSE|58=Partial fill - liquidity exhausted at level|75=20240315|60=20240315-09:32:11.901|207=XNAS|9430=DARKPOOL_ROUTE|9431=1|10=214|";

// ── Sub-components ────────────────────────────────────────────────────────────

function Prose({ text }: { text: string }) {
  return (
    <div className="space-y-3">
      {text
        .split(/\n\n+/)
        .filter(Boolean)
        .map((para, pi) => (
          <p key={pi} className="text-[13.5px] leading-[1.75] text-slate-300">
            {para.split("\n").map((line, li) => (
              <span key={li}>
                {li > 0 && <br />}
                {line.split(/(\*\*[^*]+\*\*)/).map((chunk, ci) =>
                  chunk.startsWith("**") && chunk.endsWith("**") ? (
                    <strong key={ci} className="font-semibold text-slate-100">
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
    <div className="font-mono text-[11.5px] leading-loose break-all">
      {raw
        .split(/\||\x01/)
        .filter(Boolean)
        .map((part, pi) => {
          const eq = part.indexOf("=");
          const key = eq > -1 ? part.slice(0, eq) : part;
          const val = eq > -1 ? part.slice(eq + 1) : "";
          return (
            <span key={pi} className="group/tok">
              {pi > 0 && (
                <span className="text-slate-600 mx-1 select-none">│</span>
              )}
              <span className="text-slate-500 group-hover/tok:text-amber-500 transition-colors">
                {key}
              </span>
              <span className="text-slate-600">=</span>
              <span className="text-sky-400 group-hover/tok:text-amber-300 transition-colors">
                {val}
              </span>
            </span>
          );
        })}
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="font-mono text-[10px] text-slate-500 tracking-widest">
        PROCESSING
      </span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full bg-amber-400 animate-bounce"
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
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1 font-mono text-[9px] tracking-widest text-slate-500 hover:text-amber-400 transition-colors"
    >
      {copied ? <Check size={9} /> : <Copy size={9} />}
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FixPlainer() {
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/fix-decoder/chat" }),
  });
  const [input, setInput] = useState("");

  const [clock, setClock] = useState<string>(() => getTimestamp());

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

  useEffect(() => {
    const id = setInterval(() => setClock(getTimestamp()), 1000);
    return () => clearInterval(id);
  }, []);

  const canSubmit = input.trim().length > 0 && status === "ready";

  async function handleSubmit() {
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

  const today = new Date()
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

        .fixplainer { font-family: 'IBM Plex Sans', sans-serif; }
        .fixplainer .font-mono  { font-family: 'IBM Plex Mono', monospace !important; }

        .fix-textarea { caret-color: #f59e0b; font-family: 'IBM Plex Mono', monospace; }
        .fix-textarea::placeholder { color: #334155; font-size: 12px; }
        .fix-textarea::-webkit-scrollbar { display: none; }

        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0   rgba(16,185,129,0.5); }
          70%       { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }

        .msg-in       { animation: fadeUp 0.25s ease forwards; }
        .cursor-blink { animation: cursorBlink 1s step-end infinite; }
        .live-dot     { animation: livePulse 2.5s ease-in-out infinite; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .scanlines {
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px
          );
        }
        .glow-amber {
          box-shadow: 0 0 14px rgba(245,158,11,0.25);
        }
        .send-glow {
          box-shadow: 0 0 14px rgba(245,158,11,0.3);
        }
        .input-wrap {
          border-color: rgba(245,158,11,0.4) !important;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.08), 0 20px 50px rgba(0,0,0,0.6);
        }
        .input-wrap:focus-within {
          border-color: rgba(245,158,11,0.7) !important;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.15), 0 20px 50px rgba(0,0,0,0.6);
        }
      `}</style>

      <div className="fixplainer flex flex-col min-h-[calc(100vh-4rem)] bg-[#060a0e] relative overflow-hidden">
        {/* Backgrounds */}
        <div className="grid-bg absolute inset-0 z-0 pointer-events-none" />
        <div className="scanlines absolute inset-0 z-1 pointer-events-none" />
        <div className="absolute -top-[30vh] -left-[15vw] w-[55vw] h-[55vw] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(245,158,11,0.04)_0%,transparent_65%)]" />
        <div className="absolute -bottom-[20vh] -right-[15vw] w-[45vw] h-[45vw] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(99,102,241,0.04)_0%,transparent_65%)]" />

        {/* ── Header ── */}
        <header className="relative z-10 flex items-center justify-between px-6 h-13 border-b border-[#0c1520] bg-[#060a0e]/95 backdrop-blur-xl shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-[5px] flex items-center justify-center bg-linear-to-br from-amber-400 to-amber-600 glow-amber">
              <Terminal size={12} color="#060a0e" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <div className="font-mono text-[13px] font-semibold text-slate-100 tracking-[0.06em]">
                FIX<span className="text-amber-400">DECODER</span>
              </div>
              <div className="font-mono text-[8px] text-slate-500 tracking-[0.18em] mt-0.5">
                PROTOCOL ANALYZER
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="live-dot w-1.25 h-1.25 rounded-full bg-emerald-400" />
              <span className="font-mono text-[9px] text-emerald-400 tracking-widest">
                CONNECTED
              </span>
            </div>
            <div className="w-px h-4 bg-[#0c1520]" />
            <span className="font-mono text-[9px] text-slate-500 tracking-[0.06em]">
              {today}
            </span>
            <span className="font-mono text-[9px] text-slate-400 tracking-[0.06em] tabular-nums">
              {clock}
            </span>
          </div>

          {/* Clear */}
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-slate-600 hover:text-red-400 border border-[#0c1520] hover:border-red-900/40 rounded px-2.5 py-1.5 transition-all bg-transparent"
            >
              <RotateCcw size={8} /> CLEAR
            </button>
          )}
        </header>

        {/* ── Scroll area ── */}
        <main className="relative z-10 flex-1 overflow-y-auto scrollbar-none px-4 pt-8 pb-52">
          <div className="max-w-185 mx-auto">
            {/* ── Empty state ── */}
            {messages.length === 0 && status === "ready" && (
              <div className="flex flex-col items-center justify-center min-h-[55vh] gap-10 text-center">
                {/* Terminal mockup */}
                <div className="w-full max-w-115 rounded-lg overflow-hidden border border-[#0c1520] shadow-[0_30px_70px_rgba(0,0,0,0.7)]">
                  {/* Title bar */}
                  <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#0a0d12] border-b border-[#0c1520]">
                    {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full opacity-60"
                        style={{ background: c }}
                      />
                    ))}
                    <span className="font-mono text-[9px] text-slate-500 ml-2 tracking-[0.14em]">
                      fix_analyzer — session_01
                    </span>
                  </div>
                  {/* Body */}
                  <div className="bg-[#070b0f] p-5">
                    <div className="font-mono text-[10px] text-slate-500 mb-3">
                      <span className="text-slate-400">$ </span>
                      analyze --protocol FIX4.2 --verbose
                    </div>
                    <div className="font-mono text-[11px] leading-loose mb-4">
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
                              <span className="text-slate-600 mx-1">│</span>
                            )}
                            <span className="text-slate-500">{k}</span>
                            <span className="text-slate-600">=</span>
                            <span className="text-sky-400">{v}</span>
                          </span>
                        );
                      })}
                      <span className="text-slate-600"> ...</span>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-[#0c1520]">
                      <span className="font-mono text-[9px] text-slate-500 tracking-widest">
                        AWAITING INPUT
                      </span>
                      <div className="flex gap-1 ml-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1 h-1 rounded-full bg-amber-400/60 animate-bounce"
                            style={{
                              animationDelay: `${i * 200}ms`,
                              animationDuration: "1.4s",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-mono text-[9px] text-slate-500 tracking-[0.2em]">
                    FIX PROTOCOL INTELLIGENCE
                  </p>
                  <p className="text-sm text-slate-400 max-w-xs leading-relaxed mx-auto">
                    Paste any raw FIX message for instant field-by-field
                    analysis, lifecycle context, and anomaly flagging.
                  </p>
                </div>
              </div>
            )}
            {messages
              .filter(
                (msg) =>
                  msg.role === "user" ||
                  msg.parts?.some((p) => p.type === "text" && p.text?.length)
              )
              .map((msg) => {
                const userText =
                  msg.parts?.find((p) => p.type === "text")?.text ?? "";

                return (
                  <div
                    key={msg.id}
                    className="msg-in border-b border-[#0a0d12] py-5 last:border-0"
                  >
                    {msg.role === "user" && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-slate-500 tracking-[0.14em]">
                              INPUT
                            </span>
                            {detectMsgType(userText) && (
                              <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm border border-amber-900/40 bg-amber-950/30 text-amber-400">
                                <Zap size={7} /> {detectMsgType(userText)}
                              </span>
                            )}
                          </div>
                          <CopyButton text={userText} />
                        </div>
                        <div className="px-4 py-3 bg-[#070b0f] rounded-sm border border-[#0c1520] border-l-2 border-l-amber-500/50">
                          <FixTokens raw={userText} />
                        </div>
                      </div>
                    )}

                    {msg.role === "assistant" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded flex items-center justify-center border border-amber-900/30 bg-amber-950/20">
                            <Sparkles size={9} className="text-amber-400" />
                          </div>
                          <span className="font-mono text-[9px] text-slate-500 tracking-[0.14em]">
                            ANALYSIS
                          </span>
                        </div>
                        <div className="pl-6 border-l border-[#141d28]">
                          {msg.parts?.map((part, i) => {
                            if (part.type !== "text") return null;
                            return (
                              <Prose key={`${msg.id}-${i}`} text={part.text} />
                            );
                          })}
                          {status === "streaming" && (
                            <span className="cursor-blink inline-block w-1.25 h-3 bg-amber-400 ml-0.5 align-text-bottom" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

            {/* Thinking state — before any parts arrive */}
            {status === "submitted" && (
              <div className="msg-in border-b border-[#0a0d12] py-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center border border-amber-900/40 bg-amber-950/20">
                    <Sparkles size={9} className="text-amber-400" />
                  </div>
                  <span className="font-mono text-[9px] text-slate-500 tracking-[0.14em]">
                    ANALYSIS
                  </span>
                </div>
                <div className="pl-6 border-l border-[#141d28]">
                  <ThinkingDots />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </main>

        {/* ── Input dock ── */}
        <div
          className="sticky bottom-0 left-0 w-full z-20 px-4 pb-5 pt-3"
          style={{
            background: "linear-gradient(to top, #060a0e 55%, transparent)",
          }}
        >
          <div className="max-w-185 mx-auto space-y-2">
            {/* Dock label */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="w-px h-3 bg-amber-500/60" />
                <span className="font-mono text-[9px] text-amber-500/80 tracking-[0.16em]">
                  PASTE FIX MESSAGE OR ASK A FOLLOW-UP
                </span>
              </div>
              {!input.trim() && (
                <button
                  onClick={() => {
                    setInput(EXAMPLE_FIX);
                    textareaRef.current?.focus();
                  }}
                  className="flex cursor-pointer items-center gap-1.5 font-mono text-[9px] tracking-widest text-slate-500 hover:text-amber-400 border border-[#0c1520] hover:border-amber-900/40 rounded px-2 py-1 transition-all bg-transparent"
                >
                  <Zap size={8} /> LOAD EXAMPLE
                </button>
              )}
            </div>

            {/* Input box */}
            <div className="input-wrap flex items-end gap-3 bg-[#070b0f] border border-[#0c1520] rounded-md px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-colors">
              <span className="font-mono text-amber-500 text-sm self-end mb-0.5 select-none">
                ›
              </span>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="8=FIX.4.2|35=D|49=CLIENT|56=BROKER|..."
                autoFocus
                className="fix-textarea flex-1 resize-none bg-transparent outline-none text-[12px] text-sky-400 leading-relaxed max-h-36 overflow-y-hidden"
              />
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-8 h-8 rounded flex items-center justify-center shrink-0 self-end transition-all ${
                  canSubmit
                    ? "bg-amber-400 hover:bg-amber-300 cursor-pointer send-glow"
                    : "bg-[#0c1520] cursor-not-allowed"
                }`}
              >
                <ArrowUp
                  size={13}
                  className={canSubmit ? "text-[#060a0e]" : "text-slate-600"}
                  strokeWidth={2.5}
                />
              </button>
            </div>

            <div className="flex justify-between px-1">
              <span className="font-mono text-[9px] text-slate-600 tracking-[0.06em]">
                ↵ submit · ⇧↵ newline
              </span>
              <span className="font-mono text-[9px] text-slate-600 tracking-[0.06em]">
                VERIFY ALL CRITICAL TRADE DATA INDEPENDENTLY
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
