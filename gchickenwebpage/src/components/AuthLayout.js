import React from "react";

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  accentTitle,
  accentCopy,
  footer,
  children
}) {
  return (
    <div className="page-container flex min-h-[calc(100vh-11rem)] items-center py-10 sm:py-14">
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="surface-panel relative hidden overflow-hidden p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,180,91,0.16),transparent_30%)]" />

          <div className="relative space-y-5">
            <span className="section-eyebrow">{eyebrow}</span>
            <h2 className="font-display text-4xl leading-tight text-white">
              Fresh food ordering should feel calm, clear, and trustworthy.
            </h2>
            <p className="max-w-md text-base leading-7 text-brand-cream/75">
              Sign in, create your account, or recover access with the same
              premium experience customers expect from GChickenn.
            </p>
          </div>

          <div className="relative rounded-3xl border border-brand-line bg-brand-gold/10 p-6">
            <p className="font-display text-2xl text-white">{accentTitle}</p>
            <p className="mt-3 text-sm leading-7 text-brand-cream/75">
              {accentCopy}
            </p>
          </div>
        </aside>

        <section className="surface-panel p-6 sm:p-8">
          <span className="section-eyebrow">{eyebrow}</span>
          <h1 className="mt-5 font-display text-3xl text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-brand-cream/75 sm:text-base">
            {subtitle}
          </p>

          <div className="mt-8">{children}</div>

          {footer ? <div className="mt-6 text-sm text-brand-cream/75">{footer}</div> : null}
        </section>
      </div>
    </div>
  );
}
