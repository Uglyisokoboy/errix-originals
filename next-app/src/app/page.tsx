import Image from "next/image";
import styles from "./page.module.css";
import DonateSection from "./DonateSection";
import Link from "next/link";
import ProductCard from "./products/ProductCard";
import ProjectsSection from "./ProjectsSection";
import CartIndicator from "./components/CartIndicator";

async function getProducts() {
  const res = await fetch("http://localhost:4000/api/products", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      {/* Header */}
      <header>
        <div className="header-container">
          <a href="#" className="logo" style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>Errix <span>Originals</span></a>
          <nav aria-label="Main navigation">
            <Link href="/products">Shop</Link>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#donate">Donate</a>
            <a href="#contact">Contact</a>
            <Link href="/cart" style={{
              position: 'relative',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '14px',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Cart
              <CartIndicator />
            </Link>
            <Link href="/my-account" className="account-link">My Account</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Step Into Impact</h1>
          <p>Our handmade footwear does more than walk — it speaks, empowers, and uplifts. Every pair purchased fuels dignity, education, and purpose.</p>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop-section">
        <h2>Shop Our Signature Styles</h2>
        <div className="shop" id="shop">
          {Array.isArray(products) && products.length > 0 ? (
            products.slice(0, 4).map((product: any) => (
              <ProductCard product={product} key={product.id} />
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/products" className="cta">
            <span>Explore Our Collection</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-container">
          <div className="about-content">
            <span className="about-subtitle">Our Story</span>
            <h2>Crafting Purpose<br />Through Every Step</h2>
            <p className="about-description">
              Errix_Originals transcends traditional footwear. We are a premium, purpose-driven brand based in Abuja, Nigeria, where every handmade pair represents more than style—it embodies transformation. Each creation reinvests in dignity-based outreach programs, championing girl-child education and empowerment through self-funded and community-led campaigns.
            </p>
            <div className="about-highlights">
              <div className="highlight-item">
                <div className="highlight-title">Artisan Craftsmanship</div>
                <div className="highlight-text">Every pair meticulously handcrafted by skilled artisans, ensuring premium quality and unique character.</div>
              </div>
              <div className="highlight-item">
                <div className="highlight-title">Social Impact</div>
                <div className="highlight-text">100% of profits reinvested into community programs, education initiatives, and empowerment campaigns.</div>
              </div>
              <div className="highlight-item">
                <div className="highlight-title">Sustainable Practices</div>
                <div className="highlight-text">Ethical sourcing and environmentally conscious production methods that respect our planet.</div>
              </div>
              <div className="highlight-item">
                <div className="highlight-title">Community First</div>
                <div className="highlight-text">Built on the foundation of local partnerships and grassroots community development.</div>
              </div>
            </div>
          </div>
          <div className="about-visual">
            <div className="visual-element">
              <div className="floating-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectsSection />

      <DonateSection />

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="contact-container">
          <h2>Get In Touch</h2>
          <div className="contact-grid">
            <a href="mailto:errix_originals@gmail.com" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="contact-card" style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}>
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h3>Email</h3>
                <p>errix_originals@gmail.com</p>
              </div>
            </a>
            <a href="tel:08100514596" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="contact-card" style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}>
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <h3>Phone</h3>
                <p>08100514596</p>
              </div>
            </a>
            <a href="https://instagram.com/errix_originals" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="contact-card" style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}>
                <div className="contact-icon">
                  <i className="fab fa-instagram"></i>
                </div>
                <h3>Instagram</h3>
                <p>@errix_originals</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Errix Originals</h3>
              <p>Craft with Purpose. Walk with Dignity.</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Quick Links</h4>
                <Link href="/products">Shop</Link>
                <a href="#about">About</a>
                <a href="#projects">Projects</a>
                <a href="#donate">Donate</a>
              </div>
              <div className="footer-section">
                <h4>Contact</h4>
                <a href="mailto:errix_originals@gmail.com">Email</a>
                <a href="tel:08100514596">Phone</a>
                <a href="https://instagram.com/errix_originals">Instagram</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Errix_Originals | RC: 8348241</p>
          </div>
        </div>
      </footer>
    </>
  );
}
