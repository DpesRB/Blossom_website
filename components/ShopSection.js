"use client";

import ProductCard from "@/components/ProductCard";
import { useState } from "react";

export default function ShopSection({ initialProducts }) {
  const [sortOption, setSortOption] = useState("newest");

  // Create a sorted copy of the products array without mutating the original
  const sortedProducts = [...initialProducts].sort((a, b) => {
    // Helper to get the active price (discounted or regular)
    const getPrice = (product) => product.discount_price || product.price;

    switch (sortOption) {
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "price-low":
        return getPrice(a) - getPrice(b);
      case "price-high":
        return getPrice(b) - getPrice(a);
      default:
        return 0;
    }
  });

  return (
    <section id="collection" className="collection-section">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: 0 }}>Latest Arrivals</h2>
        
        {/* The Premium Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label htmlFor="sort" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Sort By
          </label>
          <select 
            id="sort" 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="sleek-dropdown"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="oldest">Oldest to Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="empty-state">
          <p style={{ padding: "4rem" }}>Our collection is currently being curated. Check back soon.</p>
        </div>
      ) : (
        <div className="product-grid fade-in">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}