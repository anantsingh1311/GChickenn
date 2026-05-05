import React from "react";
import { Link } from "react-router-dom";

const qualityPoints = [
  "Farm-raised birds under our own supervision",
  "Clean handling and careful preparation",
  "Fresh delivery designed for repeat confidence"
];

const uspItems = [
  {
    title: "We do not source. We raise.",
    copy:
      "Our chicken comes directly from our own farm instead of traders or wholesale markets."
  },
  {
    title: "A shorter path to your kitchen",
    copy:
      "Fewer handoffs means better freshness, tighter quality control, and more predictable consistency."
  },
  {
    title: "A difference you can actually notice",
    copy:
      "Texture, appearance, and overall eating experience feel cleaner and more premium from the first order."
  },
  {
    title: "Built for trust, not one-time purchases",
    copy:
      "Our goal is dependable quality every single time, not occasional good batches."
  }
];

export default function Home() {
  return (
    <div className="page-container space-y-6 pt-4 sm:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-brand-line shadow-glow">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(6, 47, 36, 0.92), rgba(11, 74, 55, 0.68)), url(https://gchickenimgs.s3.eu-north-1.amazonaws.com/GChickenAboutUs/PHOTO-2025-11-14-16-23-16.jpg)"
          }}
        />
        <div className="relative grid gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:py-20">
          <div className="max-w-3xl animate-fade-up">
            <span className="section-eyebrow">Farm to doorstep</span>
            <h1 className="mt-6 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Delivering farm-fresh chicken with a calmer, cleaner buying experience.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-brand-cream/80 sm:text-lg">
              Premium farm-raised chicken with full control over quality,
              hygiene, and freshness from our farm to your kitchen.
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
              {qualityPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border border-brand-line bg-white/5 px-4 py-4 text-sm leading-7 text-brand-cream/80"
                >
                  {point}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold/10 px-4 py-4 text-sm leading-7 text-brand-cream/85">
              Our goal is simple: make ordering quality chicken feel clear,
              premium, and dependable from the first click to the final delivery.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="section-shell overflow-hidden">
          <img
            src="https://gchickenimgs.s3.eu-north-1.amazonaws.com/GChickenAboutUs/PHOTO-2025-02-25-11-04-47+copy.jpg"
            alt="GChickenn farm"
            className="h-full min-h-[320px] w-full rounded-[1.5rem] object-cover"
          />
        </div>

        <div className="section-shell">
          <span className="section-eyebrow">About our farm</span>
          <h2 className="section-title mt-5">Quality starts with ownership of the process.</h2>
          <div className="mt-5 space-y-4 text-sm leading-8 text-brand-cream/80 sm:text-base">
            <p>
              GChickenn was built on a simple belief: if you want truly
              high-quality chicken, you need to control every step of the journey.
            </p>
            <p>
              While many retailers rely on traders and wholesale markets, we
              chose a different path. We rear our own birds, oversee their
              growth, and manage the path from farm to doorstep ourselves.
            </p>
            <p>
              That direct control helps us maintain consistency, freshness, and
              hygiene in a way a middleman-driven system usually cannot.
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-brand-gold/25 bg-brand-gold/10 p-5 text-sm leading-7 text-brand-cream/85">
            We are working to set a higher standard for chicken in Gurgaon: one
            where customers know where their food comes from and feel confident
            every time they order.
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="section-shell">
          <span className="section-eyebrow">What sets us apart</span>
          <h2 className="section-title mt-5">Built to feel premium before the food even arrives.</h2>
          <p className="section-copy mt-4">
            Every touchpoint should reflect the same standards as the product.
            That means fresher sourcing, clearer ordering, and more confidence in what reaches your home.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {uspItems.map((item, index) => (
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
        </div>

        <div className="section-shell overflow-hidden">
          <img
            src="https://gchickenimgs.s3.eu-north-1.amazonaws.com/GChickenAboutUs/PHOTO-2025-11-14-16-22-46.jpg"
            alt="What sets GChickenn apart"
            className="h-full min-h-[320px] w-full rounded-[1.5rem] object-cover"
          />
        </div>
      </section>

      <section className="section-shell overflow-hidden p-3 sm:p-4">
        <img
          src="https://gchickenimgs.s3.eu-north-1.amazonaws.com/GChickenAboutUs/PHOTO-2025-11-14-16-23-16.jpg"
          alt="GChickenn delivery promise"
          className="max-h-[460px] w-full rounded-[1.6rem] object-cover"
        />
      </section>

      <section className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="section-eyebrow">Contact</span>
          <h2 className="section-title mt-5">Need help with business orders or a delivery question?</h2>
          <p className="section-copy mt-4">
            Reach out directly and we will help you with product questions,
            bulk requirements, or delivery details.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-brand-line bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-sand">
              Business and general queries
            </p>
            <div className="mt-4 space-y-2 text-sm leading-7 text-brand-cream/80">
              <p>Email: sales@gchickenn.com</p>
              <p>Phone: +91 9811105130</p>
              <p>Phone: +91 9711028343</p>
            </div>
          </div>

          <div className="rounded-3xl border border-brand-line bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-sand">
              Visit us
            </p>
            <div className="mt-4 space-y-2 text-sm leading-7 text-brand-cream/80">
              <p>TAM Foods</p>
              <p>Shop No UGF-226</p>
              <p>Suncity Arcade, Golf Course Road</p>
              <p>Gurugram, Haryana 122003</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
