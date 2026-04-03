import React, { Component } from "react";
import "../Order.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      cart: {},
      activeImageIndex: {},
      form: {
        username: "",
        email: "",
        address1: "",
        address2: "",
        city: "Gurgaon",
        postcode: ""
      }
    };
  }

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/items`);
      this.setState({ items: res.data });
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  handleImageChange = (itemId, direction, totalImages) => {
    this.setState((prevState) => {
      const currentIndex = prevState.activeImageIndex[itemId] || 0;
      let newIndex = currentIndex + direction;

      if (newIndex < 0) newIndex = totalImages - 1;
      if (newIndex >= totalImages) newIndex = 0;

      return {
        activeImageIndex: {
          ...prevState.activeImageIndex,
          [itemId]: newIndex
        }
      };
    });
  };

  handleWeightChange = (item, value) => {
    this.setState((prevState) => ({
      cart: {
        ...prevState.cart,
        [item._id]: {
          ...item,
          weight: value
        }
      }
    }));
  };
  handleIncrement = (item, step = 0.5) => {
  this.setState((prevState) => {
    const currentWeight = parseFloat(prevState.cart[item._id]?.weight) || 0;
    const newWeight = (currentWeight + step).toFixed(1);

    return {
      cart: {
        ...prevState.cart,
        [item._id]: {
          ...item,
          weight: newWeight
        }
      }
    };
  });
};

handleDecrement = (item, step = 0.5) => {
  this.setState((prevState) => {
    const currentWeight = parseFloat(prevState.cart[item._id]?.weight) || 0;
    let newWeight = currentWeight - step;

    if (newWeight < 0) newWeight = 0;

    return {
      cart: {
        ...prevState.cart,
        [item._id]: {
          ...item,
          weight: newWeight.toFixed(1)
        }
      }
    };
  });
};

  handleInputChange = (e) => {
    const { name, value } = e.target;

    this.setState((prev) => ({
      form: {
        ...prev.form,
        [name]: value
      }
    }));
  };

  calculateTotal = () => {
    const { cart } = this.state;

    return Object.values(cart).reduce((total, item) => {
      const weight = parseFloat(item.weight) || 0;
      const price = parseFloat(item.price) || 0;
      return total + weight * price;
    }, 0);
  };

  getSelectedItems = () => {
    const { cart } = this.state;
    return Object.values(cart).filter(
      (item) => item.weight && parseFloat(item.weight) > 0
    );
  };

  handleSubmit = async (e) => {
  e.preventDefault();

  const { form } = this.state;
  const selectedItems = this.getSelectedItems();

  if (selectedItems.length === 0) {
    alert("Please select at least one product before placing an order.");
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
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/orders/add`, payload, {
      withCredentials: true
    });

    toast.success(res.data.message);

    this.setState({
      cart: {},
      activeImageIndex: {},
      form: {
        username: "",
        email: "",
        address1: "",
        address2: "",
        city: "Gurgaon",
        postcode: ""
      }
    });
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to place order");
  }
};

  render() {
    const { items, cart, form, activeImageIndex } = this.state;
    const selectedItems = this.getSelectedItems();
    const totalAmount = this.calculateTotal();

    return (
      <div className="order-page">
        <ToastContainer position="top-center" autoClose={2000} />
        <section className="order-hero">
          <h1 className="order-title">Order Fresh Products</h1>
          <p className="order-subtitle">
            Select your products, enter your delivery details, and place your
            order directly with GChickenn.
          </p>
        </section>

        <section className="order-products-section">
          <div className="section-heading-wrap">
            <h2 className="section-heading">Choose Your Products</h2>
            <p className="section-description">
              Enter the quantity in kilograms for any items you would like to
              order.
            </p>
          </div>

          <div className="order-products-grid">
            {items.map((item) => (
              <div key={item._id} className="order-product-card">
                <div className="order-image-carousel">
                  <img
                    src={
                      item.image && item.image.length > 0
                        ? item.image[activeImageIndex[item._id] || 0]
                        : "https://via.placeholder.com/300"
                    }
                    className="order-product-image"
                    alt={item.itemName}
                  />

                  {item.image?.length > 1 && (
                    <button
                      type="button"
                      className="carousel-btn left"
                      onClick={() =>
                        this.handleImageChange(item._id, -1, item.image.length)
                      }
                    >
                      ‹
                    </button>
                  )}

                  {item.image?.length > 1 && (
                    <button
                      type="button"
                      className="carousel-btn right"
                      onClick={() =>
                        this.handleImageChange(item._id, 1, item.image.length)
                      }
                    >
                      ›
                    </button>
                  )}
                </div>

                <div className="order-product-body">
                  <h3 className="order-product-title">{item.itemName}</h3>
                  <p className="order-product-description">{item.description}</p>
                  <p className="order-product-price">₹ {item.price} / kg</p>

                  <div className="weight-stepper">
                            <button
                              type="button"
                              className="stepper-btn"
                              onClick={() => this.handleDecrement(item)}
                            >
                              −
                            </button>

                            <input
                              type="number"
                              className="order-weight-input"
                              value={cart[item._id]?.weight || ""}
                              onChange={(e) =>
                                this.handleWeightChange(item, e.target.value)
                              }
                              min="0"
                              step="0.1"
                            />

                            <button
                              type="button"
                              className="stepper-btn"
                              onClick={() => this.handleIncrement(item)}
                            >
                              +
                            </button>
                          </div>
                  {/* <input
                    type="number"
                    className="order-weight-input"
                    placeholder="Enter weight (kg)"
                    value={cart[item._id]?.weight || ""}
                    onChange={(e) =>
                      this.handleWeightChange(item, e.target.value)
                    }
                    min="0"
                    step="0.1"
                  /> */}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="order-form-section">
          <div className="order-form-card">
            <h2 className="section-heading">Customer Details</h2>

            <form onSubmit={this.handleSubmit} className="order-form">
              <div className="form-group-custom">
                <label>Name</label>
                <p>(Enter your full order name)</p>
                <input
                  name="username"
                  value={form.username}
                  onChange={this.handleInputChange}
                  className="form-input-custom"
                  required
                />
              </div>

              <div className="form-group-custom">
                <label>Email</label>
                <p>(email id where you would like to recieve email conifrmation, you can use the same one that you used to sign up)</p>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={this.handleInputChange}
                  className="form-input-custom"
                  required
                />
              </div>

              <div className="form-group-custom">
                <label>Address Line 1</label>
                <input
                  name="address1"
                  value={form.address1}
                  onChange={this.handleInputChange}
                  className="form-input-custom"
                  required
                />
              </div>

              <div className="form-group-custom">
                <label>Address Line 2</label>
                <input
                  name="address2"
                  value={form.address2}
                  onChange={this.handleInputChange}
                  className="form-input-custom"
                />
              </div>

              <div className="form-group-custom">
                <label>City</label>
                <select
                  name="city"
                  value={form.city}
                  onChange={this.handleInputChange}
                  className="form-input-custom"
                >
                  <option>Gurgaon</option>
                  <option>Delhi (coming soon)</option>
                  <option>Noida (coming soon)</option>
                  <option>Faridabad (coming soon)</option>
                </select>
              </div>

              <div className="form-group-custom">
                <label>Postcode</label>
                <input
                  name="postcode"
                  value={form.postcode}
                  onChange={this.handleInputChange}
                  className="form-input-custom"
                  required
                />
              </div>

              <button type="submit" className="confirm-order-btn">
                Confirm Order
              </button>
            </form>
          </div>

          <div className="order-summary-card">
            <h2 className="section-heading">Order Summary</h2>
            {selectedItems.length === 0 ? (
              <p className="summary-empty">
                No items selected yet. Add weights to build your order.
              </p>
            ) : (
              <>
                <div className="summary-items">
                  {selectedItems.map((item) => {
                    const weight = parseFloat(item.weight) || 0;
                    const price = parseFloat(item.price) || 0;
                    const itemTotal = weight * price;

                    return (
                      <div className="summary-item" key={item._id}>
                        <div>
                          <h4>{item.itemName}</h4>
                          <p>
                            {weight} kg × ₹ {price}
                          </p>
                        </div>
                        <span>₹ {itemTotal.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="summary-total">
                  <span>Total</span>
                  <span>₹ {totalAmount.toFixed(2)}</span>
                </div>
                
              </>
            )}
            <label id="note">Note:</label><p>Free Delivery on All Orders. Vacuum sealed for freshness.Handled with care. Trusted Delivery‼️</p>
          </div>
        </section>
      </div>
    );
  }
}