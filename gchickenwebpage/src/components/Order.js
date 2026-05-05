import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { API_URL } from "../config";
import { fetchItemsFromApi } from "../utils/api";
import { formatCurrency } from "../utils/formatters";

const initialForm = {
  username: "",
  email: "",
  address1: "",
  address2: "",
  city: "Gurgaon",
  postcode: ""
};

const toastProps = {
  position: "top-center",
  autoClose: 2400,
  toastStyle: {
    background: "#0b4a37",
    color: "#f6edd2",
    border: "1px solid rgba(216, 180, 91, 0.28)"
  }
};

export default function Order() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [form, setForm] = useState(initialForm);
  const [loadingItems, setLoadingItems] = useState(true);
  const [itemsError, setItemsError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const normalizedItems = await fetchItemsFromApi();
        setItems(normalizedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        setItemsError("Unable to load products for ordering right now.");
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, []);

  const handleImageChange = (itemId, direction, totalImages) => {
    setActiveImageIndex((current) => {
      const currentIndex = current[itemId] || 0;
      let nextIndex = currentIndex + direction;

      if (nextIndex < 0) {
        nextIndex = totalImages - 1;
      }

      if (nextIndex >= totalImages) {
        nextIndex = 0;
      }

      return { ...current, [itemId]: nextIndex };
    });
  };

  const handleWeightChange = (item, value) => {
    setCart((current) => ({
      ...current,
      [item._id]: {
        ...item,
        weight: value
      }
    }));
  };

  const handleWeightStep = (item, delta) => {
    setCart((current) => {
      const currentWeight = parseFloat(current[item._id]?.weight) || 0;
      const nextWeight = Math.max(0, Number((currentWeight + delta).toFixed(1)));

      return {
        ...current,
        [item._id]: {
          ...item,
          weight: nextWeight.toFixed(1)
        }
      };
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const selectedItems = Object.values(cart).filter(
    (item) => item.weight && parseFloat(item.weight) > 0
  );

  const totalAmount = selectedItems.reduce((total, item) => {
    const weight = parseFloat(item.weight) || 0;
    const price = parseFloat(item.price) || 0;
    return total + weight * price;
  }, 0);

  const resetOrder = () => {
    setCart({});
    setActiveImageIndex({});
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedItems.length) {
      toast.error("Please select at least one product before placing an order.", toastProps);
      return;
    }

    const payload = {
      ...form,
      items: selectedItems.map((item) => ({
        itemName: item.itemName,
        price: Number(item.price),
        weight: Number(item.weight)
      }))
    };

    try {
      setSubmitting(true);

      const response = await axios.post(`${API_URL}/orders/add`, payload, {
        withCredentials: true
      });

      toast.success(response.data.message || "Order placed successfully.", toastProps);

      resetOrder();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order.", toastProps);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer {...toastProps} />
      <div className="page-container space-y-6 pt-4 sm:space-y-8">
        <section className="section-shell text-center">
          <span className="section-eyebrow">Place your order</span>
          <h1 className="section-title mt-5">Build a fresh order with clearer steps and faster review.</h1>
          <p className="section-copy mx-auto mt-4">
            Choose your products, set quantities in kilograms, and confirm delivery details from one responsive flow.
          </p>
        </section>

        <section className="section-shell">
          <div className="flex flex-col gap-3 border-b border-brand-line pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-eyebrow">Step 1</span>
              <h2 className="mt-4 font-display text-3xl text-white">Choose your products</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-brand-cream/70">
              Use the quantity controls to add exact weights. Your summary updates automatically as you go.
            </p>
          </div>

          <div className="mt-8">
            {loadingItems ? <div className="status-card">Loading available products...</div> : null}
            {!loadingItems && itemsError ? <div className="status-card">{itemsError}</div> : null}

            {!loadingItems && !itemsError ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => {
                  const imageList = Array.isArray(item.image) ? item.image : [];
                  const itemWeight = cart[item._id]?.weight || "";

                  return (
                    <article
                      key={item._id}
                      className="overflow-hidden rounded-3xl border border-brand-line bg-white/5 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:bg-white/10"
                    >
                      <div className="relative h-60 overflow-hidden bg-brand-deep/35">
                        <img
                          src={
                            imageList.length
                              ? imageList[activeImageIndex[item._id] || 0]
                              : "https://via.placeholder.com/600x400?text=GChickenn"
                          }
                          alt={item.itemName}
                          className="h-full w-full object-cover"
                        />

                        {imageList.length > 1 ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleImageChange(item._id, -1, imageList.length)}
                              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-line bg-brand-deep/80 text-brand-cream transition hover:bg-brand-gold hover:text-brand-deep"
                            >
                              {"<"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleImageChange(item._id, 1, imageList.length)}
                              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-line bg-brand-deep/80 text-brand-cream transition hover:bg-brand-gold hover:text-brand-deep"
                            >
                              {">"}
                            </button>
                          </>
                        ) : null}
                      </div>

                      <div className="space-y-4 p-5">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-display text-2xl text-white">{item.itemName}</h3>
                            {parseFloat(itemWeight) > 0 ? (
                              <span className="rounded-full bg-brand-gold px-3 py-1 text-xs font-semibold text-brand-deep">
                                Added
                              </span>
                            ) : null}
                          </div>
                          <p className="min-h-[3.5rem] text-sm leading-7 text-brand-cream/75">
                            {item.description || "Fresh farm product"}
                          </p>
                          <p className="text-base font-semibold text-brand-gold">
                            {formatCurrency(item.price)} / kg
                          </p>
                        </div>

                        <div className="rounded-3xl border border-brand-line bg-brand-deep/30 p-4">
                          <label className="input-label" htmlFor={`weight-${item._id}`}>
                            Quantity in kilograms
                          </label>
                          <div className="mt-3 flex items-center gap-3">
                            <button
                              type="button"
                              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-white/5 text-xl text-brand-cream transition hover:bg-white/10"
                              onClick={() => handleWeightStep(item, -0.5)}
                            >
                              -
                            </button>

                            <input
                              id={`weight-${item._id}`}
                              type="number"
                              min="0"
                              step="0.1"
                              value={itemWeight}
                              onChange={(event) => handleWeightChange(item, event.target.value)}
                              className="input-field text-center"
                              placeholder="0.0"
                            />

                            <button
                              type="button"
                              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-white/5 text-xl text-brand-cream transition hover:bg-white/10"
                              onClick={() => handleWeightStep(item, 0.5)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="section-shell">
            <div className="border-b border-brand-line pb-6">
              <span className="section-eyebrow">Step 2</span>
              <h2 className="mt-4 font-display text-3xl text-white">Delivery details</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-cream/70">
                Add the customer name, email, and full address for order confirmation and delivery coordination.
              </p>
            </div>

            <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
              <div className="sm:col-span-2">
                <label className="input-label" htmlFor="username">
                  Name
                </label>
                <p className="input-hint">Enter the full name for this order.</p>
                <input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="input-label" htmlFor="email">
                  Email
                </label>
                <p className="input-hint">
                  Use the email where you would like the order confirmation.
                </p>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="input-label" htmlFor="address1">
                  Address line 1
                </label>
                <input
                  id="address1"
                  name="address1"
                  value={form.address1}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="input-label" htmlFor="address2">
                  Address line 2
                </label>
                <input
                  id="address2"
                  name="address2"
                  value={form.address2}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label" htmlFor="city">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option>Gurgaon</option>
                  <option disabled>Delhi (coming soon)</option>
                  <option disabled>Noida (coming soon)</option>
                  <option disabled>Faridabad (coming soon)</option>
                </select>
              </div>

              <div>
                <label className="input-label" htmlFor="postcode">
                  Postcode
                </label>
                <input
                  id="postcode"
                  name="postcode"
                  value={form.postcode}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <button type="submit" className="primary-button w-full" disabled={submitting}>
                  {submitting ? "Placing order..." : "Confirm order"}
                </button>
              </div>
            </form>
          </div>

          <aside className="section-shell h-fit xl:sticky xl:top-36">
            <div className="border-b border-brand-line pb-6">
              <span className="section-eyebrow">Step 3</span>
              <h2 className="mt-4 font-display text-3xl text-white">Order summary</h2>
              <p className="mt-3 text-sm leading-7 text-brand-cream/70">
                Review quantities and totals before you confirm.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {!selectedItems.length ? (
                <div className="status-card">
                  No items selected yet. Add quantities above to build your order.
                </div>
              ) : (
                <>
                  {selectedItems.map((item) => {
                    const weight = parseFloat(item.weight) || 0;
                    const price = parseFloat(item.price) || 0;
                    const itemTotal = weight * price;

                    return (
                      <div
                        key={item._id}
                        className="rounded-3xl border border-brand-line bg-white/5 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display text-xl text-white">{item.itemName}</h3>
                            <p className="mt-2 text-sm leading-7 text-brand-cream/70">
                              {weight} kg x {formatCurrency(price)}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-brand-gold">
                            {formatCurrency(itemTotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="rounded-3xl border border-brand-gold/25 bg-brand-gold/10 p-5">
                    <div className="flex items-center justify-between text-base font-semibold text-white">
                      <span>Total</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-brand-cream/75">
                      Free delivery on all orders. Vacuum sealed for freshness and handled with care.
                    </p>
                  </div>
                </>
              )}
            </div>
          </aside>
        </section>
      </div>
    </>
  );
}
