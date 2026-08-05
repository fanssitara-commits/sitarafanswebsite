import Link from "next/link";
import Logo from "./Logo";
import FooterNewsletter from "./FooterNewsletter";
import {
  IconPhone, IconMail, IconPin, IconClock,
  IconFacebook, IconInstagram, IconTiktok, IconWhatsapp,
} from "./Icons";

export default function Footer() {
  return (
    <footer className="footer">
      {/* newsletter band */}
      <div className="footer-top">
        <div className="footer-news">
          <div className="footer-news-copy">
            <h3>Stay <span className="accent">Cool</span> with Sitara</h3>
            <p>New models, seasonal offers and cooling tips — straight to your inbox.</p>
          </div>
          <FooterNewsletter />
        </div>
      </div>

      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-chip">
              <Logo variant="footer" />
            </div>
            <p style={{ maxWidth: 320 }}>
              Delivering comfort, style and reliability to homes across the
              country. Premium ceiling, designer, pedestal and rechargeable
              fans — Sitara comfort for every home.
            </p>
            <div className="social-row" style={{ marginTop: 20 }}>
              <a className="social-chip fb" href="https://www.facebook.com/share/19G5Uunz8T/" target="_blank" rel="noreferrer" aria-label="Facebook"><IconFacebook /></a>
              <a className="social-chip ig" href="#" aria-label="Instagram"><IconInstagram /></a>
              <a className="social-chip tt" href="https://www.tiktok.com/@sitarafan_official" target="_blank" rel="noreferrer" aria-label="TikTok"><IconTiktok /></a>
              <a className="social-chip wa" href="https://wa.me/923001116492" target="_blank" rel="noreferrer" aria-label="WhatsApp"><IconWhatsapp /></a>
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/#about">About Us</Link>
            <Link href="/#why">Why Sitara</Link>
            <Link href="/#gallery">Gallery</Link>
            <Link href="/contact">Contact Us</Link>
          </div>

          <div>
            <h4>Our Products</h4>
            <Link href="/products">Designer Fans</Link>
            <Link href="/products">Ceiling Fans</Link>
            <Link href="/products">Pedestal Fans</Link>
            <Link href="/products">Rechargeable</Link>
            <Link href="/products">All Models</Link>
          </div>

          <div>
            <h4>Contact Us</h4>
            <div className="foot-contact">
              <a href="tel:+923001116492">
                <span className="foot-ic"><IconPhone /></span> +92 300 1116492
              </a>
              <a href="tel:+923110092222">
                <span className="foot-ic"><IconPhone /></span> +92 311 0092222
              </a>
              <a href="mailto:fanssitara@gmail.com">
                <span className="foot-ic"><IconMail /></span> fanssitara@gmail.com
              </a>
              <a href="https://maps.app.goo.gl/Kbb56HRLVS6V3Mu36" target="_blank" rel="noreferrer">
                <span className="foot-ic"><IconPin /></span> Sitara Fans, Gujranwala
              </a>
              <span className="foot-hours">
                <span className="foot-ic"><IconClock /></span> Mon–Sat · 9am – 8pm
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Sitara Fans. All Rights Reserved.</span>
        <span className="foot-made">Proudly manufactured in Pakistan 🇵🇰</span>
        <span className="foot-policy">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </span>
      </div>
    </footer>
  );
}
