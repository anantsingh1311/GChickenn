import React, { useState } from "react";

import sampleProducts from "../data/sampleProducts";
import { formatCurrency } from "../utils/formatters";

const businessPriceRows = [
  {
    product: "Wireless Headphones",
    keywords: ["wireless headphones", "headphones"],
    variants: [
      { type: "Single item", price: 3499 },
      { type: "Pair bundle", price: 6499 }
    ]
  },
  {
    product: "Everyday Backpack",
    keywords: ["everyday backpack", "backpack"],
    variants: [
      { type: "Single item", price: 1899 },
      { type: "Set of 5", price: 8499 }
    ]
  },
  {
    product: "Ceramic Planter",
    keywords: ["ceramic planter", "planter"],
    variants: [
      { type: "Single item", price: 799 },
      { type: "Set of 4", price: 2799 }
    ]
  },
  {
    product: "Stainless Travel Bottle",
    keywords: ["stainless travel bottle", "travel bottle"],
    variants: [
      { type: "Single item", price: 999 },
      { type: "Set of 4", price: 3499 }
    ]
  },
  {
    product: "Mechanical Keyboard",
    keywords: ["mechanical keyboard", "keyboard"],
    variants: [
      { type: "Single item", price: 4299 },
      { type: "Office set of 5", price: 19999 }
    ]
  },
  {
    product: "Cotton Throw Blanket",
    keywords: ["cotton throw blanket", "throw blanket"],
    variants: [
      { type: "Single item", price: 1499 },
      { type: "Set of 3", price: 3999 }
    ]
  }
];

function findProductMatch(businessItem, productList) {
  return productList.find((product) => {
    const itemName = product.itemName?.toLowerCase() || "";
    return businessItem.keywords.some((keyword) => itemName.includes(keyword));
  });
}

function renderSheetToggle(activeSheet, setActiveSheet) {
  const options = [
    { key: "catalog", label: "Sample catalog" },
    { key: "business", label: "Business bundles" }
  ];

  return (
    <div className="inline-flex rounded-full border border-brand-line bg-brand-deep/30 p-1">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => setActiveSheet(option.key)}
          aria-pressed={activeSheet === option.key}
          className={[
            "rounded-full px-4 py-2 text-sm font-semibold transition duration-200 sm:px-5",
            activeSheet === option.key
              ? "bg-brand-gold text-brand-deep"
              : "text-brand-cream/75 hover:bg-white/10 hover:text-white"
          ].join(" ")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function Products() {
  const [activeSheet, setActiveSheet] = useState("catalog");
  const productList = sampleProducts;
  const businessCards = businessPriceRows.map((businessItem) => {
    const matchedProduct = findProductMatch(businessItem, productList);

    return {
      ...businessItem,
      description:
        matchedProduct?.description ||
        `Bundle options: ${businessItem.variants
          .map((variant) => variant.type)
          .join(", ")}.`
    };
  });

  const renderCatalogCards = () => {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {productList.map((product, index) => {
          const productKey = product._id || product.itemName;
          const productInitial = product.itemName?.trim().charAt(0).toUpperCase() || "P";

          return (
            <article
              key={productKey}
              className="group overflow-hidden rounded-3xl border border-brand-line bg-white/5 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:bg-white/10"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex h-36 items-center justify-center border-b border-brand-line bg-brand-deep/30">
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-brand-gold/30 bg-brand-gold/10 font-display text-4xl text-brand-gold transition duration-300 group-hover:scale-105">
                  {productInitial}
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-sand">
                    Featured product
                  </p>
                  <h3 className="font-display text-2xl text-white">{product.itemName}</h3>
                  <p className="min-h-[3.5rem] text-sm leading-7 text-brand-cream/75">
                    {product.description || "Quality product available to order."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-brand-gold">
                    {formatCurrency(product.price ?? product.Price ?? 0)}
                  </p>

                  <span className="text-xs uppercase tracking-[0.18em] text-brand-cream/55">
                    Sample price
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  const renderBusinessCards = () => {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {businessCards.map((product, index) => {
          const productInitial = product.product.trim().charAt(0).toUpperCase();

          return (
            <article
              key={product.product}
              className="group overflow-hidden rounded-3xl border border-brand-line bg-white/5 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:bg-white/10"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex h-36 items-center justify-center border-b border-brand-line bg-brand-deep/30">
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-brand-gold/30 bg-brand-gold/10 font-display text-4xl text-brand-gold transition duration-300 group-hover:scale-105">
                  {productInitial}
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-sand">
                    Business bundle
                  </p>
                  <h3 className="font-display text-2xl text-white">{product.product}</h3>
                  <p className="min-h-[3.5rem] text-sm leading-7 text-brand-cream/75">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {product.variants.map((variant) => (
                    <div
                      key={`${product.product}-${variant.type}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-brand-line bg-brand-deep/30 px-4 py-3"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sand">
                          Type
                        </p>
                        <p className="mt-1 text-sm text-brand-cream/80">{variant.type}</p>
                      </div>
                      <p className="text-lg font-semibold text-brand-gold">
                        {formatCurrency(variant.price)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-cream/55">
                    Demonstration pricing
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <div className="page-container space-y-6 pt-4 sm:space-y-8">
      <section className="section-shell text-center">
        <span className="section-eyebrow">Demo catalog</span>
        <h1 className="section-title mt-5">Sample products for a complete storefront preview.</h1>
        <p className="section-copy mx-auto mt-4">
          Explore a neutral demonstration catalog and business bundle view across desktop, tablet, and mobile.
        </p>

        <div className="mt-8 flex justify-center">
          {renderSheetToggle(activeSheet, setActiveSheet)}
        </div>
      </section>

      <section className="section-shell">
        <div className="flex flex-col gap-3 border-b border-brand-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-eyebrow">
              {activeSheet === "catalog" ? "Sample catalog" : "Business bundles"}
            </span>
            <h2 className="mt-4 font-display text-3xl text-white">
              {activeSheet === "catalog" ? "Featured sample products" : "Example bundle pricing"}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-brand-cream/70">
            {activeSheet === "catalog"
              ? "Review sample descriptions and prices, then try the ordering experience."
              : "Business bundle pricing demonstrates how product variants and volume offers can be presented."}
          </p>
        </div>

        <div className="mt-8">
          {activeSheet === "catalog" ? renderCatalogCards() : renderBusinessCards()}
        </div>

        {activeSheet === "business" ? (
          <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-brand-gold/25 bg-brand-gold/10 p-5 text-sm leading-7 text-brand-cream/80 lg:flex-row lg:items-center lg:justify-between">
            <p>All products and prices shown here are sample content for demonstration purposes.</p>
          </div>
        ) : null}
      </section>

    </div>
  );
}
