import { useEffect, useState } from "react";
import {
  Search,
  DollarSign,
  ShoppingCart,
  Clock,
  Package,
} from "lucide-react";

function Sales() {
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/sales")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch sales");
        }

        return response.json();
      })
      .then((data) => {
        setSummary(data.summary);
        setSales(data.recentSales);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sales:", error);
        setError("Unable to load sales data.");
        setLoading(false);
      });
  }, []);

  const filteredSales = sales.filter((sale) => {
    const searchText = search.toLowerCase();

    return (
      sale.order_id?.toLowerCase().includes(searchText) ||
      sale.product_category?.toLowerCase().includes(searchText) ||
      sale.customer_city?.toLowerCase().includes(searchText) ||
      sale.order_status?.toLowerCase().includes(searchText)
    );
  });

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusClass = (status) => {
    if (status === "delivered") {
      return "status-badge status-active";
    }

    if (status === "canceled") {
      return "status-badge status-low";
    }

    return "status-badge";
  };

  return (
    <div className="sales-page">

      {/* Header */}
      <div className="products-header">
        <div>
          <h1>Sales</h1>
          <p>Track orders, transactions and sales activity.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="inventory-summary">

        <div className="card">
          <div className="stat-top">
            <span>Total Sales</span>

            <div className="stat-icon">
              <DollarSign size={20} />
            </div>
          </div>

          <div className="stat-value">
            {loading ? "..." : formatCurrency(summary.totalSales)}
          </div>

          <div className="stat-change">
            <span>From database</span>
          </div>
        </div>

        <div className="card">
          <div className="stat-top">
            <span>Total Orders</span>

            <div className="stat-icon">
              <ShoppingCart size={20} />
            </div>
          </div>

          <div className="stat-value">
            {loading ? "..." : summary.totalOrders.toLocaleString("en-IN")}
          </div>

          <div className="stat-change">
            <span>Orders recorded</span>
          </div>
        </div>

        <div className="card">
          <div className="stat-top">
            <span>Pending Orders</span>

            <div className="stat-icon">
              <Clock size={20} />
            </div>
          </div>

          <div className="stat-value">
            {loading ? "..." : summary.pendingOrders}
          </div>

          <div className="stat-change">
            <span>
              {summary.pendingOrders > 0
                ? "Requires attention"
                : "No pending orders"}
            </span>
          </div>
        </div>

      </div>

      {/* Recent Sales */}
      <div className="card">

        <div className="card-header">

          <div>
            <h2>Recent Sales</h2>

            <p>
              Latest customer transactions from the PostgreSQL database
            </p>
          </div>

          <div className="products-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

        <div className="table-wrapper">

          {loading ? (
            <p style={{ padding: "24px" }}>
              Loading sales...
            </p>
          ) : error ? (
            <p style={{ padding: "24px" }}>
              {error}
            </p>
          ) : filteredSales.length === 0 ? (
            <p style={{ padding: "24px" }}>
              No sales found.
            </p>
          ) : (

            <table>

              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>PRODUCT / CATEGORY</th>
                  <th>CUSTOMER</th>
                  <th>AMOUNT</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {filteredSales.map((sale) => (

                  <tr key={sale.order_id}>

                    <td>
                      <strong>
                        #{sale.order_id.slice(0, 10)}...
                      </strong>
                    </td>

                    <td>
                      <div className="table-product">

                        <div className="table-product-icon">
                          <Package size={16} />
                        </div>

                        <span>
                          {sale.product_category || "Unknown"}
                        </span>

                      </div>
                    </td>

                    <td>
                      {sale.customer_city || "Unknown"}
                    </td>

                    <td>
                      <strong>
                        {formatCurrency(sale.amount)}
                      </strong>
                    </td>

                    <td>
                      {formatDate(sale.order_purchase_timestamp)}
                    </td>

                    <td>
                      <span className={getStatusClass(sale.order_status)}>
                        {sale.order_status}
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

export default Sales;