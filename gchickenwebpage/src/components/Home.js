import React, {Component} from "react";
import "../Home.css"

export default class Home extends Component {
  render() {
    return (
      <div className="home-page">
        <section className="home-hero">
          <div className="home-hero-overlay">
            <h1 className="home-title">DELIVERING FARM-FRESH CHICKEN</h1>
            <p className="home-subtitle">
              Premium farm-raised chicken with full control over quality,
              hygiene, and freshness — from our farm to your doorstep.
            </p>
          </div>
        </section>

        <section className="home-section about-section">
          <div className="home-section-image">
            <img
              src="https://gchickenimgs.s3.eu-north-1.amazonaws.com/GChickenAboutUs/PHOTO-2025-02-25-11-04-47+copy.jpg"
              alt="GChickenn farm"
            />
          </div>

          <div className="home-section-content">
            <h2>About Us / Our Farm</h2>
            <p>
              GChickenn was built on a simple belief — if you want truly
              high-quality chicken, you need to control every step of the
              process.
            </p>

            <p>
              While most chicken retailers rely on traders and wholesale markets
              like Ghazipur Mandi, we chose a different path. We rear our own
              birds on our farm, manage their growth, and oversee the entire
              journey from farm to your doorstep.
            </p>

            <p>
              This direct control allows us to maintain a level of consistency,
              freshness, and quality that simply isn’t possible in a
              middleman-driven system. Every batch is raised under monitored
              conditions, handled with care, and processed with hygiene as a
              priority.
            </p>

            <p>
              The difference isn’t just in how it’s sourced — it’s something you
              can see and taste. From texture to appearance to overall eating
              experience, our chicken stands apart from what’s commonly
              available in the market.
            </p>

            <div className="home-highlight">
              Our goal is to set a new standard for chicken in Gurgaon — one
              where customers know exactly where their food comes from and can
              trust its quality every single time.
            </div>
          </div>
        </section>

        <section className="home-section usp-section">
          <div className="home-section-content">
            <h2>What Sets Us Apart</h2>

            <div className="usp-grid">
              <div className="usp-card">
                <h3>1. We Don’t Source. We Raise.</h3>
                <p>
                  Our chicken comes directly from our own farm — not from
                  traders or wholesale markets.
                </p>
              </div>

              <div className="usp-card">
                <h3>2. No Middlemen</h3>
                <p>
                  No dependency on mandis means better control, better hygiene,
                  and better consistency.
                </p>
              </div>

              <div className="usp-card">
                <h3>3. Farm-to-Home Freshness</h3>
                <p>
                  From our farm to your kitchen with minimal handling and
                  maximum freshness.
                </p>
              </div>

              <div className="usp-card">
                <h3>4. Consistent Quality, Every Time</h3>
                <p>
                  Because we control the entire process, you get the same high
                  standard in every order.
                </p>
              </div>

              <div className="usp-card">
                <h3>5. A Noticeable Difference</h3>
                <p>
                  Better texture, cleaner cuts, and superior overall quality
                  compared to typical market chicken.
                </p>
              </div>
            </div>
          </div>

          <div className="home-section-image">
            <img
              src="https://gchickenimgs.s3.eu-north-1.amazonaws.com/GChickenAboutUs/PHOTO-2025-11-14-16-22-46.jpg"
              alt="What sets GChickenn apart"
            />
          </div>
        </section>

        <section className="home-banner-section">
          <img
            src="https://gchickenimgs.s3.eu-north-1.amazonaws.com/GChickenAboutUs/PHOTO-2025-11-14-16-23-16.jpg"
            alt="GChickenn banner"
            className="home-banner-image"
          />
        </section>
        <section className="home-contact-section">
  <div className="home-contact-card">
    <h2>Contact Us</h2>

    <div className="contact-block">
      <h4>For Business & Other Queries</h4>
      <p>Email: sales@gchickenn.com</p>
      <p>Phone: +91 9811105130</p>
    </div>

    <div className="contact-block">
      <h4>Address</h4>
      <p>TAM Foods</p>
      <p>Shop No UGF-226</p>
      <p>Suncity Arcade</p>
      <p>Golf Course Road</p>
      <p>Gurugram, Haryana 122003</p>
    </div>
  </div>
</section>
      </div>
    );
  }
}