import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { InventoryProvider } from "@/context/InventoryContext";
import SiteChrome from "@/components/SiteChrome";

export const metadata = {
  metadataBase: new URL("https://www.sitarafans.com"),
  title: "Sitara Fans — Comfort That Lasts, Elegance That Stays",
  description:
    "Sitara Fans — premium ceiling, pedestal, designer and rechargeable fans. Pure copper motors, real warranties, elegant designs. Sitara Comfort For Every Home.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.sitarafans.com",
    siteName: "Sitara Fans",
    title: "Sitara Fans — Comfort That Lasts, Elegance That Stays",
    description:
      "Sitara Fans — premium ceiling, pedestal, designer and rechargeable fans. Pure copper motors, real warranties, elegant designs.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <InventoryProvider>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </InventoryProvider>
      </body>
    </html>
  );
}
