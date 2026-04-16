"use client";

import { useRef, useEffect, useState } from "react";

type Item = { video: string; poster: string; h: number };

const V = "/videos/hero/compressed";
const P = "/images/posters/hero";

const CACHE_V = "v2";

const mk = (n: string, h: number): Item => ({
  video: `${V}/video-${n}.mp4?${CACHE_V}`,
  poster: `${P}/video-${n}-hq.webp`,
  h,
});

const col1: Item[] = [mk("1s",320), mk("4s",320), mk("7s",320), mk("10s",320)];
const col2: Item[] = [mk("2s",320), mk("5s",320), mk("8s",320), mk("11s",320)];
const col3: Item[] = [mk("3s",320), mk("6s",320), mk("9s",320), mk("12s",320)];
const mobileRow1: Item[] = [mk("2s",200), mk("5s",200), mk("8s",200), mk("11s",200), mk("4s",200), mk("1s",200)];
const mobileRow2: Item[] = [mk("3s",200), mk("6s",200), mk("9s",200), mk("12s",200), mk("7s",200), mk("10s",200)];

function VideoSlot({ item, paused }: { item: Item; paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (paused) {
      el.pause();
    } else {
      el.play().catch(() => {});
    }
  }, [paused]);

  return (
    <video
      ref={ref}
      src={item.video}
      poster={item.poster}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="w-full h-full object-cover"
    />
  );
}

function PosterSlot({ item }: { item: Item }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.poster} alt="" className="w-full h-full object-cover" />
  );
}

function useIsVisible() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function ScrollCol({ items, cls }: { items: Item[]; cls: string }) {
  const doubled = [...items, ...items];
  const { ref, visible } = useIsVisible();

  return (
    <div ref={ref} className="flex-1 overflow-hidden relative">
      <div className={cls} style={!visible ? { animationPlayState: "paused" } : undefined}>
        {doubled.map((item, i) => (
          <div key={i} className="relative w-full mb-3 rounded-2xl overflow-hidden" style={{ height: item.h }}>
            {i < items.length ? <VideoSlot item={item} paused={!visible} /> : <PosterSlot item={item} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroVideosMobile() {
  return (
    <div className="lg:hidden absolute inset-0 flex flex-col justify-around gap-0 overflow-hidden">
      <div className="overflow-hidden relative">
        <div className="scroll-left flex gap-3" style={{ width: "max-content", animationDuration: "35s" }}>
          {[...mobileRow1, ...mobileRow1].map((item, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden flex-shrink-0" style={{ width: 160, height: 220 }}>
              <VideoSlot item={item} paused={false} />
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden relative">
        <div className="scroll-right flex gap-3" style={{ width: "max-content", animationDuration: "35s" }}>
          {[...mobileRow2, ...mobileRow2].map((item, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden flex-shrink-0" style={{ width: 160, height: 220 }}>
              <VideoSlot item={item} paused={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroVideosDesktop() {
  return (
    <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-[52%] gap-3 p-3">
      <div className="absolute inset-x-0 top-0 h-40 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #080808, transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-40 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #080808, transparent)" }} />
      <div className="absolute inset-y-0 left-0 w-40 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #080808, transparent)" }} />
      <ScrollCol items={col1} cls="scroll-down" />
      <ScrollCol items={col2} cls="scroll-up" />
      <ScrollCol items={col3} cls="scroll-down" />
    </div>
  );
}
