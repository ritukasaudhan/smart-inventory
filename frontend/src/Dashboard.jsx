import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  CircleDollarSign,
  MoreHorizontal,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  TrendingUp,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatCategoryName(category) {
  if (!category) return "Unknown";

  const categoryMap = {
    beleza_saude: "Beauty & Health",
    cama_mesa_banho: "Bed, Bath & Home",
    informatica_acessorios: "Computers & Accessories",
    telefonia: "Telephony",
    automotivo: "Automotive",
    esporte_lazer: "Sports & Leisure",
    moveis_decoracao: "Furniture & Decor",
    utilidades_domesticas: "Home Utilities",
    ferramentas_jardim: "Garden & Tools",
    brinquedos: "Toys",
    relogios_presentes: "Watches & Gifts",
    bebes: "Baby Products",
    perfumaria: "Perfume",
    alimentos: "Food",
    bebidas: "Beverages",
    livros: "Books",
    papelaria: "Stationery",
    pet_shop: "Pet Shop",
    consoles_games: "Consoles & Games",
    instrumentos_musicais: "Musical Instruments",
    eletrodomesticos: "Home Appliances",
    eletrodomesticos_2: "Home Appliances",
    moveis_cozinha: "Kitchen Furniture",
    moveis_escritorio: "Office Furniture",
    artigos_de_festas: "Party Supplies",
    construcao_ferramentas: "Construction & Tools",
    fashion_bolsas_e_acessorios: "Fashion & Accessories",
    fashion_calcados: "Fashion Footwear",
    fashion_roupa_masculina: "Men's Fashion",
    fashion_roupa_feminina: "Women's Fashion",
    fashion_roupa_infanto_juvenil: "Kids' Fashion",
    fraldas_higiene: "Diapers & Hygiene",
    casa_conforto: "Home Comfort",
    casa_construcao: "Home Construction",
    casa_utilidades: "Home Utilities",
    industria_comercio_e_negocios: "Industry & Business",
    sinalizacao_e_seguranca: "Security & Signage",
    seguros_e_servicos: "Insurance & Services",
    telefonia_fixa: "Fixed Telephony",
    portateis_casa_forno_e_cafe: "Portable Appliances",
    portateis_cozinha_e_preparadores_de_alimentos:
      "Kitchen Appliances",
  };

  if (categoryMap[category]) {
    return categoryMap[category];
  }

  return category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function Dashboard({ onNavigate }) {
  const [analytics, setAnalytics] = useState(null);
const [sales, setSales] = useState(null);
const [inventory, setInventory] = useState([]);

const [loading, setLoading] = useState(true);

const [dateRange, setDateRange] = useState("All Historical Data");
const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
const [reportsOpen, setReportsOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/analytics").then((res) =>
        res.json()
      ),
      fetch("http://localhost:5000/api/sales").then((res) =>
        res.json()
      ),
      fetch("http://localhost:5000/api/inventory").then((res) =>
        res.json()
      ),
    ])
      .then(([analyticsData, salesData, inventoryData]) => {
        setAnalytics(analyticsData);
        setSales(salesData);
        setInventory(inventoryData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Dashboard data error:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">BUSINESS OVERVIEW</p>

            <h1>Good morning, Ritu 👋</h1>

            <p className="dashboard-description">
              Loading your business data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics || !sales) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">BUSINESS OVERVIEW</p>

            <h1>Good morning, Ritu 👋</h1>

            <p className="dashboard-description">
              Unable to load dashboard data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const summary = analytics.summary || {};

  const allRevenueData = (
  summary.monthlySales ||
  analytics.monthlySales ||
  []
).map((item) => ({
  month: item.month,
  monthDate: item.month_date,
  revenue: Number(item.revenue) || 0,
}));

const getFilteredRevenueData = () => {
  if (dateRange === "All Historical Data") {
    return allRevenueData;
  }

  const monthsToShow =
    dateRange === "Last 12 Months"
      ? 12
      : dateRange === "Last 6 Months"
      ? 6
      : 3;

  return allRevenueData.slice(-monthsToShow);
};

const revenueData = getFilteredRevenueData();

  const categoryData = (
    summary.categories ||
    analytics.categories ||
    []
  )
    .slice(0, 5)
    .map((item) => ({
      category: formatCategoryName(item.category),
      sales: Number(item.revenue) || 0,
    }));

  const transactions = (sales.recentSales || [])
    .slice(0, 5)
    .map((transaction) => ({
      id: transaction.order_id,
      customer: transaction.customer_city || "Unknown",
      product:
        transaction.product_category ||
        transaction.product_category_name ||
        "Unknown",
      amount: `₹${Number(transaction.amount || 0).toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 2,
        }
      )}`,
      status: transaction.order_status || "Unknown",
      date: transaction.order_purchase_timestamp
        ? new Date(
            transaction.order_purchase_timestamp
          ).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        : "N/A",
    }));

  const lowStockProducts = inventory
    .filter(
      (product) =>
        Number(product.current_stock) <=
        Number(product.reorder_level)
    )
    .slice(0, 5)
    .map((product) => ({
      name: product.product_id,
      category: formatCategoryName(
        product.product_category_name
      ),
      stock: Number(product.current_stock),
      reorder: Number(product.reorder_level),
    }));

  const topProducts = (
    summary.topProducts ||
    analytics.topProducts ||
    []
  )
    .slice(0, 5)
    .map((product) => ({
      name: product.product_id,
      category: formatCategoryName(product.category),
      sold: Number(product.units_sold) || 0,
      revenue: Number(product.revenue) || 0,
    }));

  const totalRevenue = Number(
    summary.revenue || sales.summary?.totalSales || 0
  );

  const totalOrders = Number(
    summary.totalOrders ||
      sales.summary?.totalOrders ||
      0
  );

  const totalCustomers = Number(
    summary.totalCustomers || 0
  );

  const averageOrderValue = Number(
    summary.averageOrderValue || 0
  );

  const totalUnitsSold = Number(
    summary.unitsSold || 0
  );

  const lowStockCount = lowStockProducts.length;

  // Calculate performance from actual revenue.
  const maxProductRevenue = Math.max(
    ...topProducts.map((product) => product.revenue),
    0
  );

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">BUSINESS OVERVIEW</p>

          <h1>Good morning, Ritu 👋</h1>

          <p className="dashboard-description">
            Here's an overview of your business data.
          </p>
        </div>

       <div className="dashboard-actions">

  {/* HISTORICAL DATA DROPDOWN */}
  <div
    style={{
      position: "relative",
    }}
  >
    <button
      className="date-filter"
      onClick={() => {
        setDateDropdownOpen(!dateDropdownOpen);
        setReportsOpen(false);
      }}
    >
      {dateRange}
      <ChevronDown size={16} />
    </button>

    {dateDropdownOpen && (
      <div
        style={{
          position: "absolute",
          top: "46px",
          right: 0,
          width: "190px",
          background: "#ffffff",
          border: "1px solid #e1e5ec",
          borderRadius: "10px",
          boxShadow:
            "0 12px 30px rgba(20, 25, 40, 0.12)",
          zIndex: 1000,
          overflow: "hidden",
        }}
      >
        {[
          "All Historical Data",
          "Last 12 Months",
          "Last 6 Months",
          "Last 3 Months",
        ].map((option) => (
          <button
            key={option}
            onClick={() => {
              setDateRange(option);
              setDateDropdownOpen(false);
            }}
            style={{
              width: "100%",
              border: 0,
              background:
                dateRange === option
                  ? "#f5f3ff"
                  : "#ffffff",
              color:
                dateRange === option
                  ? "#6559dc"
                  : "#4f5667",
              padding: "11px 14px",
              textAlign: "left",
              fontSize: "11px",
              fontWeight:
                dateRange === option ? "650" : "500",
              cursor: "pointer",
            }}
          >
            {option}
          </button>
        ))}
      </div>
    )}
  </div>

  {/* REPORTS DROPDOWN */}
  <div
    style={{
      position: "relative",
    }}
  >
    <button
      className="secondary-action"
      onClick={() => {
        setReportsOpen(!reportsOpen);
        setDateDropdownOpen(false);
      }}
    >
      <BarChart3 size={17} />
      Reports
    </button>

    {reportsOpen && (
      <div
        style={{
          position: "absolute",
          top: "46px",
          right: 0,
          width: "180px",
          background: "#ffffff",
          border: "1px solid #e1e5ec",
          borderRadius: "10px",
          boxShadow:
            "0 12px 30px rgba(20, 25, 40, 0.12)",
          zIndex: 1000,
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => {
            onNavigate("sales");
            setReportsOpen(false);
          }}
          style={{
            width: "100%",
            border: 0,
            background: "#ffffff",
            padding: "12px 14px",
            textAlign: "left",
            fontSize: "11px",
            color: "#4f5667",
            cursor: "pointer",
          }}
        >
          Sales Report
        </button>

        <button
          onClick={() => {
            onNavigate("inventory");
            setReportsOpen(false);
          }}
          style={{
            width: "100%",
            border: 0,
            background: "#ffffff",
            padding: "12px 14px",
            textAlign: "left",
            fontSize: "11px",
            color: "#4f5667",
            cursor: "pointer",
          }}
        >
          Inventory Report
        </button>

        <button
          onClick={() => {
            onNavigate("analytics");
            setReportsOpen(false);
          }}
          style={{
            width: "100%",
            border: 0,
            background: "#ffffff",
            padding: "12px 14px",
            textAlign: "left",
            fontSize: "11px",
            color: "#4f5667",
            cursor: "pointer",
          }}
        >
          Analytics Report
        </button>
      </div>
    )}
  </div>

</div>
      </div>

      {/* KPI CARDS */}
      <div className="dashboard-stats">

        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString(
            "en-IN",
            {
              maximumFractionDigits: 0,
            }
          )}`}
          description="From non-canceled orders"
          icon={<CircleDollarSign size={21} />}
        />

        <StatCard
          title="Average Order Value"
          value={`₹${averageOrderValue.toLocaleString(
            "en-IN",
            {
              maximumFractionDigits: 2,
            }
          )}`}
          description="Revenue per order"
          icon={<TrendingUp size={21} />}
        />

        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString("en-IN")}
          description="Orders recorded"
          icon={<ShoppingCart size={21} />}
        />

        <StatCard
          title="Customers"
          value={totalCustomers.toLocaleString("en-IN")}
          description="Customers in database"
          icon={<Users size={21} />}
        />

      </div>

      {/* REVENUE + CATEGORY */}
      <div className="dashboard-main-grid">

        {/* REVENUE */}
        <section className="dashboard-card revenue-card">

          <div className="card-header">

            <div>
              <div className="card-title-row">

                <h2>Revenue Performance</h2>

                <span className="live-indicator">
                  <span></span>
                  PostgreSQL Data
                </span>

              </div>

              <p>
  Monthly revenue from PostgreSQL data · {dateRange}
</p>
            </div>

            <button className="chart-menu">
              <MoreHorizontal size={19} />
            </button>

          </div>

          <div className="chart-summary">

            <div>
              <span className="chart-label">
                Revenue
              </span>

              <strong>
                ₹{(totalRevenue / 10000000).toFixed(2)}Cr
              </strong>
            </div>

            <div>
              <span className="chart-label">
                AOV
              </span>

              <strong>
                ₹{averageOrderValue.toFixed(2)}
              </strong>
            </div>

            <div className="chart-growth">
              <ArrowUpRight size={16} />

              <span>Database</span>
            </div>

          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={revenueData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 0,
                }}
              >

                <defs>
                  <linearGradient
                    id="dashboardRevenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#635bff"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="100%"
                      stopColor="#635bff"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#e9eaf0"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#8a8f9c",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#8a8f9c",
                    fontSize: 12,
                  }}
                  tickFormatter={(value) =>
                    `₹${(value / 1000).toFixed(0)}k`
                  }
                />

                <Tooltip
                  contentStyle={{
                    border: "1px solid #e8e9ef",
                    borderRadius: "10px",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString(
                      "en-IN"
                    )}`,
                    "Revenue",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#635bff"
                  strokeWidth={3}
                  fill="url(#dashboardRevenueGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 3,
                  }}
                />

              </AreaChart>
            </ResponsiveContainer>

          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-dot revenue-dot"></i>
              Revenue
            </span>
          </div>

        </section>

        {/* CATEGORY */}
        <section className="dashboard-card category-performance-card">

          <div className="card-header">

            <div>
              <h2>Sales by Category</h2>

              <p>
                Top performing categories
              </p>
            </div>

            <button className="chart-menu">
              <MoreHorizontal size={19} />
            </button>

          </div>

          <div className="category-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 10,
                  left: 15,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="4 4"
                  horizontal={false}
                  stroke="#e8e9ef"
                />

                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#8a8f9c",
                    fontSize: 11,
                  }}
                  tickFormatter={(value) =>
                    `₹${(value / 1000).toFixed(0)}k`
                  }
                />

                <YAxis
                  type="category"
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#555b68",
                    fontSize: 12,
                  }}
                  width={100}
                />

                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString(
                      "en-IN"
                    )}`,
                    "Sales",
                  ]}
                />

                <Bar
                  dataKey="sales"
                  fill="#635bff"
                  radius={[0, 6, 6, 0]}
                  barSize={19}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

          <div className="category-total">

            <div>
              <span>Total category sales</span>

              <strong>
                ₹{categoryData
                  .reduce(
                    (sum, item) =>
                      sum + Number(item.sales || 0),
                    0
                  )
                  .toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
              </strong>
            </div>

            <span className="positive-badge">
              <ArrowUpRight size={14} />
              Database
            </span>

          </div>

        </section>

      </div>

      {/* TRANSACTIONS + INVENTORY */}
      <div className="dashboard-bottom-grid">

        {/* RECENT TRANSACTIONS */}
        <section className="dashboard-card transactions-card">

          <div className="card-header">

            <div>
              <h2>Recent Transactions</h2>

              <p>Latest sales activity</p>
            </div>

            <button className="view-link">
              View all
              <ArrowUpRight size={15} />
            </button>

          </div>

          <div className="transaction-list">

            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  className="transaction-item"
                  key={transaction.id}
                >

                  <div className="transaction-icon">
                    <ShoppingCart size={17} />
                  </div>

                  <div className="transaction-info">

                    <strong>
                      {formatCategoryName(
                        transaction.product
                      )}
                    </strong>

                    <span>
                      #{transaction.id?.slice(0, 10)} ·{" "}
                      {transaction.customer}
                    </span>

                  </div>

                  <div className="transaction-meta">

                    <strong>
                      {transaction.amount}
                    </strong>

                    <span
                      className={`status ${
                        transaction.status === "delivered"
                          ? "completed"
                          : "pending"
                      }`}
                    >
                      {transaction.status}
                    </span>

                  </div>

                </div>
              ))
            ) : (
              <p>No transactions available.</p>
            )}

          </div>

        </section>

        {/* INVENTORY ALERTS */}
        <section className="dashboard-card inventory-alert-card">

          <div className="card-header">

            <div>
              <div className="card-title-row">

                <h2>Inventory Alerts</h2>

                <span className="alert-count">
                  {lowStockCount}
                </span>

              </div>

              <p>
                Products below reorder level
              </p>
            </div>

            <AlertTriangle
              size={19}
              className="alert-icon"
            />

          </div>

          <div className="alert-list">

            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div
                  className="alert-item"
                  key={product.name}
                >

                  <div className="alert-product-icon">
                    <Package size={17} />
                  </div>

                  <div className="alert-product-info">

                    <strong>
                      {product.name.slice(0, 12)}...
                    </strong>

                    <span>
                      {product.category}
                    </span>

                  </div>

                  <div className="alert-stock">

                    <strong>
                      {product.stock}
                    </strong>

                    <span>
                      / {product.reorder}
                    </span>

                  </div>

                </div>
              ))
            ) : (
              <p>No low-stock products.</p>
            )}

          </div>

          <button className="inventory-action">
            View inventory
            <ArrowUpRight size={15} />
          </button>

        </section>

      </div>

      {/* TOP PRODUCTS */}
      <section className="dashboard-card top-products-card">

        <div className="card-header">

          <div>
            <h2>Top Performing Products</h2>

            <p>
              Products generating the most sales
            </p>
          </div>

          <button className="view-link">
            View products
            <ArrowUpRight size={15} />
          </button>

        </div>

        <div className="top-products-table">

          <div className="top-product-row top-product-header">
            <span>#</span>
            <span>Product</span>
            <span>Units Sold</span>
            <span>Revenue</span>
            <span>Performance</span>
          </div>

          {topProducts.map((product, index) => {

            const performance =
              maxProductRevenue > 0
                ? Math.max(
                    10,
                    (product.revenue /
                      maxProductRevenue) *
                      100
                  )
                : 0;

            return (
              <div
                className="top-product-row"
                key={product.name}
              >

                <span className="product-rank">
                  0{index + 1}
                </span>

                <div className="top-product-name">

                  <div className="top-product-icon">
                    <Package size={17} />
                  </div>

                  <div>

                    <strong>
                      {product.name.slice(0, 14)}...
                    </strong>

                    <small>
                      {product.category}
                    </small>

                  </div>

                </div>

                <span>
                  {product.sold.toLocaleString(
                    "en-IN"
                  )}{" "}
                  units
                </span>

                <strong>
                  ₹{product.revenue.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 0,
                    }
                  )}
                </strong>

                <div className="performance-bar">

                  <span
                    style={{
                      width: `${performance}%`,
                    }}
                  ></span>

                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* BUSINESS INSIGHTS */}
      <section className="insights-section">

        <div className="insight-heading">

          <div>
            <p className="eyebrow">
              SMART INSIGHTS
            </p>

            <h2>Business Insights</h2>
          </div>

          <span>
            Based on current database data
          </span>

        </div>

        <div className="insights-grid">

          <InsightCard
            icon={<TrendingUp size={19} />}
            title="Revenue is available"
            text={`Current recorded revenue is ₹${(
              totalRevenue / 10000000
            ).toFixed(
              2
            )}Cr from the connected PostgreSQL database.`}
          />

          <InsightCard
            icon={<Package size={19} />}
            title="Inventory needs attention"
            text={`${lowStockCount} products are currently at or below their recommended reorder level.`}
          />

          <InsightCard
            icon={<Eye size={19} />}
            title="Category performance"
            text={
              categoryData.length > 0
                ? `${categoryData[0].category} is currently the highest revenue category in the dashboard data.`
                : "Category data is currently unavailable."
            }
          />

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div className="dashboard-stat-card">

      <div className="stat-card-top">

        <span>{title}</span>

        <div className="dashboard-stat-icon">
          {icon}
        </div>

      </div>

      <strong className="dashboard-stat-value">
        {value}
      </strong>

      <div className="dashboard-stat-bottom">

        <span className="stat-positive">
          <ArrowUpRight size={14} />
          Database
        </span>

        <span>{description}</span>

      </div>

    </div>
  );
}

/* =========================================================
   INSIGHT CARD
========================================================= */

function InsightCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="insight-card">

      <div className="insight-icon">
        {icon}
      </div>

      <div>

        <strong>{title}</strong>

        <p>{text}</p>

      </div>

    </div>
  );
}

export default Dashboard;