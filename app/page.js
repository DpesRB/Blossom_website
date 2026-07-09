/*import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";

// Revalidate every 60 seconds so new products/edits show up without a redeploy
export const revalidate = 60;

async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <div style={{ padding: "2rem 2rem 0" }}>
        <h1>Shop the Collection</h1>
        <p style={{ color: "#666", marginTop: "0.4rem" }}>
          Handpicked sarees, kurtas, and wedding wear.
        </p>
      </div>

      {products.length === 0 ? (
        <p style={{ padding: "2rem" }}>
          No products yet — add some in your Supabase dashboard.
        </p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}*/



import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

async function getProducts() {
  // Added categories(name) to the fetch and ordered by is_featured
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), categories(name)")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <section className="hero-section">
        <div className="hero-content fade-in">
          <h1>Elegance in Every Thread</h1>
          <p>Discover our handpicked collection of premium sarees, kurtas, and wedding wear crafted for your special moments.</p>
          <a href="#collection" className="btn-primary">Shop the Collection</a>
        </div>
      </section>

      <section id="collection" className="collection-section">
        <div className="section-header">
          <h2>Latest Arrivals</h2>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>Our collection is currently being curated. Check back soon.</p>
          </div>
        ) : (
          <div className="product-grid fade-in">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
