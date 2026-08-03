"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useInventory, emptyProduct, CATEGORIES, WARRANTIES } from "@/context/InventoryContext";
import { useCart } from "@/context/CartContext";
import { IconPackage, IconArrowRight, IconArrowLeft } from "@/components/Icons";

function compress(file, maxW = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function InventoryFormPage() {
  return (
    <Suspense fallback={<div className="admin-page"><p>Loading…</p></div>}>
      <InventoryForm />
    </Suspense>
  );
}

function InventoryForm() {
  const router = useRouter();
  const params = useSearchParams();
  const editingId = params.get("id");
  const { allProducts, addProduct, updateProduct } = useInventory();
  const { showToast } = useCart();

  const [form, setForm] = useState(emptyProduct);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  // load the product when editing (inventory hydrates from localStorage async)
  useEffect(() => {
    if (!editingId) { setLoaded(true); return; }
    const p = allProducts.find((x) => x.id === editingId);
    if (p && !loaded) {
      setForm({
        ...emptyProduct, ...p,
        price: String(p.price ?? ""),
        oldPrice: p.oldPrice ? String(p.oldPrice) : "",
        stock: p.stock ?? "",
        colors: Array.isArray(p.colors) ? p.colors : [],
        variants: Array.isArray(p.variants)
          ? p.variants.map((v) => ({ label: v.label || "", price: String(v.price ?? "") }))
          : [],
      });
      setLoaded(true);
    }
  }, [editingId, allProducts, loaded]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target?.value ?? e }));

  // compress on the client, then upload to Cloudinary via our API; returns the hosted URL
  const uploadToCloud = async (dataUrl) => {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: dataUrl }),
    });
    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error || "Upload failed.");
    return data.url;
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setErr("Please choose an image file."); return; }
    setUploading(true);
    try {
      const dataUrl = await compress(file);
      const url = await uploadToCloud(dataUrl);
      setForm((f) => ({ ...f, img: url }));
      setErr(null);
    } catch (e2) { setErr(e2.message || "Could not upload that image."); }
    finally { setUploading(false); }
  };

  // ---- colour variants (each has a name + its own photo) ----
  const colors = Array.isArray(form.colors) ? form.colors : [];
  const addColor = () =>
    setForm((f) => ({ ...f, colors: [...(f.colors || []), { name: "", img: "" }] }));
  const removeColor = (i) =>
    setForm((f) => ({ ...f, colors: (f.colors || []).filter((_, idx) => idx !== i) }));
  const setColorName = (i, name) =>
    setForm((f) => ({ ...f, colors: (f.colors || []).map((c, idx) => (idx === i ? { ...c, name } : c)) }));
  const setColorImg = async (i, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setErr("Please choose an image file for the colour."); return; }
    setUploading(true);
    try {
      const dataUrl = await compress(file);
      const url = await uploadToCloud(dataUrl);
      setForm((f) => ({ ...f, colors: (f.colors || []).map((c, idx) => (idx === i ? { ...c, img: url } : c)) }));
      setErr(null);
    } catch (e2) { setErr(e2.message || "Could not upload that colour image."); }
    finally { setUploading(false); }
  };

  // ---- type / model variants (each has a label + its own price) ----
  const variants = Array.isArray(form.variants) ? form.variants : [];
  const addVariant = () =>
    setForm((f) => ({ ...f, variants: [...(f.variants || []), { label: "", price: "" }] }));
  const removeVariant = (i) =>
    setForm((f) => ({ ...f, variants: (f.variants || []).filter((_, idx) => idx !== i) }));
  const setVariant = (i, k, val) =>
    setForm((f) => ({ ...f, variants: (f.variants || []).map((v, idx) => (idx === i ? { ...v, [k]: val } : v)) }));

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Fan name is required";
    if (!form.price || Number(form.price) <= 0) er.price = "Enter a valid price";
    if (!form.img) er.img = "Add a photo (upload or pick one)";
    setErrors(er);
    return !Object.keys(er).length;
  };

  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setSaving(true);
    const res = editingId ? await updateProduct(editingId, form) : await addProduct(form);
    setSaving(false);
    if (res && res.ok === false) { setErr(res.error); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    showToast(editingId ? "Fan updated successfully ✅" : `“${form.name}” added ✅`);
    router.push("/admin/inventory");
  };

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <Link href="/admin/inventory" className="back-link"><IconArrowLeft size={15} /> Back to Inventory</Link>
          <h1>{editingId ? "Edit Fan" : "Add a New Fan"}</h1>
          <p>{editingId ? "Update this fan’s details — changes go live on the shop instantly." : "Fill in the details to list a new fan on your shop."}</p>
        </div>
      </header>

      {err && <div className="inv-msg err">{err}</div>}

      <form className="inv-form-inner" onSubmit={submit} style={{ maxWidth: 860 }}>
        <p className="inv-group" style={{ marginTop: 0 }}>Basic details</p>
        <div className="grid grid-2" style={{ gap: 14 }}>
          <div className="field">
            <label>Fan Name *</label>
            <input className="input" value={form.name} onChange={set("name")} placeholder="Sitara Royal Gold" />
            {errors.name && <small className="auth-error">{errors.name}</small>}
          </div>
          <div className="field">
            <label>Tagline</label>
            <input className="input" value={form.tagline} onChange={set("tagline")} placeholder="Luxury look with superior performance." />
          </div>
        </div>

        <div className="grid grid-3" style={{ gap: 14 }}>
          <div className="field">
            <label>Category</label>
            <select className="select" value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Price (Rs) *</label>
            <input className="input" type="number" min="0" value={form.price} onChange={set("price")} placeholder="12500" />
            {errors.price && <small className="auth-error">{errors.price}</small>}
          </div>
          <div className="field">
            <label>Old Price (Rs)</label>
            <input className="input" type="number" min="0" value={form.oldPrice} onChange={set("oldPrice")} placeholder="14000" />
          </div>
        </div>

        <p className="inv-group">Types &amp; prices (optional)</p>
        <p style={{ fontSize: "0.8rem", margin: "-6px 0 10px", color: "var(--muted)" }}>
          Same fan, different types — each with its own price. e.g. <strong>AC/DC</strong> and
          <strong> 30W</strong>. Customers pick a type on the product page and the price updates.
          Leave empty if this fan has a single price.
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {variants.map((v, i) => (
            <div key={i} className="grid grid-2" style={{ gap: 12, alignItems: "end" }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Type name</label>
                <input className="input" value={v.label} onChange={(e) => setVariant(i, "label", e.target.value)} placeholder="e.g. AC/DC or 30W" />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Price (Rs)</label>
                <div className="flex gap-12" style={{ alignItems: "center" }}>
                  <input className="input" type="number" min="0" value={v.price} onChange={(e) => setVariant(i, "price", e.target.value)} placeholder="12500" />
                  <button type="button" className="btn btn-sm inv-del" onClick={() => removeVariant(i)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <div>
            <button type="button" className="btn btn-sm" onClick={addVariant}>+ Add Type</button>
          </div>
        </div>

        <p className="inv-group">Build &amp; quality</p>
        <div className="grid grid-3" style={{ gap: 14 }}>
          <div className="field">
            <label>Colour / Finish</label>
            <input className="input" value={form.color} onChange={set("color")} placeholder="Black &amp; Gold" />
          </div>
          <div className="field">
            <label>Material / Made Of</label>
            <input className="input" value={form.material} onChange={set("material")} placeholder="100% pure copper motor, aluminium blades" />
          </div>
          <div className="field">
            <label>Warranty</label>
            <select className="select" value={form.warranty} onChange={set("warranty")}>
              {WARRANTIES.map((w) => <option key={w}>{w}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-4" style={{ gap: 14 }}>
          <div className="field">
            <label>Sweep Size</label>
            <input className="input" value={form.sweep} onChange={set("sweep")} placeholder='56"' />
          </div>
          <div className="field">
            <label>Speed</label>
            <input className="input" value={form.speed} onChange={set("speed")} placeholder="380 RPM" />
          </div>
          <div className="field">
            <label>Stock Qty</label>
            <input className="input" type="number" min="0" value={form.stock} onChange={set("stock")} placeholder="25" />
          </div>
          <div className="field">
            <label>Rating (1-5)</label>
            <input className="input" type="number" min="1" max="5" step="0.1" value={form.rating} onChange={set("rating")} />
          </div>
        </div>

        <div className="field">
          <label>Badge (optional)</label>
          <input className="input" value={form.badge} onChange={set("badge")} placeholder="Best Seller / New / Premium" />
        </div>

        <p className="inv-group">Photo *</p>
        <div className="inv-image-row">
          <div className="inv-preview">
            {form.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.img} alt="Preview" />
            ) : (
              <span className="inv-preview-empty"><IconPackage size={26} /> No photo yet</span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label className="btn btn-sm" style={{ cursor: uploading ? "wait" : "pointer" }}>
              {uploading ? "Uploading…" : "Upload Photo"}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} disabled={uploading} />
            </label>
            <p style={{ fontSize: "0.78rem", margin: "8px 0 10px" }}>Photos are hosted on Cloudinary &amp; auto-optimised.</p>
            {errors.img && <small className="auth-error">{errors.img}</small>}
          </div>
        </div>

        <p className="inv-group">Colour variants (optional)</p>
        <p style={{ fontSize: "0.8rem", margin: "-6px 0 10px", color: "var(--muted)" }}>
          Add each colour with its own photo. On the product page customers can click a
          colour to see that photo. Leave empty if this fan has a single colour.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {colors.map((c, i) => (
            <div key={i} className="flex gap-12 wrap" style={{ alignItems: "center", border: "1px solid var(--line)", borderRadius: 12, padding: 12 }}>
              <div className="inv-preview" style={{ width: 70, height: 70, flexShrink: 0 }}>
                {c.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.img} alt={c.name || "colour"} />
                ) : (
                  <span className="inv-preview-empty" style={{ fontSize: "0.7rem" }}>No photo</span>
                )}
              </div>
              <div className="field" style={{ flex: 1, minWidth: 160, margin: 0 }}>
                <label>Colour name</label>
                <input className="input" value={c.name} onChange={(e) => setColorName(i, e.target.value)} placeholder="e.g. Antique Gold" />
              </div>
              <label className="btn btn-sm" style={{ cursor: uploading ? "wait" : "pointer" }}>
                {uploading ? "Uploading…" : c.img ? "Change Photo" : "Upload Photo"}
                <input type="file" accept="image/*" hidden disabled={uploading} onChange={(e) => setColorImg(i, e.target.files?.[0])} />
              </label>
              <button type="button" className="btn btn-sm inv-del" onClick={() => removeColor(i)}>Remove</button>
            </div>
          ))}
          <div>
            <button type="button" className="btn btn-sm" onClick={addColor}>+ Add Colour</button>
          </div>
        </div>

        <p className="inv-group">Description</p>
        <div className="field">
          <label>Short summary</label>
          <input className="input" value={form.short} onChange={set("short")} placeholder="Designer fan with golden styling and wood-finish blades." />
        </div>
        <div className="field">
          <label>Full description</label>
          <textarea className="textarea" value={form.description} onChange={set("description")} placeholder="Tell customers what makes this fan special…" />
        </div>

        <div className="flex gap-12 wrap" style={{ marginTop: 8 }}>
          <button className="btn btn-primary" disabled={saving || uploading}>
            {saving ? "Saving…" : uploading ? "Uploading…" : editingId ? "Save Changes" : "Add to Inventory"} <IconArrowRight />
          </button>
          <Link href="/admin/inventory" className="btn">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
