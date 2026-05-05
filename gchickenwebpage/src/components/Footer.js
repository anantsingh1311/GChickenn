import React from "react";

import tararcoLogo from "../tararco-logo.webp";

export default function Footer() {
  return (
    <footer className="page-container mt-8 pb-10 pt-2">
      <div className="surface-panel flex flex-col items-center gap-4 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-sand">
            Design partner
          </p>
          <p className="mt-2 text-sm leading-7 text-brand-cream/70">
            Built with support from Tarar and Co Solutions.
          </p>
        </div>

        <a
          href="https://tararcoandsolutions.com/"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center justify-center rounded-3xl border border-brand-line bg-white/5 px-4 py-3 transition duration-300 hover:border-brand-gold/50 hover:bg-white/10"
          aria-label="Visit Tarar and Co Solutions"
        >
          <img
            src={tararcoLogo}
            alt="Tarar and Co Solutions logo"
            className="h-16 w-auto rounded-2xl object-contain shadow-lg shadow-brand-deep/25 transition duration-300 group-hover:scale-[1.02]"
          />
        </a>
      </div>
    </footer>
  );
}
