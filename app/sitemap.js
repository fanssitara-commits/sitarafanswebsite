const SITE = "https://www.sitarafans.com";

export default function sitemap() {
  const now = new Date();
  const pages = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/products", priority: 0.9, changeFrequency: "daily" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/customer-service", priority: 0.6, changeFrequency: "monthly" },
    { path: "/warranty", priority: 0.6, changeFrequency: "monthly" },
    { path: "/export", priority: 0.6, changeFrequency: "monthly" },
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
