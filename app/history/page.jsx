import Link from "next/link";
import { IconArrowRight } from "@/components/Icons";

export const metadata = {
  title: "Our History — Sitara Fans",
  description: "Two decades of cooling Pakistani homes — the story of Sitara Fans, from a small workshop to a trusted national manufacturer.",
};

const milestones = [
  { year: "2004", title: "The Beginning", text: "Sitara Fans starts as a small workshop with one goal — build powerful, affordable fans for every Pakistani home." },
  { year: "2009", title: "Our Own Factory", text: "We move production in-house, taking full control of quality — from copper motor winding to blade balancing." },
  { year: "2014", title: "Designer Range", text: "We launch our premium designer line — golden, wood-finish and antique models — combining performance with style." },
  { year: "2018", title: "500,000 Homes", text: "Sitara fans reach half a million homes across the country, backed by real warranties and service." },
  { year: "2021", title: "Going Global", text: "We begin exporting to the Middle East, Africa and beyond as a trusted manufacturing partner." },
  { year: "Today", title: "Comfort For Every Home", text: "A full range of ceiling and designer fans, still made in our own factory, still built to last." },
];

export default function HistoryPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">Our Journey</span>
          <h1>Two Decades of <span className="red">Comfort.</span></h1>
          <p>
            From a small workshop to a trusted national manufacturer — the
            story of Sitara Fans is built on quality, honesty and a promise to
            keep every home cool.
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
