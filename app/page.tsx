import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">
            Travel<span className="text-[#00D4FF]">Animator</span>
          </span>
          <Link
            href="/app"
            className="rounded-lg bg-[#00D4FF] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#00bfe6]"
          >
            Try it Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center px-6 pt-32 pb-20 text-center md:pt-40 md:pb-28">
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          Turn your travel route into a{" "}
          <span className="text-[#00D4FF]">cinematic animation</span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-zinc-400 md:text-lg">
          Add destinations, customize the map style, and export a stunning
          fly-through video of your journey — all in your browser.
        </p>
        <Link
          href="/app"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#00D4FF] px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-[#00bfe6]"
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

        {/* Demo placeholder */}
        <div className="relative mt-14 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="flex aspect-video items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-zinc-500">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span className="text-sm">Demo Video</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need
          </h2>
          <p className="mx-auto mb-14 max-w-lg text-center text-zinc-400">
            Create professional travel animations without any video editing
            skills.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Animated Routes */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#00D4FF]/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00D4FF"
                  strokeWidth="2"
                >
                  <path d="M3 17l6-6 4 4 8-8" />
                  <path d="M17 7h4v4" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Animated Routes</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Watch your journey come alive with smooth great-circle arc
                animations between destinations.
              </p>
            </div>

            {/* Multiple Styles */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#00D4FF]/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00D4FF"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Multiple Styles</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Choose from Dark, Satellite, Light, Outdoors, and Vintage map
                styles with live previews.
              </p>
            </div>

            {/* One-Click Export */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#00D4FF]/10">
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
              <h3 className="mb-2 text-lg font-semibold">One-Click Export</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Export your animation as MP4 or GIF in 720p or 1080p resolution
                with a single click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight md:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mb-14 max-w-lg text-center text-zinc-400">
            Three simple steps to create your travel animation.
          </p>

          <div className="grid gap-10 md:grid-cols-3 md:gap-6">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/10 text-lg font-bold text-[#00D4FF]">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold">Add Destinations</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Search for cities and add them to your route. Drag to reorder
                anytime.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/10 text-lg font-bold text-[#00D4FF]">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold">Customize Style</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Pick a map style, adjust animation speed, route color, and more
                in real time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/10 text-lg font-bold text-[#00D4FF]">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold">Export Video</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Hit export and download your cinematic fly-through as MP4 or
                GIF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Simple pricing
          </h2>
          <p className="mx-auto mb-14 max-w-lg text-center text-zinc-400">
            Start for free, upgrade when you need more.
          </p>

          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {/* Free */}
            <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Free</h3>
              <div className="mt-3 mb-5">
                <span className="text-4xl font-bold">$0</span>
                <span className="ml-1 text-zinc-500">/month</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
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
                  3 exports per month
                </li>
                <li className="flex items-center gap-2">
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
                  720p resolution
                </li>
                <li className="flex items-center gap-2">
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
                  Watermark included
                </li>
              </ul>
              <Link
                href="/app"
                className="rounded-lg border border-white/10 bg-white/5 py-2.5 text-center text-sm font-medium transition-colors hover:bg-white/10"
              >
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="flex flex-col rounded-2xl border border-[#00D4FF]/30 bg-gradient-to-b from-[#00D4FF]/10 to-transparent p-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Pro</h3>
                <span className="rounded-full bg-[#00D4FF]/15 px-2.5 py-0.5 text-xs font-medium text-[#00D4FF]">
                  Popular
                </span>
              </div>
              <div className="mt-3 mb-5">
                <span className="text-4xl font-bold">$9</span>
                <span className="ml-1 text-zinc-500">/month</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
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
                  Unlimited exports
                </li>
                <li className="flex items-center gap-2">
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
                  1080p HD resolution
                </li>
                <li className="flex items-center gap-2">
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
                  No watermark
                </li>
                <li className="flex items-center gap-2">
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
                  Priority support
                </li>
              </ul>
              <Link
                href="/app"
                className="rounded-lg bg-[#00D4FF] py-2.5 text-center text-sm font-medium text-black transition-colors hover:bg-[#00bfe6]"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} TravelAnimator. All rights
            reserved.
          </span>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="transition-colors hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
