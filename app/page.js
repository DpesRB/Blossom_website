/*import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import RealtimeListener from "@/components/RealtimeListener";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0; 

async function getProducts() {
  const { data } = await supabase
    .from("products")
    .select("*, product_images(*), categories(name)")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });
  return data || [];
}

// NEW: Fetch the active slides
async function getSlides() {
  const { data } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function HomePage() {
  // Fetch both products and slides simultaneously for speed
  const [products, slides] = await Promise.all([getProducts(), getSlides()]);

  return (
    <>
      <RealtimeListener /> 
      
      {/* Pass the dynamic slides to the component }
      <HeroCarousel slides={slides} />

      <section id="collection" className="collection-section">
        <div className="section-header">
          <h2>Latest Arrivals</h2>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <p style={{ padding: "4rem" }}>Our collection is currently being curated. Check back soon.</p>
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
}*/


import HeroCarousel from "@/components/HeroCarousel";
import RealtimeListener from "@/components/RealtimeListener";
import ShopSection from "@/components/ShopSection"; // 1. Import the new smart section
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0; 

async function getProducts() {
  const { data } = await supabase
    .from("products")
    .select("*, product_images(*), categories(name)")
    .eq("is_active", true)
    // We remove the strict ordering here so the client component can handle it freely!
    .order("created_at", { ascending: false }); 
  return data || [];
}

async function getSlides() {
  const { data } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function HomePage() {
  const [products, slides] = await Promise.all([getProducts(), getSlides()]);

  return (
    <>
      <RealtimeListener /> 
      <HeroCarousel slides={slides} />
      
      {/* 2. Drop in the new sortable section and pass it the data */}
      <ShopSection initialProducts={products} />
    </>
  );
}