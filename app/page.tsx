import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            <span className="mr-1">🌍</span>
            Travel<span className="text-[#00D4FF]">Animator</span>
          </span>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="hidden text-sm text-gray-500 transition-colors hover:text-gray-900 md:block"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hidden text-sm text-gray-500 transition-colors hover:text-gray-900 md:block"
            >
              Pricing
            </a>
            <Link
              href="/app"
              className="cta-glow rounded-lg bg-[#00D4FF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#00bfe6]"
            >
              Try it Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center overflow-hidden px-6 pt-28 pb-10 text-center md:pt-36 md:pb-12">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-10 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-100/60 blur-[120px]" />
          <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-blue-100/50 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-purple-100/40 blur-[120px]" />
        </div>

        {/* PH badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700">
          🚀 Just launched on Product Hunt
        </div>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl" style={{ letterSpacing: "-0.02em" }}>
          Turn your travel route into a{" "}
          <span className="text-[#00D4FF]">cinematic animation</span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-gray-500 md:text-lg">
          Add destinations, customize the map style, and export a stunning
          fly-through video of your journey — all in your browser.
        </p>
        <Link
          href="/app"
          className="cta-glow mt-8 inline-flex items-center gap-2 rounded-xl bg-[#00D4FF] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#00bfe6]"
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

        {/* Browser mockup with demo screenshot */}
        <div className="relative mt-8 w-full max-w-4xl">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-200/30 via-blue-200/20 to-purple-200/30 blur-3xl" />
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
            {/* Browser title bar */}
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <div className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="mx-auto max-w-sm flex-1">
                <div className="rounded-md bg-gray-100 px-3 py-1 text-center text-xs text-gray-400">
                  travelanimator.app
                </div>
              </div>
              <div className="w-[52px]" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/app-demo.png"
              alt="TravelAnimator showing a satellite map with animated cyan route line"
              className="aspect-video w-full bg-gray-100 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#F9FAFB] px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Everything you need
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-gray-500">
            Create professional travel animations without any video editing
            skills.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Animated Routes */}
            <div className="feature-card rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00D4FF"
                  strokeWidth="2"
                >
                  <path d="M3 17l6-6 4 4 8-8" />
                  <path d="M17 7h4v4" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Animated Routes
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Watch your journey come alive with smooth great-circle arc
                animations between destinations.
              </p>
              <svg viewBox="0 0 200 48" className="mt-4 w-full">
                <path
                  d="M10 40 Q50 5 100 25 Q150 45 190 10"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M10 40 Q50 5 100 25 Q150 45 190 10"
                  stroke="#00D4FF"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  className="route-anim-path"
                />
                <circle r="3" fill="#00D4FF" opacity="0.9">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path="M10 40 Q50 5 100 25 Q150 45 190 10"
                  />
                </circle>
              </svg>
            </div>

            {/* Multiple Styles */}
            <div className="feature-card rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50">
                <svg
                  width="24"
                  height="24"
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
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Multiple Styles
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Choose from Dark, Satellite, Light, Outdoors, and Vintage map
                styles with live previews.
              </p>
              <div className="mt-4 flex gap-1.5">
                <div className="flex h-9 flex-1 items-end justify-center overflow-hidden rounded-md bg-[#1a1a2e] ring-1 ring-gray-200">
                  <span className="mb-1 text-[8px] font-medium text-gray-400">
                    Dark
                  </span>
                </div>
                <div className="flex h-9 flex-1 items-end justify-center overflow-hidden rounded-md bg-[#3a6b52] ring-1 ring-gray-200">
                  <span className="mb-1 text-[8px] font-medium text-white/70">
                    Satellite
                  </span>
                </div>
                <div className="flex h-9 flex-1 items-end justify-center overflow-hidden rounded-md bg-[#e8e4db] ring-1 ring-gray-200">
                  <span className="mb-1 text-[8px] font-medium text-gray-500">
                    Light
                  </span>
                </div>
              </div>
            </div>

            {/* One-Click Export */}
            <div className="feature-card rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50">
                <svg
                  width="24"
                  height="24"
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
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                One-Click Export
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Export your animation as MP4 or GIF in 720p or 1080p resolution
                with a single click.
              </p>
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="export-progress-bar h-full rounded-full bg-[#00D4FF]" />
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  travel-animation.mp4
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-gray-100 bg-white px-6 py-8 md:py-10">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-8 text-sm text-gray-500 md:gap-12">
          <a
            href="https://x.com/praveenyen"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-gray-900"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Built by @praveenyen
          </a>
          <div className="hidden h-4 w-px bg-gray-200 md:block" />
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#00D4FF]"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.2l-1.3.8-4.2-7.3-4.2 7.3-1.3-.8L12 6.8l5.5 10.4z" />
            </svg>
            Powered by Mapbox
          </div>
          <div className="hidden h-4 w-px bg-gray-200 md:block" />
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[#00D4FF]"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Trusted by{" "}
            <span className="font-semibold text-gray-900">500+</span> creators
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-gray-500">
            Three simple steps to create your travel animation.
          </p>

          <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
            {/* Connector line (desktop only) */}
            <div className="absolute top-6 left-[17%] right-[17%] hidden border-t-2 border-dashed border-gray-200 md:block" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#00D4FF] bg-white text-lg font-bold text-[#00D4FF] shadow-sm">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Add Destinations
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Search for cities and add them to your route. Drag to reorder
                anytime.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#00D4FF] bg-white text-lg font-bold text-[#00D4FF] shadow-sm">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Customize Style
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Pick a map style, adjust animation speed, route color, and more
                in real time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#00D4FF] bg-white text-lg font-bold text-[#00D4FF] shadow-sm">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Export Video
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Hit export and download your cinematic fly-through as MP4 or
                GIF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#F9FAFB] px-6 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Simple pricing
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-gray-500">
            Start for free, upgrade when you need more.
          </p>

          <div className="mx-auto grid max-w-3xl items-start gap-6 md:grid-cols-2">
            {/* Free */}
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <div className="mt-3 mb-5">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="ml-1 text-gray-400">/month</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3 text-sm text-gray-600">
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
                className="rounded-lg border border-gray-200 bg-white py-2.5 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="relative flex flex-col rounded-2xl border-2 border-[#00D4FF]/30 bg-white p-7 shadow-lg shadow-cyan-100/50">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
                <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-[#00D4FF]">
                  Launch Special 🚀
                </span>
              </div>
              <div className="mt-3 mb-1">
                <span className="text-4xl font-bold text-gray-900">$9</span>
                <span className="ml-1 text-gray-400">/month</span>
              </div>
              <p className="mb-5 text-xs font-medium text-[#00D4FF]">
                First 100 users get 50% off — $4.50/mo
              </p>
              <ul className="mb-8 flex-1 space-y-3 text-sm text-gray-600">
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
                className="cta-glow rounded-lg bg-[#00D4FF] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#00bfe6]"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-[#F9FAFB] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} TravelAnimator
            </span>
            <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-gray-500">
              Built in public 🔨
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
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
              href="https://x.com/praveenyen"
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
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @praveenyen
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
              Star on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
