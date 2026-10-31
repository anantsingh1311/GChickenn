import React from "react";
import { Link } from "react-router-dom";

const shoppingBenefits = [
  "Clear product details and transparent pricing",
  "Simple ordering from any screen size",
  "Reliable support from selection to delivery"
];

const experienceItems = [
  {
    title: "Products made easy to explore",
    copy:
      "Browse the current catalog and compare the information you need without unnecessary distractions."
  },
  {
    title: "A shorter path to checkout",
    copy:
      "Choose quantities, review your total, and enter delivery details in one straightforward flow."
  },
  {
    title: "Pricing you can understand",
    copy:
      "Retail and wholesale pricing are presented clearly so you can select the option that suits your order."
  },
  {
    title: "Built for repeat customers",
    copy:
      "Account access and order tools make returning to the store quick, familiar, and dependable."
  }
];

export default function Home() {
  return (
    <div className="page-container space-y-6 pt-4 sm:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-brand-line bg-brand-deep shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,180,91,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />
        <div className="relative grid gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:py-20">
          <div className="max-w-3xl animate-fade-up">
            <span className="section-eyebrow">Shopping made simple</span>
            <h1 className="mt-6 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Everything you need from one clear, convenient ecommerce store.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-brand-cream/80 sm:text-lg">
              Discover available products, compare prices, and place an order
              through a focused experience designed for everyday shopping.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/products" className="primary-button">
                View products
              </Link>
              <Link to="/order" className="secondary-button">
                Start an order
              </Link>
            </div>
          </div>

          <div
            className="surface-panel flex animate-fade-up flex-col gap-4 p-6"
            style={{ animationDelay: "120ms" }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-sand">
              Why customers choose us
            </p>

            <div className="space-y-3">
              {shoppingBenefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-2xl border border-brand-line bg-white/5 px-4 py-4 text-sm leading-7 text-brand-cream/80"
                >
                  {benefit}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold/10 px-4 py-4 text-sm leading-7 text-brand-cream/85">
              Our goal is simple: make online ordering feel clear, dependable,
              and easy from the first click to final confirmation.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="section-shell flex min-h-[320px] items-center justify-center overflow-hidden">
          <div className="relative flex h-full min-h-[260px] w-full items-center justify-center overflow-hidden rounded-[1.5rem] border border-brand-line bg-brand-deep/50">
            <div className="absolute h-56 w-56 rounded-full border border-brand-gold/25" />
            <div className="absolute h-40 w-40 rotate-45 rounded-[2.5rem] border border-brand-line bg-white/5" />
            <span className="relative font-display text-7xl text-brand-gold">ES</span>
          </div>
        </div>

        <div className="section-shell">
          <span className="section-eyebrow">About the store</span>
          <h2 className="section-title mt-5">A practical storefront built around the customer.</h2>
          <div className="mt-5 space-y-4 text-sm leading-8 text-brand-cream/80 sm:text-base">
            <p>
              Ecommerce store brings product discovery, account access, and
              ordering together in one consistent experience.
            </p>
            <p>
              The catalog is connected directly to current inventory data, so
              customers can review descriptions and prices before building an order.
            </p>
            <p>
              A responsive layout keeps the same essential tools available on
              desktop, tablet, and mobile devices.
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-brand-gold/25 bg-brand-gold/10 p-5 text-sm leading-7 text-brand-cream/85">
            Shop confidently with transparent pricing, an easy order summary,
            and support when you need it.
          </div>
        </div>
      </section>

      <section className="section-shell">
        <span className="section-eyebrow">What sets us apart</span>
        <h2 className="section-title mt-5">Designed to keep every step simple.</h2>
        <p className="section-copy mt-4">
          Every part of the store is structured to help customers find products,
          understand pricing, and complete orders with confidence.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {experienceItems.map((item, index) => (
            <article
              key={item.title}
              className="rounded-3xl border border-brand-line bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:bg-white/10"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-sand">
                0{index + 1}
              </p>
              <h3 className="mt-3 font-display text-2xl text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-brand-cream/80">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
