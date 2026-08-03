"use client";

import InventoryPanel from "@/components/admin/InventoryPanel";

export default function AdminInventoryPage() {
  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <span className="eyebrow">Catalogue</span>
          <h1>Inventory</h1>
          <p>Add new fans, update details and manage what customers can buy.</p>
        </div>
      </header>

      <InventoryPanel />
    </div>
  );
}
