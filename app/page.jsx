import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import ProductMarquee from "@/components/ProductMarquee";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";
import { products as staticProducts, formatPKR } from "@/data/products";
import { ensureProductsSeeded } from "@/lib/seedProducts";
import {
  IconShield, IconGear, IconLeaf, IconUsers, IconArrowRight, IconStar,
} from "@/components/Icons";

// Cache the rendered landing page and refresh it periodically (ISR) instead of
// hitting the DB + re-rendering on every visit. Admin edits appear within ~2 min.
export const revalidate = 120;

// ids each section prefers to show — a DIFFERENT mix of designs per section
const FEATURED_IDS = ["sitara-royal-gold", "sitara-prime-black", "sitara-classic-ivory", "sitara-snow-white"];
const ABOUT_IDS = ["sitara-imperial-wood", "sitara-frost-white", "sitara-noir-gold", "sitara-royal-gold"];
const GALLERY_IDS = [
  "sitara-royal-gold", "sitara-prime-black", "sitara-noir-gold", "sitara-pearl-ivory",
  "sitara-matte-black", "sitara-antique-wood", "sitara-elegance-ivory", "sitara-snow-white",
];

async function getProducts() {
  try {
    const col = await ensureProductsSeeded();
    const list = await col
      .find({}, { projection: { _id: 0 } })
      .sort({ custom: -1, createdAt: -1, seq: 1 })
      .toArray();
    return list.length ? list : staticProducts;
  } catch {
    return staticProducts; // DB unreachable — fall back to the static catalogue
  }
}
// transparent cut-outs float on the dark CTA banner (no white box)
const ctaFans = [
  { src: "/images/product/product-2-disc.png", alt: "Sitara Imperial Wood" },
  { src: "/images/product/product-11-disc.png", alt: "Sitara Classic Ivory" },
];

const whyFeatures = [
  { icon: <IconGear />, title: "Advanced Technology", text: "Innovative engineering for superior, consistent performance." },
  { icon: <IconLeaf />, title: "75% Less Energy", text: "Our fans consume up to 75% less energy while delivering full comfort." },
  { icon: <IconShield />, title: "Premium Quality", text: "Strict quality standards you can trust for years." },
  { icon: <IconUsers />, title: "Customer Focused", text: "Dedicated support and service, before and after sale." },
];

const stats = [
  { icon: <IconUsers size={22} />, num: "500K+", lbl: "Happy Customers" },
  { icon: <IconLeaf size={22} />, num: "75%", lbl: "Less Energy Used" },
  { icon: <IconStar size={20} />, num: "20+", lbl: "Years of Excellence" },
  { icon: <IconShield size={22} />, num: "100%", lbl: "Quality Assured" },
];

const reviews = [
  { text: "Sitara Fans delivered exactly what they promised — powerful airflow with zero noise. Perfect finish and elegant design!", name: "Ali Raza", city: "Lahore" },
  { text: "Amazing build quality and energy efficient too. I installed the Prime Black in my home and absolutely love it!", name: "Sara Khan", city: "Karachi" },
  { text: "Finally found a fan that looks premium and works even better. Highly recommended to everyone!", name: "Usman Tariq", city: "Islamabad" },
];

export default async function HomePage() {
  const products = await getProducts();
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  // prefer the chosen ids, then top up from whatever else is available
  const pick = (ids, n) => {
    const chosen = ids.map((id) => byId[id]).filter(Boolean);
    if (chosen.length >= n) return chosen.slice(0, n);
    const extra = products.filter((p) => !ids.includes(p.id));
    return [...chosen, ...extra].slice(0, n);
  };
  const featured = pick(FEATURED_IDS, 4);
  const aboutTiles = pick(ABOUT_IDS, 4);
  const galleryItems = pick(GALLERY_IDS, 8);

  return (
    <>
      <HeroSlider />

      {/* ---------------- MOVING PRODUCT STRIP ---------------- */}
      <ProductMarquee />

      {/* ---------------- ENERGY SAVING BAND ---------------- */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <Reveal>
            <div className="eco-band">
              <span className="eco-ic"><IconLeaf size={30} /></span>
              <div className="eco-copy">
                <h2>
                  Save up to <span className="eco-num">75%</span> on Your Electricity Bills
                </h2>
                <p>
                  Every Sitara fan is engineered to consume up to <strong>75% less energy</strong> than
                  ordinary fans — the same powerful airflow, at a fraction of the cost.
                </p>
              </div>
              <Link href="/products" className="btn btn-primary eco-cta">
                Shop Energy-Savers <IconArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- FAN COLLECTION ---------------- */}
      <section className="section" id="collection">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow">Our Fan Collection</span>
              <h2 className="section-title">
                Multiple <span className="blue">Designs.</span>{" "}
                <span className="red">Every Home.</span>
              </h2>
              <p className="section-sub">
                Explore our wide range of stylish fans, crafted to deliver
                exceptional performance and elevate the beauty of your space.
              </p>
            </div>
            <Link href="/products" className="btn btn-blue">
              View All Products <IconArrowRight />
            </Link>
          </Reveal>

          <RevealGroup className="grid grid-4" gap={0.08}>
            {featured.map((p) => (
              <RevealItem key={p.id}>
                <ProductCard product={p} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section className="section" id="about">
        <div className="container">
          <div className="two-col">
            <Reveal>
              <span className="eyebrow">About Sitara</span>
              <h2 className="section-title">
                Cooling <span className="red">Pakistan</span>,{" "}
                <span className="blue">One Home</span> at a Time
              </h2>
              <p style={{ marginTop: 16 }}>
                We don&apos;t just sell fans — <strong>we manufacture every
                Sitara fan ourselves</strong>. From the copper-wound motor to
                the precision-balanced blades, each unit is built and
                quality-checked in our own factory before it reaches your home.
              </p>
              <p>
                Owning our manufacturing means we control the quality at every
                step — genuine 100% pure copper motors, durable materials, and
                honest pricing with no middlemen. Two decades on, that promise
                still powers every fan we make.
              </p>
              <Link href="/products" className="btn btn-blue mt-24">
                Explore Our Range <IconArrowRight />
              </Link>
            </Reveal>

            <RevealGroup className="about-grid" delay={0.1} gap={0.07}>
              {aboutTiles.map((p) => (
                <RevealItem key={p.id} className="about-tile">
                  <ProductImage product={p} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ---------------- WHY SITARA ---------------- */}
      <section className="section" id="why">
        <div className="container">
          <div className="two-col">
            <Reveal>
              <span className="eyebrow">Why Sitara Fans</span>
              <h2 className="section-title">
                Engineered for <span className="blue">Performance.</span> <br />
                Designed for <span className="red">Life.</span>
              </h2>
              <p style={{ marginTop: 16 }}>
                We blend cutting-edge technology with elegant design to create
                fans that not only perform better, but also complement your
                lifestyle.
              </p>
              <Link href="/#about" className="btn btn-ghost mt-24">
                Learn More About Us <IconArrowRight />
              </Link>
            </Reveal>

            <RevealGroup className="grid grid-2" delay={0.1} gap={0.07}>
              {whyFeatures.map((f) => (
                <RevealItem key={f.title} className="feature-tile">
                  <span className="icon">{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal delay={0.1}>
            <div className="statbar mt-40">
              {stats.map((s) => (
                <div key={s.lbl} className="stat">
                  <span className="stat-ic">{s.icon}</span>
                  <div className="num">{s.num}</div>
                  <div className="lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="section soft">
        <div className="container">
          <Reveal className="section-head center-head">
            <div>
              <span className="eyebrow">What Our Customers Say</span>
              <h2 className="section-title">
                Trusted by <span className="blue">Thousands</span>. Loved for{" "}
                <span className="red">Comfort.</span>
              </h2>
            </div>
          </Reveal>

          <RevealGroup className="grid grid-3" gap={0.08}>
            {reviews.map((r) => (
              <RevealItem key={r.name} className="tcard">
                <div className="tcard-quote">&ldquo;</div>
                <p className="tcard-text">{r.text}</p>
                <div className="tcard-stars">
                  {[0, 1, 2, 3, 4].map((i) => <IconStar key={i} size={16} />)}
                </div>
                <div className="tcard-who">
                  <span className="tcard-avatar">{r.name.charAt(0)}</span>
                  <span>
                    <span className="tcard-name">{r.name}</span>
                    <span className="tcard-city">{r.city}</span>
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------- GALLERY ---------------- */}
      <section className="section" id="gallery">
        <div className="container">
          <Reveal className="section-head center-head">
            <div>
              <span className="eyebrow">Gallery</span>
              <h2 className="section-title">
                Our <span className="red">Range</span> in{" "}
                <span className="blue">Colour</span>
              </h2>
              <p className="section-sub">
                A closer look at the finishes that fit every interior.
              </p>
            </div>
          </Reveal>

          <RevealGroup className="grid grid-4" gap={0.05}>
            {galleryItems.map((p) => (
              <RevealItem key={p.id}>
                <Link href={`/products/${p.id}`} className="gallery-card">
                  <span className="gallery-media">
                    <ProductImage product={p} />
                  </span>
                  <span className="gallery-meta">
                    <span className="gallery-name">{p.name}</span>
                    <span className="gallery-price">{formatPKR(p.price)}</span>
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="center" style={{ marginTop: 36 }}>
            <Link href="/products" className="btn btn-blue">
              View More Designs <IconArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="cta-banner">
              <div className="cta-inner">
                <div>
                  <h2 className="section-title" style={{ color: "#fff" }}>
                    Ready to Elevate <br />
                    Your <span className="red">Comfort?</span>
                  </h2>
                  <p style={{ marginTop: 12 }}>
                    Explore our wide range of fans and find the perfect match
                    for your home.
                  </p>
                  <Link href="/products" className="btn btn-primary mt-24">
                    Explore Our Fans <IconArrowRight />
                  </Link>
                </div>
                <div className="cta-fans">
                  {ctaFans.map((f) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={f.src} src={f.src} alt={f.alt} loading="lazy" decoding="async" />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
