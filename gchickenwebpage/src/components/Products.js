import React, { Component } from "react";
import axios from "axios";
import "../Products.css";
import "@fontsource/great-vibes";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      loading: true,
      error: "",
      lightboxOpen: false,
      lightboxImages: [],
      imageIndex: 0
    };
  }

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/items`)
      .then((response) => {
        this.setState({
          products: response.data || [],
          loading: false
        });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        this.setState({
          error: "Unable to load products right now.",
          loading: false
        });
      });
  }

  openLightbox = (images, startIndex = 0) => {
    if (!images || images.length === 0) return;

    this.setState({
      lightboxImages: images,
      imageIndex: startIndex,
      lightboxOpen: true
    });
  };

  closeLightbox = () => {
    this.setState({
      lightboxOpen: false,
      lightboxImages: [],
      imageIndex: 0
    });
  };

  nextImage = () => {
    this.setState((prev) => ({
      imageIndex: (prev.imageIndex + 1) % prev.lightboxImages.length
    }));
  };

  prevImage = () => {
    this.setState((prev) => ({
      imageIndex:
        (prev.imageIndex - 1 + prev.lightboxImages.length) %
        prev.lightboxImages.length
    }));
  };

  renderProducts = () => {
    const { products, loading, error } = this.state;

    if (loading) {
      return <p className="products-status">Loading products...</p>;
    }

    if (error) {
      return <p className="products-status error-text">{error}</p>;
    }

    if (!products.length) {
      return <p className="products-status">No products available right now.</p>;
    }

    return (
      <div className="products-grid">
        {products.map((product) => {
          const images = Array.isArray(product.image) ? product.image : [];
          const mainImage = images.length > 0 ? images[0] : "";
          const productKey = product._id || product.itemName;

          return (
            <div className="product-card" key={productKey}>
              <div className="product-card-image-wrap">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.itemName}
                    className="product-card-image"
                    onClick={() => this.openLightbox(images, 0)}
                  />
                ) : (
                  <div className="product-no-image">No image available</div>
                )}
              </div>

              <div className="product-card-body">
                <h3 className="product-name">{product.itemName}</h3>

                <p className="product-type">
                  {product.description || "Fresh farm product"}
                </p>

                <div className="product-footer">
                  <span className="product-price">
                    ₹ {product.price ?? product.Price ?? "N/A"}
                  </span>

                  {images.length > 1 && (
                    <button
                      className="view-gallery-btn"
                      onClick={() => this.openLightbox(images, 0)}
                    >
                      View Gallery
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { lightboxOpen, lightboxImages, imageIndex } = this.state;

    return (
      <div className="products-page">
        <section className="products-hero">
          <h1 className="products-title">Our Products</h1>
          <p className="products-subtitle">
            Farm-raised freshness, premium cuts, and trusted quality — directly
            from GChickenn to your kitchen.
          </p>
        </section>

        <section className="products-section">
          <div className="section-heading-wrap">
            <h2 className="section-heading">Retail Price Sheet</h2>
            <p className="section-description">
              Explore our fresh product selection.
            </p>
          </div>

          {this.renderProducts()}
        </section>

        {lightboxOpen && (
          <div className="lightbox-overlay" onClick={this.closeLightbox}>
            <div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={this.closeLightbox}>
                ×
              </button>

              {lightboxImages.length > 1 && (
                <button className="lightbox-prev" onClick={this.prevImage}>
                  ‹
                </button>
              )}

              <img
                src={lightboxImages[imageIndex]}
                alt="Expanded product"
                className="lightbox-image"
              />

              {lightboxImages.length > 1 && (
                <button className="lightbox-next" onClick={this.nextImage}>
                  ›
                </button>
              )}

              {lightboxImages.length > 1 && (
                <div className="lightbox-counter">
                  {imageIndex + 1} / {lightboxImages.length}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}