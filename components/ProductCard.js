import Link from "next/link";

export default function ProductCard({ product }) {
  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url ||
    "/placeholder.png";

  const isOutOfStock = product.stock <= 0;
  
  // Create a short preview of the description for the homepage
  const shortDesc = product.description?.length > 65 
    ? product.description.substring(0, 65) + "..." 
    : product.description;

  return (
    <Link 
      href={`/product/${product.slug}`} 
      className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
    >
      <div className="card-image-wrapper">
        <img src={primaryImage} alt={product.name} loading="lazy" className="card-image" />
        {product.is_featured && !isOutOfStock && (
          <span className="badge featured-badge">Featured</span>
        )}
        {isOutOfStock && (
          <span className="badge stock-badge">Out of Stock</span>
        )}
      </div>
      
      <div className="product-card-info">
        {/* We wrapped Title and Price in a row container */}
        <div className="card-header-row">
          <h3>{product.name}</h3>
          <div className="price-container">
            {product.discount_price ? (
              <>
                <span className="original-price">Rs. {product.price}</span>
                <span className="price">Rs. {product.discount_price}</span>
              </>
            ) : (
              <span className="price">Rs. {product.price}</span>
            )}
          </div>
        </div>
        
        {/* Short description added here */}
        <p className="card-short-desc">{shortDesc}</p>
      </div>
    </Link>
  );
}