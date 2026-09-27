import { useEffect, useState } from "react";
import { Search, Package } from "lucide-react";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    (product.product_category_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>Manage your products, pricing and stock levels.</p>
        </div>
      </div>

      <div className="products-toolbar">
        <div className="products-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products by category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="products-table-card">
        <div className="table-heading">
          <div>
            <h2>Product Catalog</h2>
            <span>
              {loading ? "Loading..." : `${filteredProducts.length} products`}
            </span>
          </div>
        </div>

        <div className="products-table">
          <div className="product-row product-row-header">
            <span>PRODUCT ID</span>
            <span>CATEGORY</span>
            <span>WEIGHT</span>
            <span>DIMENSIONS</span>
          </div>

          {loading ? (
            <div className="product-row">
              <span>Loading products...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="product-row">
              <span>No products found.</span>
            </div>
          ) : (
            filteredProducts.slice(0, 100).map((product) => (
              <div className="product-row" key={product.product_id}>
                <div className="product-name">
                  <div className="product-icon">
                    <Package size={18} />
                  </div>
                  <strong>
                    {product.product_id.substring(0, 12)}...
                  </strong>
                </div>

                <span>
                  {product.product_category_name || "Unknown"}
                </span>

                <span>
                  {product.product_weight_g
                    ? `${product.product_weight_g} g`
                    : "N/A"}
                </span>

                <span>
                  {product.product_length_cm &&
                  product.product_height_cm &&
                  product.product_width_cm
                    ? `${product.product_length_cm} × ${product.product_height_cm} × ${product.product_width_cm} cm`
                    : "N/A"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;