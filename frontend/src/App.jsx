import { useEffect, useState } from "react";
import "./App.css";

import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  BarChart3,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";

import Dashboard from "./Dashboard";
import Products from "./Products";
import Inventory from "./Inventory";
import Sales from "./Sales";
import Customers from "./Customers";
import Analytics from "./Analytics";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  // Notifications
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Boxes,
    },
    {
      id: "sales",
      label: "Sales",
      icon: ShoppingCart,
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ];

  // Load data for global search + notifications
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const [productsResponse, salesResponse, inventoryResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/products"),
            fetch("http://localhost:5000/api/sales"),
            fetch("http://localhost:5000/api/inventory"),
          ]);

        const productsData = await productsResponse.json();
        const salesData = await salesResponse.json();
        const inventoryData = await inventoryResponse.json();

        setProducts(Array.isArray(productsData) ? productsData : []);

        setSales(
          Array.isArray(salesData?.recentSales)
            ? salesData.recentSales
            : []
        );

        const lowStockProducts = Array.isArray(inventoryData)
          ? inventoryData.filter(
              (product) =>
                Number(product.current_stock) <=
                Number(product.reorder_level)
            )
          : [];

        setLowStockCount(lowStockProducts.length);
      } catch (error) {
        console.error("App data error:", error);
      }
    };

    loadAppData();
  }, []);

  const handlePageChange = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
    setSearchTerm("");
  };

  // Search products
  const matchingProducts = products
    .filter((product) => {
      const search = searchTerm.toLowerCase().trim();

      if (!search) return false;

      return (
        product.product_id?.toLowerCase().includes(search) ||
        product.product_category_name
          ?.toLowerCase()
          .includes(search)
      );
    })
    .slice(0, 5);

  // Search orders
  const matchingSales = sales
    .filter((sale) => {
      const search = searchTerm.toLowerCase().trim();

      if (!search) return false;

      return (
        sale.order_id?.toLowerCase().includes(search) ||
        sale.customer_city?.toLowerCase().includes(search) ||
        sale.product_category
          ?.toLowerCase()
          .includes(search)
      );
    })
    .slice(0, 5);

  const totalSearchResults =
    matchingProducts.length + matchingSales.length;

  return (
    <div className="app">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="brand">
            <div className="logo-icon">S</div>

            <div className="logo-text">
              Smart<span>Stock</span>
            </div>
          </div>

          <button
            className="mobile-close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">MENU</p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-item ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => handlePageChange(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-profile">
            <div className="user-avatar">RK</div>

            <div className="user-info">
              <strong>Ritu Kasaudhan</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <main className="main">
        {/* Top Header */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            {/* SEARCH */}
            <div
              className="topbar-search"
              style={{ position: "relative" }}
            >
              <Search size={18} />

              <input
                type="text"
                placeholder="Search products, orders..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

              {/* SEARCH RESULTS */}
              {searchTerm.trim() && (
                <div
                  style={{
                    position: "absolute",
                    top: "48px",
                    left: 0,
                    width: "100%",
                    minWidth: "320px",
                    background: "#ffffff",
                    border: "1px solid #e1e5ec",
                    borderRadius: "10px",
                    boxShadow:
                      "0 12px 30px rgba(20, 25, 40, 0.12)",
                    zIndex: 2000,
                    overflow: "hidden",
                  }}
                >
                  {totalSearchResults === 0 ? (
                    <div
                      style={{
                        padding: "16px",
                        color: "#8b94a7",
                        fontSize: "12px",
                      }}
                    >
                      No products or orders found.
                    </div>
                  ) : (
                    <>
                      {/* Products */}
                      {matchingProducts.length > 0 && (
                        <div>
                          <div
                            style={{
                              padding: "10px 14px",
                              fontSize: "10px",
                              fontWeight: "700",
                              color: "#6b5de3",
                              letterSpacing: "1px",
                              borderBottom:
                                "1px solid #f0f1f4",
                            }}
                          >
                            PRODUCTS
                          </div>

                          {matchingProducts.map((product) => (
                            <button
                              key={product.product_id}
                              onClick={() => {
                                setActivePage("products");
                                setSearchTerm("");
                              }}
                              style={{
                                width: "100%",
                                display: "block",
                                textAlign: "left",
                                border: 0,
                                background: "#ffffff",
                                padding: "11px 14px",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(event) => {
                                event.currentTarget.style.background =
                                  "#f7f6ff";
                              }}
                              onMouseLeave={(event) => {
                                event.currentTarget.style.background =
                                  "#ffffff";
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#252b3d",
                                }}
                              >
                                {product.product_id}
                              </div>

                              <div
                                style={{
                                  marginTop: "3px",
                                  fontSize: "10px",
                                  color: "#8b94a7",
                                }}
                              >
                                {product.product_category_name ||
                                  "Unknown category"}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Orders */}
                      {matchingSales.length > 0 && (
                        <div>
                          <div
                            style={{
                              padding: "10px 14px",
                              fontSize: "10px",
                              fontWeight: "700",
                              color: "#6b5de3",
                              letterSpacing: "1px",
                              borderTop:
                                "1px solid #f0f1f4",
                              borderBottom:
                                "1px solid #f0f1f4",
                            }}
                          >
                            ORDERS
                          </div>

                          {matchingSales.map((sale) => (
                            <button
                              key={sale.order_id}
                              onClick={() => {
                                setActivePage("sales");
                                setSearchTerm("");
                              }}
                              style={{
                                width: "100%",
                                display: "block",
                                textAlign: "left",
                                border: 0,
                                background: "#ffffff",
                                padding: "11px 14px",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(event) => {
                                event.currentTarget.style.background =
                                  "#f7f6ff";
                              }}
                              onMouseLeave={(event) => {
                                event.currentTarget.style.background =
                                  "#ffffff";
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#252b3d",
                                }}
                              >
                                {sale.order_id}
                              </div>

                              <div
                                style={{
                                  marginTop: "3px",
                                  fontSize: "10px",
                                  color: "#8b94a7",
                                }}
                              >
                                {sale.customer_city ||
                                  "Unknown city"}{" "}
                                ·{" "}
                                {sale.product_category ||
                                  "Unknown category"}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="topbar-right">
            {/* NOTIFICATIONS */}
            <div style={{ position: "relative" }}>
              <button
                className="notification-btn"
                onClick={() =>
                  setNotificationsOpen(
                    !notificationsOpen
                  )
                }
              >
                <Bell size={19} />

                {lowStockCount > 0 && (
                  <span className="notification-dot"></span>
                )}
              </button>

              {/* Notification Panel */}
              {notificationsOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "48px",
                    right: 0,
                    width: "310px",
                    background: "#ffffff",
                    border: "1px solid #e1e5ec",
                    borderRadius: "11px",
                    boxShadow:
                      "0 12px 30px rgba(20, 25, 40, 0.12)",
                    zIndex: 2000,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 16px",
                      borderBottom:
                        "1px solid #edf0f4",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "13px",
                        color: "#252b3d",
                      }}
                    >
                      Notifications
                    </strong>

                    <span
                      style={{
                        fontSize: "10px",
                        color: "#8b94a7",
                      }}
                    >
                      Database alerts
                    </span>
                  </div>

                  {lowStockCount > 0 ? (
                    <button
                      onClick={() => {
                        setActivePage("inventory");
                        setNotificationsOpen(false);
                      }}
                      style={{
                        width: "100%",
                        border: 0,
                        background: "#ffffff",
                        padding: "15px 16px",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.background =
                          "#faf9ff";
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background =
                          "#ffffff";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "11px",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: "#fff4e8",
                            color: "#d97706",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Boxes size={16} />
                        </div>

                        <div>
                          <strong
                            style={{
                              display: "block",
                              fontSize: "11px",
                              color: "#303749",
                              marginBottom: "4px",
                            }}
                          >
                            Inventory needs attention
                          </strong>

                          <span
                            style={{
                              fontSize: "10px",
                              lineHeight: "1.5",
                              color: "#8b94a7",
                            }}
                          >
                            {lowStockCount} products in the
                            loaded inventory data are at or
                            below their reorder level.
                          </span>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div
                      style={{
                        padding: "18px 16px",
                        fontSize: "11px",
                        color: "#8b94a7",
                      }}
                    >
                      No inventory alerts right now.
                    </div>
                  )}

                  <div
                    style={{
                      padding: "10px 16px",
                      borderTop:
                        "1px solid #edf0f4",
                      fontSize: "9px",
                      color: "#a0a7b4",
                    }}
                  >
                    Based on current PostgreSQL data
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="content">
          {activePage === "dashboard" && (
  <Dashboard onNavigate={handlePageChange} />
)}

          {activePage === "products" && <Products />}

          {activePage === "inventory" && <Inventory />}

          {activePage === "sales" && <Sales />}

          {activePage === "customers" && <Customers />}

          {activePage === "analytics" && <Analytics />}
        </div>
      </main>
    </div>
  );
}

export default App;