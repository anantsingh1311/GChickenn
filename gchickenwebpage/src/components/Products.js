import React, { useEffect, useMemo, useState } from "react";

import { fetchItemsFromApi } from "../utils/api";
import { formatCurrency } from "../utils/formatters";

const wholesalePriceRows = [
  {
    product: "Broiler Chicken",
    keywords: ["broiler chicken", "broiler"],
    variants: [
      { type: "With skin", price: 210 },
      { type: "Without skin", price: 230 }
    ]
  },
  {
    product: "Curry Cut",
    keywords: ["curry cut"],
    variants: [{ type: "Small pieces", price: 245 }]
  },
  {
    product: "Whole Leg (2 pcs)",
    keywords: ["whole leg", "leg"],
    variants: [
      { type: "With skin", price: 165 },
      { type: "Without skin", price: 185 }
    ]
  },
  {
    product: "Drumstick / Thigh",
    keywords: ["drumstick", "thigh"],
    variants: [{ type: "Standard cut", price: 275 }]
  },
  {
    product: "Boneless Breast / Thigh",
    keywords: ["boneless breast", "boneless thigh", "boneless"],
    variants: [{ type: "Without skin", price: 325 }]
  },
  {
    product: "Breast W/O Wings",
    keywords: ["breast w/o wings", "breast", "wings"],
    variants: [{ type: "Without skin", price: 290 }]
  },
  {
    product: "Wings",
    keywords: ["wings"],
    variants: [{ type: "Full", price: 200 }]
  },
  {
    product: "Winglet",
    keywords: ["winglet"],
    variants: [{ type: "Mid joint", price: 230 }]
  }
];

function findWholesaleMatch(wholesaleItem, productList) {
  return productList.find((product) => {
    const itemName = product.itemName?.toLowerCase() || "";
    return wholesaleItem.keywords.some((keyword) => itemName.includes(keyword));
  });
}

function renderSheetToggle(activeSheet, setActiveSheet) {
  const options = [
    { key: "retail", label: "Retail price sheet" },
    { key: "wholesale", label: "Wholesale price sheet" }
  ];

  return (
    <div className="inline-flex rounded-full border border-brand-line bg-brand-deep/30 p-1">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => setActiveSheet(option.key)}
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSheet, setActiveSheet] = useState("retail");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const normalizedProducts = await fetchItemsFromApi();
        setProducts(normalizedProducts);
      } catch (fetchError) {
        console.error("Error fetching products:", fetchError);
        setError("Unable to load products right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productList = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );

  const wholesaleCards = useMemo(
    () =>
      wholesalePriceRows.map((wholesaleItem) => {
        const matchedProduct = findWholesaleMatch(wholesaleItem, productList);

        return {
          ...wholesaleItem,
          description:
            matchedProduct?.description ||
            `Wholesale options: ${wholesaleItem.variants
              .map((variant) => variant.type)
              .join(", ")}.`
        };
      }),
    [productList]
  );

  const renderRetailCards = () => {
    if (loading) {
      return <div className="status-card">Loading products...</div>;
    }

    if (error) {
      return <div className="status-card">{error}</div>;
    }

    if (!productList.length) {
      return <div className="status-card">No products are available right now.</div>;
    }

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
                    Retail price
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  const renderWholesaleCards = () => {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {wholesaleCards.map((product, index) => {
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
                    Wholesale cut
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
                    Prices exclusive of GST
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
        <span className="section-eyebrow">Product sheets</span>
        <h1 className="section-title mt-5">Products with transparent pricing.</h1>
        <p className="section-copy mx-auto mt-4">
          Switch between retail and wholesale sheets with the same clear card layout across desktop, tablet, and mobile.
        </p>

        <div className="mt-8 flex justify-center">
          {renderSheetToggle(activeSheet, setActiveSheet)}
        </div>
      </section>

      <section className="section-shell">
        <div className="flex flex-col gap-3 border-b border-brand-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-eyebrow">
              {activeSheet === "retail" ? "Retail price sheet" : "Wholesale price sheet"}
            </span>
            <h2 className="mt-4 font-display text-3xl text-white">
              {activeSheet === "retail" ? "Current retail lineup" : "Wholesale product lineup"}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-brand-cream/70">
            {activeSheet === "retail"
              ? "Review the current product descriptions and prices before starting your order."
              : "Wholesale prices are shown by product and variant. Prices are exclusive of GST and ideal for bulk buyers."}
          </p>
        </div>

        <div className="mt-8">
          {activeSheet === "retail" ? renderRetailCards() : renderWholesaleCards()}
        </div>

        {activeSheet === "wholesale" ? (
          <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-brand-gold/25 bg-brand-gold/10 p-5 text-sm leading-7 text-brand-cream/80 lg:flex-row lg:items-center lg:justify-between">
            <p>Prices exclusive of GST. Orders are packed and handled with care.</p>
          </div>
        ) : null}
      </section>

    </div>
  );
}
