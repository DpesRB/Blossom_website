/*import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import InquiryForm from "@/components/InquiryForm";

export const revalidate = 60;

async function getProduct(slug) {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), categories(name)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const images = product.product_images?.length
    ? product.product_images
    : [{ image_url: "/placeholder.png" }];

  return (
    <div className="page-container">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div>
          <img
            src={images[0].image_url}
            alt={product.name}
            style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
          />
        </div>
        <div>
          <h1>{product.name}</h1>
          {product.categories?.name && (
            <p style={{ color: "#888", marginTop: "0.25rem" }}>
              {product.categories.name}
            </p>
          )}
          <p style={{ margin: "1rem 0", fontSize: "1.3rem" }} className="price">
            Rs. {product.discount_price || product.price}
          </p>
          <p style={{ lineHeight: 1.6, color: "#444" }}>{product.description}</p>

          {product.sizes?.length > 0 && (
            <p style={{ marginTop: "1rem" }}>
              <strong>Sizes:</strong> {product.sizes.join(", ")}
            </p>
          )}
          {product.colors?.length > 0 && (
            <p>
              <strong>Colors:</strong> {product.colors.join(", ")}
            </p>
          )}

          <div style={{ marginTop: "2rem" }}>
            <InquiryForm productId={product.id} productName={product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}*/

import InquiryForm from "@/components/InquiryForm";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

async function getProduct(slug) {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), categories(name)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const images = product.product_images?.length
    ? product.product_images
    : [{ image_url: "/placeholder.png" }];

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="page-container fade-in">
      <div className="product-detail-layout">
        
        <div className="product-gallery">
          <div className="main-image-container">
            <img
              src={images[0].image_url}
              alt={product.name}
              className="main-image"
              style={{ filter: isOutOfStock ? 'grayscale(100%) opacity(0.8)' : 'none' }}
            />
          </div>
          {images.length > 1 && (
            <div className="thumbnail-row">
              {images.map((img, index) => (
                <img 
                  key={index} 
                  src={img.image_url} 
                  alt={`${product.name} view ${index + 1}`} 
                  className="thumbnail-image"
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1>{product.name}</h1>
            <div className="badge-row">
              {product.categories?.name && (
                <span className="category-badge">{product.categories.name}</span>
              )}
              {product.is_featured && (
                <span className="category-badge" style={{ background: '#f5b041', color: '#fff' }}>Featured</span>
              )}
            </div>
          </div>
          
          <p className="product-price">
            Rs. {product.discount_price || product.price}
          </p>
          
          <div className="product-description">
            <p>{product.description}</p>
          </div>

          <div className="product-meta">
            <div className="meta-group">
              <span className="meta-label">Availability:</span> 
              <span className={`meta-value ${isOutOfStock ? 'error-text' : 'success-text'}`}>
                {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
              </span>
            </div>

            {/* Arrays in Supabase are easily mapped if they aren't empty */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="meta-group">
                <span className="meta-label">Sizes:</span> 
                <span className="meta-value">{product.sizes.join(", ")}</span>
              </div>
            )}
            
            {product.colors && product.colors.length > 0 && (
              <div className="meta-group">
                <span className="meta-label">Colors:</span> 
                <span className="meta-value">{product.colors.join(", ")}</span>
              </div>
            )}
          </div>

          <div className="inquiry-section">
            {!isOutOfStock ? (
              <InquiryForm productId={product.id} productName={product.name} />
            ) : (
              <button className="btn-primary" disabled>Currently Unavailable</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
