import Link from "next/link";
import {
  IconArrowRight, IconTruck, IconShield, IconPackage, IconUsers, IconGear, IconLeaf,
} from "@/components/Icons";

export const metadata = {
  title: "Export — Sitara Fans",
  description: "Sitara Fans exports premium ceiling and designer fans worldwide — bulk supply, quality certified, reliable global shipping.",
};

const points = [
  { icon: <IconShield />, title: "Certified Quality", text: "Every export batch is quality-tested and meets international standards." },
  { icon: <IconPackage />, title: "Bulk & Wholesale", text: "Flexible order volumes with competitive factory-direct pricing." },
  { icon: <IconTruck />, title: "Reliable Shipping", text: "Secure, well-packed containers delivered on schedule to your port." },
  { icon: <IconUsers />, title: "Dedicated Support", text: "A single point of contact for your entire export order." },
];

const regions = ["Middle East", "Africa", "South Asia", "Central Asia", "Europe", "Far East"];

export default function ExportPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">International Trade</span>
          <h1>Sitara Fans, <span className="red">Worldwide.</span></h1>
          <p>
            We export our full range of premium ceiling and designer fans to
            distributors and retailers across the globe — factory-direct
            pricing, certified quality and dependable shipping.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Request an Export Quote <IconArrowRight />
          </Link>
        </div>
      </section>

      <section className="info-section">
        <div className="info-lead">
          <span className="eyebrow">Why Export With Sitara</span>
          <h2 className="section-title">
            A <span className="blue">Trusted</span> Manufacturing{" "}
            <span className="red">Partner.</span>
          </h2>
          <p style={{ marginTop: 12 }}>
            Because we manufacture every fan in our own factory, we control
            quality, capacity and cost at the source — so your shipments are
            consistent, on time and competitively priced.
          </p>
        </div>

        <div className="grid grid-4">
          {points.map((p) => (
            <div key={p.title} className="feature-tile">
              <span className="icon">{p.icon}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="center mb-40">
            <span className="eyebrow" style={{ justifyContent: "center" }}>Global Reach</span>
            <h2 className="section-title">Regions We <span className="blue">Serve</span></h2>
          </div>
          <div className="grid grid-3">
            {regions.map((r) => (
              <div key={r} className="channel">
                <span className="ic"><IconTruck /></span>
                <div><h3>{r}</h3><p>Bulk supply &amp; distribution partners welcome.</p></div>
              </div>
            ))}
          </div>
          <div className="center" style={{ marginTop: 36 }}>
            <Link href="/contact" className="btn btn-blue">
              Become a Distributor <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
