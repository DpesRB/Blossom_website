import InquiryForm from "@/components/InquiryForm";
import { supabase } from "@/lib/supabaseClient";
import { unstable_noStore as noStore } from "next/cache"; // Import cache buster
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

async function getProduct(slug) {
  noStore(); // Obliterate the cache for the individual product view
  
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