import Link from "next/link";
import { IconArrowRight } from "@/components/Icons";

export const metadata = {
  title: "Our History — Sitara Fans",
  description: "From Prime Metal in 1950 to Sitara Fans in 2025 — three generations of metal craftsmanship, now cooling Pakistani homes.",
};

const milestones = [
  { year: "1950", title: "Prime Metal is Born", text: "Our family's journey begins with Prime Metal — a small metalworks crafting precision metal components and building a name for honest quality." },
  { year: "1975", title: "Mastering the Craft", text: "Two decades of metalworking sharpen our expertise in casting, winding and finishing — the foundations of a great electric fan." },
  { year: "1998", title: "Into Motors & Components", text: "Prime Metal expands into motor parts and precision components, supplying manufacturers across Pakistan." },
  { year: "2015", title: "A New Vision", text: "The next generation sees an opportunity: use decades of metal expertise to build premium fans under our own name." },
  { year: "2025", title: "Sitara Fans Launches", text: "Backed by 75 years of Prime Metal craftsmanship, Sitara Fans opens its doors — pure copper motors, designer finishes and a lifetime motor warranty." },
  { year: "Today", title: "Comfort For Every Home", text: "A full range of ceiling and designer fans, made in-house with the same care Prime Metal has stood for since 1950." },
];

export default function HistoryPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">Our Journey</span>
          <h1>75 Years in the <span className="red">Making.</span></h1>
          <p>
            From Prime Metal in 1950 to Sitara Fans in 2025 — three generations
            of metal craftsmanship, honesty and a promise to keep every home
            cool.
          </p>
        </div>
      </section>

      <section className="info-section">
        <div className="center" style={{ marginBottom: 44 }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>Milestones</span>
          <h2 className="section-title">
            The <span className="blue">Sitara</span> <span className="red">Story.</span>
          </h2>
        </div>

        <div className="timeline">
          {milestones.map((m) => (
            <div key={m.year} className="tl-item">
              <span className="tl-year">{m.year}</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </div>
          ))}
        </div>

        <div className="center" style={{ marginTop: 40 }}>
          <Link href="/products" className="btn btn-blue">
            Explore Today&apos;s Range <IconArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
