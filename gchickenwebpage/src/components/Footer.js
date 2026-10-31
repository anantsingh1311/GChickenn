import React from "react";

export default function Footer() {
  return (
    <footer className="page-container mt-8 pb-10 pt-2">
      <div className="surface-panel flex flex-col items-center gap-3 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-sand">
            Ecommerce portfolio demo
          </p>
          <p className="mt-2 text-sm leading-7 text-brand-cream/70">
            A responsive storefront concept ready to customize for a new brand.
          </p>
        </div>

        <span className="rounded-full border border-brand-line bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-cream/70">
          Ready for your catalog
        </span>
      </div>
    </footer>
  );
}
