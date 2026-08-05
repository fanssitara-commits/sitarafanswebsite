// Sitara Fans — product catalog (real photos in /public/images/product/)
// If an image is missing, ProductImage falls back to the SVG fan (using `hue`).

export const products = [
  {
    id: "sitara-royal-gold",
    name: "Sitara Royal Gold",
    tagline: "Luxury look with superior performance.",
    category: "Designer",
    price: 12500, oldPrice: 14000, rating: 4.9, badge: "Best Seller", hue: 40,
    img: "/images/product/product-1.jpg",
    sweep: '56"', speed: "360 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Golden Wood", material: "Pure copper motor, wood-grain metal blades",
    stock: 40,
    short: "Designer 5-blade fan with golden Greek-key styling and wood-finish blades.",
    description:
      "A true centerpiece. The Royal Gold combines hand-finished golden detailing with wood-grain blades for a luxurious look — silent, inverter-friendly and built to impress.",
  },
  {
    id: "sitara-imperial-wood",
    name: "Sitara Imperial Wood",
    tagline: "Timeless craftsmanship, powerful airflow.",
    category: "Designer",
    price: 11800, oldPrice: 13200, rating: 4.8, badge: "Premium", hue: 35,
    img: "/images/product/product-2.jpg",
    sweep: '56"', speed: "365 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Natural Wood & Gold", material: "Pure copper motor, wood-finish blades",
    stock: 32,
    short: "Warm natural-wood 5-blade designer fan with gold accents.",
    description:
      "The Imperial Wood brings warmth and elegance to any room with natural wood-grain blades and a gold-detailed hub, backed by a high-efficiency copper motor.",
  },
  {
    id: "sitara-prime-black",
    name: "Sitara Prime Black",
    tagline: "Bold. Elegant. Powerful.",
    category: "Ceiling",
    price: 9800, oldPrice: 11200, rating: 4.9, badge: "Best Seller", hue: 230,
    img: "/images/product/product-3.jpg",
    sweep: '56"', speed: "380 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Matte Black", material: "100% pure copper motor, metal blades",
    stock: 55,
    short: "Premium matte-black 5-blade ceiling fan with high-speed copper motor.",
    description:
      "The Prime Black makes a bold statement in any room. Deep matte-black finish, powerful air throw and whisper-quiet performance from a 100% pure copper motor.",
  },
  {
    id: "sitara-onyx-chrome",
    name: "Sitara Onyx Chrome",
    tagline: "Modern black with a chrome core.",
    category: "Ceiling",
    price: 9500, oldPrice: 10600, rating: 4.7, badge: "", hue: 220,
    img: "/images/product/product-4.jpg",
    sweep: '56"', speed: "385 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Black & Chrome", material: "Pure copper motor, aluminium blades",
    stock: 28,
    short: "Sleek black 5-blade fan with a polished chrome motor housing.",
    description:
      "The Onyx Chrome pairs a bold black blade set with a bright chrome hub for a contemporary look, delivering strong, silent airflow all summer long.",
  },
  {
    id: "sitara-noir-gold",
    name: "Sitara Noir Gold",
    tagline: "Black and gold, made to stand out.",
    category: "Designer",
    price: 10500, oldPrice: 11900, rating: 4.8, badge: "Premium", hue: 45,
    img: "/images/product/product-5.jpg",
    sweep: '56"', speed: "375 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Black & Gold", material: "Pure copper motor, metal blades",
    stock: 36,
    short: "Striking black 5-blade fan with luxurious gold detailing.",
    description:
      "The Noir Gold blends deep black blades with rich gold hardware for a premium, eye-catching finish — powerful, quiet and inverter-friendly.",
  },
  {
    id: "sitara-aero-black",
    name: "Sitara Aero Black",
    tagline: "Minimal 3-blade, maximum air.",
    category: "Ceiling",
    price: 8200, oldPrice: 9100, rating: 4.6, badge: "", hue: 210,
    img: "/images/product/product-6.jpg",
    sweep: '48"', speed: "390 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Bronze Black", material: "Copper motor, aerodynamic metal blades",
    stock: 44,
    short: "Modern 3-blade black fan with an aerodynamic bronze hub.",
    description:
      "The Aero Black's sleek three-blade design cuts through the air efficiently and quietly — a modern, minimal look for bedrooms and lounges.",
  },
  {
    id: "sitara-fusion-black",
    name: "Sitara Fusion Black",
    tagline: "Black body, warm wood accent.",
    category: "Ceiling",
    price: 8500, oldPrice: 9400, rating: 4.6, badge: "New", hue: 25,
    img: "/images/product/product-7.jpg",
    sweep: '48"', speed: "385 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Black & Wood", material: "Copper motor, metal blades, wood-finish hub",
    stock: 30,
    short: "Contemporary 3-blade black fan with a wood-finish centre.",
    description:
      "The Fusion Black mixes a matte-black blade set with a warm wood-tone hub — a fresh, modern statement that suits any interior.",
  },
  {
    id: "sitara-pearl-ivory",
    name: "Sitara Pearl Ivory",
    tagline: "Soft ivory elegance.",
    category: "Ceiling",
    price: 7900, oldPrice: 8800, rating: 4.7, badge: "", hue: 45,
    img: "/images/product/product-8.jpg",
    sweep: '48"', speed: "380 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Ivory & Bronze", material: "Copper motor, metal blades",
    stock: 38,
    short: "Elegant 3-blade ivory fan with a bronze centre.",
    description:
      "The Pearl Ivory offers timeless, understated elegance with soft ivory blades and a bronze hub — quiet, efficient and easy to match with any decor.",
  },
  {
    id: "sitara-matte-black",
    name: "Sitara Matte Black",
    tagline: "Pure minimalist black.",
    category: "Ceiling",
    price: 7800, oldPrice: 8600, rating: 4.6, badge: "", hue: 215,
    img: "/images/product/product-9.jpg",
    sweep: '48"', speed: "390 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Matte Black", material: "Copper motor, metal blades",
    stock: 50,
    short: "Clean all-black 3-blade fan for modern minimal spaces.",
    description:
      "The Matte Black keeps it simple — an all-black three-blade fan with a compact hub, delivering strong airflow with a quiet, modern presence.",
  },
  {
    id: "sitara-antique-wood",
    name: "Sitara Antique Wood",
    tagline: "Warm. Classic. Premium.",
    category: "Designer",
    price: 11500, oldPrice: 12800, rating: 4.8, badge: "Premium", hue: 20,
    img: "/images/product/product-10.jpg",
    sweep: '56"', speed: "365 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Antique Cherry", material: "Pure copper motor, wood-finish blades",
    stock: 26,
    short: "Antique cherry-wood 5-blade fan for a warm, premium space.",
    description:
      "Bring warmth to your room with the Antique Wood's rich cherry-finish blades and bronze hub — a premium classic with silent, efficient performance.",
  },
  {
    id: "sitara-classic-ivory",
    name: "Sitara Classic Ivory",
    tagline: "Timeless. Sophisticated. Reliable.",
    category: "Designer",
    price: 10800, oldPrice: 12000, rating: 4.8, badge: "", hue: 45,
    img: "/images/product/product-11.jpg",
    sweep: '56"', speed: "375 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Ivory & Gold", material: "Pure copper motor, metal blades",
    stock: 34,
    short: "Classic ivory 5-blade designer fan with warm gold trim.",
    description:
      "Elegance that never goes out of style. The Classic Ivory blends a soft ivory body with gold trim, delivering powerful air throw and long-lasting reliability.",
  },
  {
    id: "sitara-storm-black",
    name: "Sitara Storm Black",
    tagline: "Strong airflow, sleek looks.",
    category: "Ceiling",
    price: 8000, oldPrice: 8900, rating: 4.6, badge: "", hue: 210,
    img: "/images/product/product-12.jpg",
    sweep: '48"', speed: "390 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Bronze Black", material: "Copper motor, metal blades",
    stock: 42,
    short: "3-blade black fan with a bronze hub and powerful throw.",
    description:
      "The Storm Black delivers strong, wide airflow from a compact three-blade design — a dependable, good-looking everyday fan.",
  },
  {
    id: "sitara-elegance-ivory",
    name: "Sitara Elegance Ivory",
    tagline: "Designer ivory, gold-finished.",
    category: "Designer",
    price: 11200, oldPrice: 12500, rating: 4.9, badge: "New", hue: 48,
    img: "/images/product/product-13.jpg",
    sweep: '56"', speed: "370 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Ivory & Gold", material: "Pure copper motor, metal blades",
    stock: 24,
    short: "Ornate 5-blade ivory designer fan with gold hardware.",
    description:
      "The Elegance Ivory is a showpiece — soft ivory blades with an intricate gold-finished hub, silent and inverter-friendly for premium interiors.",
  },
  {
    id: "sitara-breeze-ivory",
    name: "Sitara Breeze Ivory",
    tagline: "Light, airy, everyday comfort.",
    category: "Ceiling",
    price: 7600, oldPrice: 8400, rating: 4.6, badge: "", hue: 42,
    img: "/images/product/product-14.jpg",
    sweep: '48"', speed: "385 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Ivory & Wood", material: "Copper motor, metal blades",
    stock: 46,
    short: "Everyday 3-blade ivory fan with a wood-tone centre.",
    description:
      "The Breeze Ivory keeps rooms cool and calm with soft ivory blades and a warm wood hub — energy-efficient and quiet for daily use.",
  },
  {
    id: "sitara-snow-white",
    name: "Sitara Snow White",
    tagline: "Clean, crisp, pure white.",
    category: "Ceiling",
    price: 7200, oldPrice: 8000, rating: 4.7, badge: "Best Seller", hue: 205,
    img: "/images/product/product-15.jpg",
    sweep: '48"', speed: "390 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "Pure White", material: "Copper motor, metal blades",
    stock: 60,
    short: "Crisp all-white 3-blade fan that blends with any ceiling.",
    description:
      "The Snow White is a clean, minimal all-white fan that disappears into any ceiling while delivering strong, energy-efficient airflow.",
  },
  {
    id: "sitara-frost-white",
    name: "Sitara Frost White",
    tagline: "White body, warm wood core.",
    category: "Ceiling",
    price: 7500, oldPrice: 8300, rating: 4.6, badge: "New", hue: 200,
    img: "/images/product/product-16.jpg",
    sweep: '48"', speed: "385 RPM", warranty: "Lifetime Motor", motorWarranty: "Lifetime", kitWarranty: "1 Year",
    color: "White & Wood", material: "Copper motor, metal blades, wood-finish hub",
    stock: 48,
    short: "White 3-blade fan with a warm wood-finish centre.",
    description:
      "The Frost White pairs bright white blades with a warm wood-tone hub — a fresh, modern look that keeps any room cool and comfortable.",
  },
];

export const categories = [
  "All",
  ...Array.from(new Set(products.map((p) => p.category))),
];

export function getProduct(id) {
  return products.find((p) => p.id === id);
}

export function formatPKR(n) {
  return "Rs " + Number(n).toLocaleString("en-PK");
}

/**
 * The type/variant to pick by default (e.g. quick "Add to cart" from a card).
 * Prefers a variant whose label mentions "AC" (i.e. the AC/DC one), else the
 * first variant. Returns null if the product has no variants.
 */
export function defaultVariant(product) {
  const vs = Array.isArray(product?.variants) ? product.variants.filter((v) => v && v.label) : [];
  if (!vs.length) return null;
  return vs.find((v) => /ac/i.test(v.label)) || vs[0];
}
