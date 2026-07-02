"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  // Autoplay + muted + looped embed. YouTube requires mute=1 for autoplay,
  // and loop=1 needs playlist=<videoId> to actually repeat a single video.
  const embedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0&controls=1`,
    [videoId],
  );

  const posterUrl = useMemo(
    () => `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    [videoId],
  );

  // Auto-play when the player scrolls into view (one-shot).
  useEffect(() => {
    if (playing) return;
    const node = containerRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPlaying(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.55 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [playing]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-black shadow-xl shadow-black/30"
        style={{ paddingBottom: "56.25%" }}
      >
        {playing ? (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`Play ${title}`}
          >
            {/* Poster thumbnail with graceful fallback to hqdefault if maxres is missing */}
            <img
              src={posterUrl}
              alt={title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.src.includes("hqdefault.jpg")) {
                  img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                }
              }}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
            <span
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg ring-1 ring-white/30 transition-transform duration-200 group-hover:scale-105"
              style={{ backgroundColor: "hsl(var(--nav-theme))" }}
            >
              <Play className="h-6 w-6 fill-current" />
              Play Video
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
