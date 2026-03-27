"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getTokens } from "@/lib/api/client";
import {
  ChatCircleDots,
  X,
  PaperPlaneTilt,
  Spinner,
  Robot,
  User,
  ArrowsCounterClockwise,
  ArrowSquareOut,
} from "@phosphor-icons/react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Role = "user" | "model";

interface Message {
  role: Role;
  text: string;
  navigateTo?: string | null;
}

// ── Suggested prompts ──────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "What licences can I apply for?",
  "Show me open tenders",
  "How do I file a complaint?",
  "Check domain availability for myco.co.bw",
];

// ── Message bubble ─────────────────────────────────────────────────────────────

function MessageBubble({
  message,
  onNavigate,
}: {
  message: Message;
  onNavigate: (path: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
          isUser ? "bg-blue-600" : "bg-teal-600"
        }`}
      >
        {isUser ? (
          <User size={14} weight="fill" className="text-white" />
        ) : (
          <Robot size={14} weight="fill" className="text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-sm"
            : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
        }`}
      >
        {/* Format text with basic newline support */}
        {message.text ? (
          message.text.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < message.text.split("\n").length - 1 && <br />}
            </span>
          ))
        ) : (
          <span className="text-slate-400 italic">Navigating you there...</span>
        )}

        {/* Navigate button if the AI suggested navigation */}
        {!isUser && message.navigateTo && (
          <button
            onClick={() => onNavigate(message.navigateTo!)}
            className="mt-2 flex items-center gap-1.5 text-teal-600 font-semibold text-xs hover:text-teal-700 transition-colors"
          >
            <ArrowSquareOut size={13} weight="bold" />
            Go there now
          </button>
        )}
      </div>
    </div>
  );
}

// ── Typing indicator ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
        <Robot size={14} weight="fill" className="text-white" />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function AIAssistant() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleNavigate = useCallback(
    (path: string) => {
      router.push(path);
      setIsOpen(false);
    },
    [router]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      setError(null);

      const userMessage: Message = { role: "user", text: text.trim() };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      try {
        const { accessToken } = getTokens();
        // Build message history for API (exclude latest message — sent separately)
        const history = updatedMessages.slice(0, -1).map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        }));
        const lastParts = [{ text: userMessage.text }];

        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...history, { role: "user", parts: lastParts }],
            authToken: accessToken ?? undefined,
          }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error ?? "Unexpected error");
        }

        const assistantMessage: Message = {
          role: "model",
          text: data.text,
          navigateTo: data.navigateTo ?? null,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Auto-navigate if instructed
        if (data.navigateTo) {
          setTimeout(() => handleNavigate(data.navigateTo), 1200);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong. Try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, handleNavigate]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* ── Chat panel ── */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-[1000] w-[calc(100vw-2rem)] max-w-sm flex flex-col bg-slate-50 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          style={{ maxHeight: "min(600px, calc(100vh - 120px))" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-teal-600 text-white flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Robot size={18} weight="fill" />
              </div>
              <div>
                <p className="font-bold text-sm">BOCRA Assistant</p>
                <p className="text-[10px] text-teal-100">Powered by AI</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleReset}
                  title="New conversation"
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <ArrowsCounterClockwise size={16} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.length === 0 ? (
              /* Welcome state */
              <div className="space-y-4">
                <div className="text-center pt-2">
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
                    <Robot size={28} weight="fill" className="text-teal-600" />
                  </div>
                  <p className="font-bold text-slate-900 text-sm">
                    Hi! I&apos;m your BOCRA Assistant
                  </p>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    I can find information, check domains, navigate the site,
                    and answer your regulatory questions.
                  </p>
                </div>

                {/* Suggested prompts */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Try asking
                  </p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="w-full text-left text-xs text-slate-700 bg-white hover:bg-teal-50 hover:text-teal-700 border border-slate-200 hover:border-teal-300 rounded-xl px-3.5 py-2.5 transition-all font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Conversation */
              <>
                {messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} onNavigate={handleNavigate} />
                ))}
                {loading && <TypingIndicator />}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3.5 py-2.5 text-xs">
                    {error}
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-3 border-t border-slate-200 bg-white flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              disabled={loading}
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              {loading ? (
                <Spinner size={16} className="animate-spin" />
              ) : (
                <PaperPlaneTilt size={16} weight="fill" />
              )}
            </button>
          </form>
        </div>
      )}

      {/* ── Floating toggle button ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        className={`fixed bottom-6 right-4 md:right-6 z-[1000] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          isOpen
            ? "bg-slate-700 hover:bg-slate-800 rotate-0"
            : "bg-teal-600 hover:bg-teal-700 hover:scale-110"
        }`}
      >
        {isOpen ? (
          <X size={22} className="text-white" />
        ) : (
          <ChatCircleDots size={26} weight="fill" className="text-white" />
        )}

        {/* Pulse ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-30 pointer-events-none" />
        )}
      </button>
    </>
  );
}
