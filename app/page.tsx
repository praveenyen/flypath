"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

// ─── Animation Variants ──────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const wordStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const wordFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ─── Helpers ─────────────────────────────────────────────

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<HTMLElement>, {
    once: true,
  });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function SectionBadge({ text }: { text: string }) {
  return (
    <span className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-sm font-medium text-[#00D4FF]">
      {text}
    </span>
  );
}

// ─── Data ────────────────────────────────────────────────

const marqueeItems = [
  "500+ Routes Created",
  "4.9★ Rating",
  "50+ Countries",
  "1K+ Users",
  "Open Source",
  "Free to Start",
];

// ─── Page ────────────────────────────────────────────────

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FlyPath",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    url: "https://flypath.app",
    description:
      "Create stunning animated travel route videos in your browser.",
    author: { "@type": "Person", name: "Praveen Yen" },
    offers: [
      { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
      { "@type": "Offer", name: "Pro", price: "9", priceCurrency: "USD" },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ─── Navbar ─── */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-gray-200/80 bg-white/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            <span className="mr-1">✈️</span>
            Fly<span className="text-[#00D4FF]">Path</span>
          </span>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900"
            >
              Pricing
            </a>
          </div>
          <Link
            href="/app"
            className="cta-glow rounded-lg bg-[#00D4FF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#00bfe6]"
          >
            Try it Free →
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative flex flex-col items-center overflow-hidden px-6 pt-32 pb-16 text-center md:pt-44 md:pb-20">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-20 left-1/4 h-[600px] w-[600px] rounded-full bg-cyan-100/60 blur-[150px]" />
          <div className="absolute top-40 -right-20 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-[150px]" />
          <div className="absolute -bottom-20 left-0 h-[400px] w-[400px] rounded-full bg-purple-100/40 blur-[150px]" />
        </div>

        {/* PH Badge */}
        <FadeIn>
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700">
            🚀 Launching on Product Hunt
          </span>
        </FadeIn>

        {/* Heading */}
        <motion.h1
          variants={wordStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl lg:text-7xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          {["Turn", "your", "travel", "route", "into", "a"].map((word, i) => (
            <motion.span
              key={i}
              variants={wordFade}
              className="mr-[0.3em] inline-block"
            >
              {word}
            </motion.span>
          ))}
          <br className="hidden sm:block" />
          {["cinematic", "fly-through"].map((word, i) => (
            <motion.span
              key={`a-${i}`}
              variants={wordFade}
              className="mr-[0.3em] inline-block bg-gradient-to-r from-[#00D4FF] to-[#0088FF] bg-clip-text text-transparent"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <FadeIn delay={0.4} className="mt-6 max-w-2xl">
          <p className="text-base leading-relaxed text-gray-500 md:text-lg">
            Add destinations, customize the map style, and export a stunning
            fly-through video of your journey — all in your browser.
          </p>
        </FadeIn>

        <FadeIn delay={0.6}>
          <Link
            href="/app"
            className="cta-glow mt-8 inline-flex items-center gap-2 rounded-xl bg-[#00D4FF] px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#00bfe6]"
          >
            Try it Free
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            No signup required · Free forever
          </p>
        </FadeIn>

        {/* Browser mockup */}
        <FadeIn delay={0.8} className="relative mt-16 w-full max-w-4xl">
          {/* Glow behind mockup */}
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-cyan-200/30 via-blue-200/20 to-purple-200/30 blur-3xl" />
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <div className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="mx-auto max-w-sm flex-1">
                <div className="rounded-md bg-gray-100 px-3 py-1 text-center text-xs text-gray-400">
                  flypath.app
                </div>
              </div>
              <div className="w-[52px]" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/app-demo.png"
              alt="FlyPath app showing a satellite map with animated cyan route line between destinations"
              className="aspect-video w-full bg-gray-100 object-cover"
            />
          </div>
        </FadeIn>
      </section>

      {/* ─── Trusted By Marquee ─── */}
      <section className="overflow-hidden border-y border-gray-100 py-8">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-gray-400">
          Trusted by creators worldwide
        </p>
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((text, i) => (
            <span
              key={i}
              className="flex-shrink-0 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-600"
            >
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="relative px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <FadeIn className="flex flex-col items-center text-center">
            <SectionBadge text="How it works" />
            <h2
              className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Three steps to cinematic travel videos
            </h2>
            <p className="mt-4 max-w-lg text-gray-500">
              Create professional travel animations in minutes, not hours.
            </p>
          </FadeIn>

          <div className="mt-14 space-y-6">
            {/* Step 1 */}
            <FadeIn>
              <div className="flex flex-col items-center gap-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:p-8">
                <div className="flex-1">
                  <span className="text-5xl font-extrabold text-[#00D4FF]/20">
                    01
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-gray-900">
                    Add Destinations
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Search for any city worldwide and add it to your route. Drag
                    to reorder anytime.
                  </p>
                </div>
                <div className="w-full max-w-[280px] rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    <span className="text-xs text-gray-400">
                      Search cities...
                    </span>
                  </div>
                  {[
                    { num: 1, city: "Paris", country: "France" },
                    { num: 2, city: "Tokyo", country: "Japan" },
                    { num: 3, city: "Dubai", country: "UAE" },
                  ].map((d) => (
                    <div
                      key={d.num}
                      className="mb-2 flex items-center gap-2.5 rounded-lg border border-gray-100 bg-white px-3 py-2 last:mb-0"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="#D1D5DB"
                      >
                        <circle cx="4" cy="3" r="1.5" />
                        <circle cx="10" cy="3" r="1.5" />
                        <circle cx="4" cy="8" r="1.5" />
                        <circle cx="10" cy="8" r="1.5" />
                        <circle cx="4" cy="13" r="1.5" />
                        <circle cx="10" cy="13" r="1.5" />
                      </svg>
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                        {d.num}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">
                          {d.city}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {d.country}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Step 2 */}
            <FadeIn delay={0.1}>
              <div className="flex flex-col items-center gap-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:p-8">
                <div className="flex-1">
                  <span className="text-5xl font-extrabold text-[#00D4FF]/20">
                    02
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-gray-900">
                    Customize Style
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Pick from 5 map styles, adjust animation speed, route color,
                    and more in real time.
                  </p>
                </div>
                <div className="grid w-full max-w-[280px] grid-cols-3 gap-2">
                  {[
                    { name: "Dark", bg: "#1a1a2e", selected: true },
                    { name: "Satellite", bg: "#2d4a3e" },
                    { name: "Light", bg: "#e8e4db" },
                    { name: "Outdoors", bg: "#4a6741" },
                    { name: "Vintage", bg: "#c4b69c" },
                  ].map((s) => (
                    <div
                      key={s.name}
                      className={`overflow-hidden rounded-lg border ${
                        s.selected
                          ? "border-[#00D4FF] ring-1 ring-[#00D4FF]/30"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="h-10" style={{ background: s.bg }} />
                      <div className="bg-gray-50 py-1 text-center text-[9px] text-gray-500">
                        {s.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Step 3 */}
            <FadeIn delay={0.2}>
              <div className="flex flex-col items-center gap-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:p-8">
                <div className="flex-1">
                  <span className="text-5xl font-extrabold text-[#00D4FF]/20">
                    03
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-gray-900">
                    Export & Share
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Export as MP4 or GIF in HD resolution with one click. Share
                    your route with a link.
                  </p>
                </div>
                <div className="w-full max-w-[280px] rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 text-sm font-medium text-gray-900">
                    Export Animation
                  </div>
                  <div className="mb-3 flex gap-2">
                    <div className="flex-1 rounded-lg border border-[#00D4FF]/30 bg-[#00D4FF]/5 py-1.5 text-center text-xs font-medium text-[#00D4FF]">
                      MP4
                    </div>
                    <div className="flex-1 rounded-lg border border-gray-200 bg-white py-1.5 text-center text-xs text-gray-400">
                      GIF
                    </div>
                  </div>
                  <div className="mb-1 text-[10px] text-gray-400">
                    Resolution
                  </div>
                  <div className="mb-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900">
                    1080p HD
                  </div>
                  <div className="rounded-lg bg-[#00D4FF] py-2 text-center text-sm font-semibold text-white">
                    Export Video
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="bg-[#F9FAFB] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <FadeIn className="flex flex-col items-center text-center">
            <SectionBadge text="Features" />
            <h2
              className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Everything you need to create stunning travel animations
            </h2>
          </FadeIn>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {/* Animated Routes (spans 2 cols) */}
            <motion.div
              variants={fadeUp}
              className="feature-card col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2"
            >
              <h3 className="mb-1 text-lg font-bold text-gray-900">
                Animated Route Lines
              </h3>
              <p className="text-sm text-gray-500">
                Smooth great-circle arc animations between every destination.
              </p>
              <svg viewBox="0 0 500 80" className="mt-4 w-full">
                <path
                  d="M20 60 Q125 5 250 40 Q375 75 480 15"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M20 60 Q125 5 250 40 Q375 75 480 15"
                  stroke="#00D4FF"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  className="route-anim-path"
                />
                <circle r="4" fill="#00D4FF">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path="M20 60 Q125 5 250 40 Q375 75 480 15"
                  />
                </circle>
                <circle cx="20" cy="60" r="4" fill="#3B82F6" />
                <circle cx="250" cy="40" r="4" fill="#3B82F6" />
                <circle cx="480" cy="15" r="4" fill="#3B82F6" />
              </svg>
            </motion.div>

            {/* 5 Map Styles */}
            <motion.div
              variants={fadeUp}
              className="feature-card rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-1 text-lg font-bold text-gray-900">
                5 Map Styles
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Dark, Satellite, Light, Outdoors, and Vintage.
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { bg: "#1a1a2e" },
                  { bg: "#2d4a3e" },
                  { bg: "#e8e4db" },
                  { bg: "#4a6741" },
                  { bg: "#c4b69c" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md ring-1 ring-gray-200"
                    style={{ background: s.bg }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Drag to Reorder */}
            <motion.div
              variants={fadeUp}
              className="feature-card rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-1 text-lg font-bold text-gray-900">
                Drag to Reorder
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Rearrange your route with drag and drop.
              </p>
              <div className="space-y-1.5">
                {["London", "Rome", "Athens"].map((city, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="#D1D5DB"
                    >
                      <circle cx="4" cy="4" r="1.5" />
                      <circle cx="10" cy="4" r="1.5" />
                      <circle cx="4" cy="8" r="1.5" />
                      <circle cx="10" cy="8" r="1.5" />
                      <circle cx="4" cy="12" r="1.5" />
                      <circle cx="10" cy="12" r="1.5" />
                    </svg>
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[8px] font-bold text-white">
                      {i + 1}
                    </div>
                    <span className="text-xs text-gray-700">{city}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* One-Click Export */}
            <motion.div
              variants={fadeUp}
              className="feature-card rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-1 text-lg font-bold text-gray-900">
                One-Click Export
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Export as MP4 or GIF in 720p or 1080p.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00D4FF"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div className="export-progress-bar h-full rounded-full bg-[#00D4FF]" />
                  </div>
                  <span className="mt-1 block text-[10px] text-gray-400">
                    travel-animation.mp4
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Save & Share */}
            <motion.div
              variants={fadeUp}
              className="feature-card rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-1 text-lg font-bold text-gray-900">
                Save & Share Routes
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Save routes locally and share via link.
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <span className="flex-1 truncate text-xs text-gray-500">
                  flypath.app/route/abc123
                </span>
                <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-50">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00D4FF"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Custom Colors & Speed */}
            <motion.div
              variants={fadeUp}
              className="feature-card rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-1 text-lg font-bold text-gray-900">
                Custom Colors & Speed
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Fine-tune animation speed, route color, and line width.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-12 text-[10px] text-gray-400">Speed</span>
                  <div className="relative h-1 flex-1 rounded-full bg-gray-100">
                    <div className="absolute left-0 top-0 h-full w-3/5 rounded-full bg-[#00D4FF]" />
                    <div className="absolute left-[60%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-gray-200 bg-white shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-12 text-[10px] text-gray-400">Color</span>
                  <div className="flex gap-1.5">
                    <div className="h-4 w-4 rounded-full bg-[#00D4FF] ring-2 ring-[#00D4FF]/30" />
                    <div className="h-4 w-4 rounded-full bg-[#FF6B6B]" />
                    <div className="h-4 w-4 rounded-full bg-[#4ADE80]" />
                    <div className="h-4 w-4 rounded-full bg-[#FBBF24]" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonial & Stats ─── */}
      <section className="border-y border-gray-100 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <FadeIn className="flex flex-col items-center text-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              className="mb-6"
            >
              <path
                d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
                fill="#E5E7EB"
              />
              <path
                d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
                fill="#E5E7EB"
              />
            </svg>
            <p className="max-w-2xl text-xl italic leading-relaxed text-gray-700 md:text-2xl">
              FlyPath turned my boring itinerary into a viral travel
              reel. Exported in 30 seconds.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#0088FF]" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  Travel Creator
                </div>
                <div className="text-xs text-gray-400">@travelcreator</div>
              </div>
            </div>
          </FadeIn>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {[
              { target: 10, suffix: "x", label: "Faster than After Effects" },
              { target: 500, suffix: "+", label: "Routes Created" },
              { target: 50, suffix: "+", label: "Countries" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="text-4xl font-extrabold text-[#00D4FF]">
                  <CountUp target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="bg-[#F9FAFB] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <FadeIn className="flex flex-col items-center text-center">
            <SectionBadge text="Pricing" />
            <h2
              className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Simple, transparent pricing
            </h2>
            <p className="mt-4 max-w-lg text-gray-500">
              Start for free, upgrade when you need more.
            </p>
          </FadeIn>

          <div className="mx-auto mt-12 grid max-w-3xl items-start gap-6 md:grid-cols-2">
            {/* Free */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900">Free</h3>
              <div className="mt-3 mb-5">
                <span className="text-4xl font-extrabold text-gray-900">
                  $0
                </span>
                <span className="ml-1 text-gray-400">/month</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3 text-sm text-gray-600">
                {[
                  "3 exports per month",
                  "720p resolution",
                  "Watermark included",
                  "Basic styles",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00D4FF"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/app"
                className="rounded-lg border border-gray-200 bg-white py-2.5 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Get Started
              </Link>
            </motion.div>

            {/* Pro */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col rounded-2xl border-2 border-[#00D4FF]/30 bg-white p-7 shadow-lg shadow-cyan-100/50"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">Pro</h3>
                <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-[#00D4FF]">
                  Popular
                </span>
              </div>
              <div className="mt-3 mb-1">
                <span className="text-4xl font-extrabold text-gray-900">
                  $9
                </span>
                <span className="ml-1 text-gray-400">/month</span>
              </div>
              <p className="mb-5 text-xs font-medium text-[#00D4FF]">
                Launch Special 🚀 — 50% off for first 100 users
              </p>
              <ul className="mb-8 flex-1 space-y-3 text-sm text-gray-600">
                {[
                  "Unlimited exports",
                  "1080p HD resolution",
                  "No watermark",
                  "All styles",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00D4FF"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/app"
                className="cta-glow rounded-lg bg-[#00D4FF] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#00bfe6]"
              >
                Upgrade to Pro
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/40 blur-[150px]" />
        </div>
        <FadeIn className="flex flex-col items-center text-center">
          <h2
            className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Ready to animate your next adventure?
          </h2>
          <p className="mt-4 max-w-md text-gray-500">
            Join 500+ creators making stunning travel content.
          </p>
          <Link
            href="/app"
            className="cta-glow mt-8 inline-flex items-center gap-2 rounded-xl bg-[#00D4FF] px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#00bfe6]"
          >
            Try it Free
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            No credit card required
          </p>
        </FadeIn>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-200 bg-[#F9FAFB] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-sm text-gray-400">
            <span className="mr-1">✈️</span> FlyPath &copy; 2026
          </span>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a
              href="#"
              className="transition-colors hover:text-gray-900"
            >
              Privacy
            </a>
            <a
              href="#"
              className="transition-colors hover:text-gray-900"
            >
              Terms
            </a>
            <a
              href="https://github.com/praveenyen/travel-animator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-gray-900"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
          <a
            href="https://x.com/praveenyen"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-900"
          >
            Built in public by
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @praveenyen
          </a>
        </div>
      </footer>
    </div>
  );
}
