"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/LanguageContext";
import { IconSend, IconRobot, IconUser, IconInfo } from "@/components/Icons";

const CHAT_SUGGESTIONS = [
  "What is PM-KISAN scheme details?",
  "Documents required for Aadhaar Update?",
  "How to report water supply leakage?",
  "Explain Ayushman Bharat benefits."
];

function ChatBody() {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const prefill = searchParams.get("q") || "";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(prefill);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const hasAutoSent = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    setError("");
    const newHistory = [...messages, { role: "user", content }];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: newHistory.slice(0, -1),
          lang,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get a response.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (prefill && !hasAutoSent.current) {
      hasAutoSent.current = true;
      sendMessage(prefill);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill]);

  return (
    <main className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col min-h-[calc(100vh-80px)]">
        
        {/* Chat Header Card */}
        <div className="bg-white border border-slate-100/80 shadow-sm rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50/80 text-navy flex items-center justify-center border border-blue-100/50">
              <IconRobot className="w-5 h-5 text-navy" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-navy">
                  Smart Bharat Assistant
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] font-bold text-[#138808] uppercase tracking-wider">
                AI Agent Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5">
            <IconInfo className="w-3.5 h-3.5" />
            <span>Answers generated dynamically</span>
          </div>
        </div>

        {/* Message Log Card */}
        <div className="flex-1 bg-white border border-slate-100/80 shadow-sm rounded-2xl p-6 flex flex-col gap-4 overflow-y-auto max-h-[58vh] min-h-[350px]">
          
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center my-auto max-w-sm mx-auto text-center gap-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-navy shadow-sm">
                <IconRobot className="w-8 h-8 text-navy" />
              </div>
              <div>
                <h2 className="text-base font-bold text-navy mb-1">
                  How can I help you today?
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Ask about documents required for PM Awas Yojana, how to get a birth certificate, or details on ration cards. I can explain any local governance process.
                </p>
              </div>
            </div>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div
                key={i}
                className={`flex gap-3 max-w-[80%] items-start ${
                  isUser ? "self-end flex-row-reverse" : "self-start"
                }`}
              >
                {/* Bubble Avatar */}
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border text-xs ${
                  isUser 
                    ? "bg-navy text-white border-navy" 
                    : "bg-blue-50/50 text-navy border-blue-100/50"
                }`}>
                  {isUser ? <IconUser className="w-4 h-4" /> : <IconRobot className="w-4 h-4" />}
                </div>

                {/* Bubble Content */}
                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-relaxed font-medium whitespace-pre-line shadow-sm border ${
                    isUser
                      ? "bg-navy text-white border-navy rounded-tr-sm"
                      : "bg-[#F8FAFC] text-slate-800 border-slate-100/80 rounded-tl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%] items-start self-start">
              <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border bg-blue-50/50 text-navy border-blue-100/50">
                <IconRobot className="w-4 h-4" />
              </div>
              <div className="bg-[#F8FAFC] text-slate-400 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 text-xs font-semibold animate-pulse">
                Assistant is thinking...
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 text-rose-700 text-xs rounded-xl px-4 py-3 border border-rose-100 font-semibold max-w-md mx-auto text-center shadow-sm">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested Chips Floating Area */}
        {messages.length === 0 && (
          <div className="mt-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
              Suggested Topics
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CHAT_SUGGESTIONS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => sendMessage(topic)}
                  className="text-left text-xs bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200/80 px-4 py-3 rounded-xl transition-all duration-200 hover:border-slate-300 shadow-sm"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Capsule Box */}
        <div className="flex items-center bg-white border border-slate-200/80 rounded-2xl p-1.5 mt-4 shadow-sm focus-within:ring-2 focus-within:ring-navy/20 focus-within:border-navy/60 transition-all duration-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={t("hero_placeholder")}
            className="flex-1 bg-transparent border-none rounded-xl pl-3 pr-2 py-2 text-xs font-semibold focus:outline-none text-slate-800 placeholder-slate-400"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="btn-premium flex items-center justify-center !p-3 shrink-0 rounded-xl disabled:opacity-50"
          >
            <IconSend className="w-4 h-4 text-white" />
          </button>
        </div>
      </section>
    </main>
  );
}

export default function AskAIPage() {
  return (
    <Suspense fallback={null}>
      <ChatBody />
    </Suspense>
  );
}
