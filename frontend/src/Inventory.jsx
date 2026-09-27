import { useEffect, useState } from "react";
import {
  Search,
  Package,
  AlertTriangle,
  Boxes,
} from "lucide-react";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/inventory")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch inventory");
        }

        return response.json();
      })
      .then((data) => {
        setInventory(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching inventory:", error);
        setError("Unable to load inventory data.");
        setLoading(false);
      });
  }, []);

  const filteredInventory = inventory.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.product_id?.toLowerCase().includes(searchText) ||
      item.product_category_name?.toLowerCase().includes(searchText)
    );
  });

  const lowStockCount = inventory.filter(
    (item) => item.status === "Low Stock"
  ).length;

  const totalStock = inventory.reduce(
    (total, item) => total + Number(item.current_stock || 0),
    0
  );

  return (
    <div className="inventory-page">

      {/* Header */}
      <div className="products-header">
        <div>
          <h1>Inventory</h1>
          <p>Monitor stock levels and inventory status.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="inventory-summary">

        <div className="card">
          <div className="stat-top">
            <span>Products Loaded</span>

            <div className="stat-icon">
              <Package size={20} />
            </div>
          </div>

          <div className="stat-value">
            {loading ? "..." : inventory.length}
          </div>

          <div className="stat-change">
            <span>From database</span>
          </div>
        </div>

        <div className="card">
          <div className="stat-top">
            <span>Low Stock</span>

            <div className="stat-icon">
              <AlertTriangle size={20} />
            </div>
          </div>

          <div className="stat-value">
            {loading ? "..." : lowStockCount}
          </div>

          <div className="stat-change">
            <span>
              {lowStockCount > 0 ? "Needs attention" : "Stock levels healthy"}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="stat-top">
            <span>Total Units</span>

            <div className="stat-icon">
              <Boxes size={20} />
            </div>
          </div>

          <div className="stat-value">
            {loading ? "..." : totalStock}
          </div>

          <div className="stat-change">
            <span>Current stock tracked</span>
          </div>
        </div>

      </div>

      {/* Stock Overview */}
      <div className="card">

        <div className="card-header">

          <div>
            <h2>Stock Overview</h2>

            <p>
              Current inventory levels from the PostgreSQL database
            </p>
          </div>

          <div className="products-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

        <div className="table-wrapper">

          {loading ? (
            <p style={{ padding: "24px" }}>
              Loading inventory...
            </p>
          ) : error ? (
            <p style={{ padding: "24px" }}>
              {error}
            </p>
          ) : filteredInventory.length === 0 ? (
            <p style={{ padding: "24px" }}>
              No inventory records found.
            </p>
          ) : (

            <table>

              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>STOCK</th>
                  <th>REORDER LEVEL</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {filteredInventory.map((item) => (

                  <tr key={item.product_id}>

                    <td>
                      <div className="table-product">

                        <div className="table-product-icon">
                          <Package size={16} />
                        </div>

                        <strong>
                          {item.product_id.slice(0, 14)}...
                        </strong>

                      </div>
                    </td>

                    <td>
                      {item.product_category_name || "Unknown"}
                    </td>

                    <td>
                      <strong>
                        {item.current_stock} units
                      </strong>
                    </td>

                    <td>
                      {item.reorder_level} units
                    </td>

                    <td>
                      <span
                        className={
                          item.status === "Low Stock"
                            ? "status-badge status-low"
                            : "status-badge status-active"
                        }
                      >
                        {item.status}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}

export default Inventory;