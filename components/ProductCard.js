/*import Link from "next/link";

export default function ProductCard({ product }) {
  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url ||
    "/placeholder.png";

  return (
    <Link href={`/product/${product.slug}`} className="product-card">
      <img src={primaryImage} alt={product.name} loading="lazy" />
      <div className="product-card-info">
        <h3>{product.name}</h3>
        <div>
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
    </Link>
  );
}*/


import Link from "next/link";

export default function ProductCard({ product }) {
  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url ||
    "/placeholder.png";

  const isOutOfStock = product.stock <= 0;

  return (
    <Link 
      href={`/product/${product.slug}`} 
      className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
    >
      <div className="card-image-wrapper">
        <img src={primaryImage} alt={product.name} loading="lazy" className="card-image" />
        {/* New Badges */}
        {product.is_featured && !isOutOfStock && (
          <span className="badge featured-badge">Featured</span>
        )}
        {isOutOfStock && (
          <span className="badge stock-badge">Out of Stock</span>
        )}
      </div>
      
      <div className="product-card-info">
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
    </Link>
  );
}
