"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconChat, IconBolt, IconMic, IconStop, IconSpeaker, IconMute } from "@/components/Icons";

const SUGGESTIONS = [
  "Show me your best ceiling fans",
  "Kaunsa fan energy save karta hai?",
  "Open the export inquiry form",
  "How do I register my warranty?",
];

// voice (STT + TTS) locale + the human name we send to the AI for replies
const LANGS = [
  { code: "en-US", label: "English", name: "English" },
  { code: "ur-PK", label: "اردو", name: "Urdu" },
  { code: "hi-IN", label: "हिन्दी", name: "Hindi" },
  { code: "ar-SA", label: "العربية", name: "Arabic" },
  { code: "pa-IN", label: "ਪੰਜਾਬੀ", name: "Punjabi" },
];

const GREETING = {
  role: "assistant",
  content:
    "Assalam o Alaikum! I'm the Sitara Assistant. Ask me about our fans, prices, warranty or delivery — by typing or voice, in any language. I can also open pages & products for you.",
  actions: [],
};

export default function AssistantPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [langCode, setLangCode] = useState("en-US");
  const [listening, setListening] = useState(false);
  const [speakOn, setSpeakOn] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const voicesRef = useRef([]);
  const langRef = useRef("en-US");
  langRef.current = langCode;

  const lang = LANGS.find((l) => l.code === langCode) || LANGS[0];

  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMicSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    // TTS always works: native voice when available, server proxy otherwise
    setTtsSupported(true);
    const synth = window.speechSynthesis;
    if (!synth) return;

    // Chrome loads voices asynchronously — grab them now AND on the event
    const loadVoices = () => {
      const v = synth.getVoices();
      if (v && v.length) voicesRef.current = v;
    };
    loadVoices();
    synth.addEventListener?.("voiceschanged", loadVoices);
    return () => {
      synth.removeEventListener?.("voiceschanged", loadVoices);
      try { synth.cancel(); } catch {}
      try { recognitionRef.current?.abort?.(); } catch {}
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const stopSpeaking = useCallback(() => {
    try { window.speechSynthesis?.cancel(); } catch {}
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch {}
      audioRef.current = null;
    }
    setSpeaking(false);
  }, []);

  // does the OS/browser actually have a voice for this locale's language?
  const hasNativeVoice = useCallback((locale) => {
    const base = locale.split("-")[0].toLowerCase();
    return voicesRef.current.some((v) => v.lang?.toLowerCase().startsWith(base));
  }, []);

  // browser Web Speech API — fast, but only for languages with an installed voice
  const speakBrowser = useCallback((text, locale) => {
    const synth = typeof window !== "undefined" && window.speechSynthesis;
    if (!synth) return false;
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const base = locale.split("-")[0].toLowerCase();
      const voice =
        voicesRef.current.find((v) => v.lang?.replace("_", "-") === locale) ||
        voicesRef.current.find((v) => v.lang?.toLowerCase().startsWith(base));
      u.lang = voice?.lang || locale;
      if (voice) u.voice = voice;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      synth.speak(u);
      return true;
    } catch {
      return false;
    }
  }, []);

  // server TTS proxy — real audio for languages the browser can't speak locally
  const speakServer = useCallback((text, locale) => {
    try {
      const base = locale.split("-")[0].toLowerCase();
      const audio = new Audio(`/api/tts?lang=${encodeURIComponent(base)}&text=${encodeURIComponent(text)}`);
      audioRef.current = audio;
      audio.onplay = () => setSpeaking(true);
      audio.onended = () => { setSpeaking(false); audioRef.current = null; };
      audio.onerror = () => { audioRef.current = null; speakBrowser(text, locale); };
      audio.play().catch(() => { audioRef.current = null; speakBrowser(text, locale); });
    } catch {
      speakBrowser(text, locale);
    }
  }, [speakBrowser]);

  const speak = useCallback(
    (text) => {
      if (!speakOn || !text) return;
      stopSpeaking();
      const locale = langRef.current;
      // Use the fast native voice when one exists (usually English, sometimes
      // Arabic); otherwise fetch real audio from our server so Urdu/Hindi/
      // Punjabi/Arabic are actually spoken instead of falling silent.
      if (hasNativeVoice(locale)) speakBrowser(text, locale);
      else speakServer(text, locale);
    },
    [speakOn, stopSpeaking, hasNativeVoice, speakBrowser, speakServer]
  );

  const send = useCallback(
    async (text) => {
      const content = (text ?? input).trim();
      if (!content || busy) return;
      stopSpeaking();
      setInput("");
      const next = [...messages, { role: "user", content }];
      setMessages(next);
      setBusy(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.map(({ role, content }) => ({ role, content })),
            language: LANGS.find((l) => l.code === langRef.current)?.name || "English",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "failed");
        setMessages((m) => [...m, { role: "assistant", content: data.reply, actions: data.actions || [] }]);
        speak(data.reply);
      } catch (err) {
        const msg =
          err instanceof Error && err.message && err.message !== "failed"
            ? err.message
            : "Sorry — I couldn't reach the assistant just now. Please try again.";
        setMessages((m) => [...m, { role: "assistant", content: msg, actions: [] }]);
      } finally {
        setBusy(false);
      }
    },
    [input, busy, messages, speak, stopSpeaking]
  );

  const notify = (content) => setMessages((m) => [...m, { role: "assistant", content, actions: [] }]);

  const toggleMic = async () => {
    if (listening) {
      try { recognitionRef.current?.stop(); } catch {}
      setListening(false);
      return;
    }
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      notify("Voice input isn't supported in this browser. Please use Google Chrome or Microsoft Edge on desktop.");
      return;
    }
    // explicitly request mic permission first — this reliably shows Chrome's prompt
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch (err) {
      notify("Microphone is blocked. Click the lock icon in Chrome's address bar → Site settings → Microphone → Allow, then reload and tap the mic again.");
      return;
    }
    let rec;
    try {
      rec = new SR();
    } catch {
      notify("Couldn't start voice input. Please reload and try again.");
      return;
    }
    rec.lang = langRef.current;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t;
        else interim += t;
      }
      setInput(finalText || interim);
    };
    rec.onend = () => {
      setListening(false);
      const t = finalText.trim();
      if (t) send(t);
    };
    rec.onerror = (ev) => {
      setListening(false);
      const err = ev?.error;
      if (err === "not-allowed" || err === "service-not-allowed") {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "I need microphone permission. Click the padlock/mic icon in Chrome's address bar → allow the mic for this site, then tap the mic again.", actions: [] },
        ]);
      } else if (err === "no-speech") {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "I didn't catch that — please tap the mic and speak again.", actions: [] },
        ]);
      }
    };
    recognitionRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  const onSubmit = (e) => { e.preventDefault(); send(); };

  return (
    <div className="container" style={{ paddingBottom: 32 }}>
      <div className="page-head" style={{ paddingBottom: 0, marginBottom: 16 }}>
        <span className="eyebrow"><IconBolt size={15} /> AI Assistant</span>
        <h1 className="section-title" style={{ fontSize: "1.9rem", margin: "4px 0 6px" }}>
          Ask <span className="blue">Sitara</span> <span className="red">Assistant</span>
        </h1>
        <p className="section-sub" style={{ margin: 0 }}>
          Type or speak in any language — ask anything, or let it open pages &amp; products for you.
        </p>
      </div>

      <div className="chat-shell">
        {/* professional header */}
        <div className="chat-head">
          <span className="chat-head-avatar">
            <IconChat size={20} />
            <span className="chat-online" />
          </span>
          <div className="chat-head-info">
            <strong>Sitara Assistant</strong>
            <span>Online · AI powered</span>
          </div>
          <div className="chat-head-tools">
            <select
              className="chat-lang-select"
              value={langCode}
              onChange={(e) => setLangCode(e.target.value)}
              aria-label="Language"
              title="Reply & voice language"
            >
              {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            {ttsSupported && (
              <button
                type="button"
                className={"chat-tool-btn" + (speakOn ? " on" : "") + (speaking ? " speaking" : "")}
                onClick={() =>
                  setSpeakOn((s) => {
                    if (s) stopSpeaking();
                    return !s;
                  })
                }
                aria-pressed={speakOn}
                title={speakOn ? "Voice replies: ON — tap to mute" : "Voice replies: OFF — tap to hear answers"}
              >
                {speakOn ? <IconSpeaker size={17} /> : <IconMute size={17} />}
              </button>
            )}
          </div>
        </div>

        <div className="chat-stream" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={"chat-msg " + (m.role === "user" ? "from-user" : "from-bot")}>
              {m.role === "assistant" && <span className="chat-avatar"><IconChat size={15} /></span>}
              <div className="chat-bubble">
                <p>{m.content}</p>
                {m.actions && m.actions.length > 0 && (
                  <div className="chat-actions">
                    {m.actions.map((a, j) => (
                      <button key={j} className="btn btn-sm btn-blue" onClick={() => router.push(a.href)}>
                        {a.label} <IconArrowRight size={14} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {busy && (
            <div className="chat-msg from-bot">
              <span className="chat-avatar"><IconChat size={15} /></span>
              <div className="chat-bubble"><span className="chat-typing"><i /><i /><i /></span></div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="chat-suggests">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chat-chip" onClick={() => send(s)} disabled={busy}>{s}</button>
            ))}
          </div>
        )}

        <form className="chat-input" onSubmit={onSubmit}>
          <div className={"chat-field" + (listening ? " listening" : "")}>
            {micSupported && (
              <button
                type="button"
                className={"chat-mic" + (listening ? " listening" : "")}
                onClick={toggleMic}
                aria-label={listening ? "Stop listening" : "Speak your message"}
                title={listening ? "Listening… tap to stop" : `Tap to speak in ${lang.name}`}
              >
                {listening ? <IconStop size={14} /> : <IconMic size={16} />}
              </button>
            )}
            <input
              className="chat-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? `Listening in ${lang.name}…` : "Type your message…"}
              aria-label="Message"
              autoFocus
            />
          </div>
          <button
            className="chat-send"
            disabled={busy || !input.trim()}
            aria-label="Send message"
            title="Send"
          >
            {busy ? <span className="chat-send-spin" /> : <IconArrowRight size={18} />}
          </button>
        </form>

        <div className="chat-inputhint">
          <span>
            Replying in <strong>{lang.name}</strong>
          </span>
          <span className="dot">·</span>
          <span>
            {speaking
              ? "Speaking…"
              : speakOn
              ? "Voice replies on"
              : ttsSupported
              ? "Voice replies off"
              : "Voice replies not supported"}
          </span>
        </div>
      </div>
    </div>
  );
}
