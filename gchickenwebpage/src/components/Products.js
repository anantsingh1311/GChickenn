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

function getFirstImage(images) {
  return Array.isArray(images) && images.length ? images[0] : "";
}

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
  const [lightboxImages, setLightboxImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
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

  useEffect(() => {
    if (!lightboxImages.length) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightboxImages([]);
        setImageIndex(0);
      }

      if (event.key === "ArrowRight" && lightboxImages.length > 1) {
        setImageIndex((current) => (current + 1) % lightboxImages.length);
      }

      if (event.key === "ArrowLeft" && lightboxImages.length > 1) {
        setImageIndex((current) => (current - 1 + lightboxImages.length) % lightboxImages.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImages]);

  const openLightbox = (images, startIndex = 0) => {
    if (!images?.length) {
      return;
    }

    setLightboxImages(images);
    setImageIndex(startIndex);
  };

  const closeLightbox = () => {
    setLightboxImages([]);
    setImageIndex(0);
  };

  const nextImage = () => {
    setImageIndex((current) => (current + 1) % lightboxImages.length);
  };

  const previousImage = () => {
    setImageIndex((current) => (current - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const productList = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );

  const wholesaleCards = useMemo(
    () =>
      wholesalePriceRows.map((wholesaleItem) => {
        const matchedProduct = findWholesaleMatch(wholesaleItem, productList);
        const images = Array.isArray(matchedProduct?.image) ? matchedProduct.image : [];

        return {
          ...wholesaleItem,
          description:
            matchedProduct?.description ||
            `Wholesale options: ${wholesaleItem.variants
              .map((variant) => variant.type)
              .join(", ")}.`,
          images
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
          const images = Array.isArray(product.image) ? product.image : [];
          const mainImage = getFirstImage(images);
          const productKey = product._id || product.itemName;

          return (
            <article
              key={productKey}
              className="group overflow-hidden rounded-3xl border border-brand-line bg-white/5 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:bg-white/10"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                {mainImage ? (
                  <button
                    type="button"
                    onClick={() => openLightbox(images, 0)}
                    className="h-full w-full"
                  >
                    <img
                      src={mainImage}
                      alt={product.itemName}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </button>
                ) : (
                  <div className="flex h-full items-center justify-center bg-brand-deep/30 px-6 text-center text-sm text-brand-cream/65">
                    No image available
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-sand">
                    Premium cut
                  </p>
                  <h3 className="font-display text-2xl text-white">{product.itemName}</h3>
                  <p className="min-h-[3.5rem] text-sm leading-7 text-brand-cream/75">
                    {product.description || "Fresh farm product"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-brand-gold">
                    {formatCurrency(product.price ?? product.Price ?? 0)}
                  </p>

                  {images.length > 1 ? (
                    <button
                      type="button"
                      className="secondary-button px-4 py-2"
                      onClick={() => openLightbox(images, 0)}
                    >
                      View gallery
                    </button>
                  ) : null}
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
          const mainImage = getFirstImage(product.images);

          return (
            <article
              key={product.product}
              className="group overflow-hidden rounded-3xl border border-brand-line bg-white/5 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:bg-white/10"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                {mainImage ? (
                  <button
                    type="button"
                    onClick={() => openLightbox(product.images, 0)}
                    className="h-full w-full"
                  >
                    <img
                      src={mainImage}
                      alt={product.product}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </button>
                ) : (
                  <div className="flex h-full items-center justify-center bg-brand-deep/30 px-6 text-center text-sm text-brand-cream/65">
                    No image available
                  </div>
                )}
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

                  {product.images.length > 1 ? (
                    <button
                      type="button"
                      className="secondary-button px-4 py-2"
                      onClick={() => openLightbox(product.images, 0)}
                    >
                      View gallery
                    </button>
                  ) : null}
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
        <h1 className="section-title mt-5">Fresh products with transparent pricing.</h1>
        <p className="section-copy mx-auto mt-4">
          Switch between retail and wholesale sheets with the same premium card layout, imagery, and gallery experience across desktop, tablet, and mobile.
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
              ? "Tap any product image to open a larger preview. Gallery controls appear automatically when more than one image is available."
              : "Wholesale pricing is shown as image-based product cards with the same gallery behavior as retail. Prices are exclusive of GST and ideal for bulk buyers."}
          </p>
        </div>

        <div className="mt-8">
          {activeSheet === "retail" ? renderRetailCards() : renderWholesaleCards()}
        </div>

        {activeSheet === "wholesale" ? (
          <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-brand-gold/25 bg-brand-gold/10 p-5 text-sm leading-7 text-brand-cream/80 lg:flex-row lg:items-center lg:justify-between">
            <p>Prices exclusive of GST. Hygienic, vacuum-sealed packaging.</p>
            <p className="font-medium text-white">Wholesale enquiries: +91 9711028343</p>
          </div>
        ) : null}
      </section>

      {lightboxImages.length ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div
            className="relative flex max-h-[92vh] max-w-6xl items-center justify-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            {lightboxImages.length > 1 ? (
              <button
                type="button"
                onClick={previousImage}
                className="hidden h-12 w-12 items-center justify-center rounded-full border border-brand-line bg-brand-deep/85 text-xl text-brand-cream transition hover:bg-brand-gold hover:text-brand-deep sm:inline-flex"
              >
                {"<"}
              </button>
            ) : null}

            <div className="relative overflow-hidden rounded-[1.7rem] border border-brand-line bg-brand-deep shadow-glow">
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-brand-deep/80 text-lg text-brand-cream transition hover:bg-brand-gold hover:text-brand-deep"
              >
                X
              </button>
              <img
                src={lightboxImages[imageIndex]}
                alt="Expanded product"
                className="max-h-[82vh] max-w-[88vw] object-contain"
              />
              {lightboxImages.length > 1 ? (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-brand-line bg-brand-deep/80 px-4 py-2 text-sm text-brand-cream">
                  {imageIndex + 1} / {lightboxImages.length}
                </div>
              ) : null}
            </div>

            {lightboxImages.length > 1 ? (
              <button
                type="button"
                onClick={nextImage}
                className="hidden h-12 w-12 items-center justify-center rounded-full border border-brand-line bg-brand-deep/85 text-xl text-brand-cream transition hover:bg-brand-gold hover:text-brand-deep sm:inline-flex"
              >
                {">"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
