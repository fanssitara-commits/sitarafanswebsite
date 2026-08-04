import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Server-side text-to-speech proxy.
 *
 * The browser's Web Speech API can only speak languages the user's OS has a
 * voice installed for — on most Windows/Chrome setups that's English only, so
 * Urdu/Hindi/Arabic/Punjabi replies came out silent. This route fetches real
 * audio from Google Translate's TTS endpoint (free, no key, wide language
 * support) and streams it back as one MP3, so every language can be spoken.
 */

// our locale codes -> Google TTS language codes
const LANG_MAP = {
  en: "en",
  ur: "ur",
  hi: "hi",
  ar: "ar",
  pa: "pa",
};

// Google TTS accepts ~200 chars per request — split on sentence/word boundaries
function chunkText(text, limit = 180) {
  const chunks = [];
  let rest = text.trim();
  while (rest.length > limit) {
    let cut = rest.lastIndexOf(" ", limit);
    // prefer a sentence break if one is close to the limit
    const punct = Math.max(
      rest.lastIndexOf("۔", limit),
      rest.lastIndexOf(".", limit),
      rest.lastIndexOf("،", limit),
      rest.lastIndexOf(",", limit),
      rest.lastIndexOf("!", limit),
      rest.lastIndexOf("؟", limit),
      rest.lastIndexOf("?", limit)
    );
    if (punct > limit * 0.5) cut = punct + 1;
    if (cut <= 0) cut = limit;
    chunks.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) chunks.push(rest);
  return chunks;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const text = (searchParams.get("text") || "").slice(0, 800).trim();
  const langParam = (searchParams.get("lang") || "en").toLowerCase().split("-")[0];
  const tl = LANG_MAP[langParam] || "en";

  if (!text) {
    return NextResponse.json({ error: "Missing text." }, { status: 400 });
  }

  try {
    const chunks = chunkText(text);
    const buffers = [];
    for (const chunk of chunks) {
      const url =
        "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob" +
        `&tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(chunk)}`;
      const res = await fetch(url, {
        headers: {
          // Google 403s requests without a browser-like User-Agent
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          Referer: "https://translate.google.com/",
        },
      });
      if (!res.ok) {
        // if one chunk fails, stop rather than returning partial garbage
        return NextResponse.json({ error: "TTS upstream error." }, { status: 502 });
      }
      buffers.push(Buffer.from(await res.arrayBuffer()));
    }

    const audio = Buffer.concat(buffers);
    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    console.error("GET /api/tts", e);
    return NextResponse.json({ error: "TTS failed." }, { status: 500 });
  }
}
