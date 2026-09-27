import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Package,
  BarChart3,
} from "lucide-react";
import {
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

function Analytics() {
  const [analytics, setAnalytics] = useState({
    summary: {
      revenue: 0,
      averageOrderValue: 0,
      unitsSold: 0,
    },
    monthlySales: [],
    topProducts: [],
    categories: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        return response.json();
      })
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching analytics:", error);
        setError("Unable to load analytics data.");
        setLoading(false);
      });
  }, []);

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatCompactCurrency = (value) => {
    const number = Number(value || 0);

    if (number >= 10000000) {
      return `₹${(number / 10000000).toFixed(1)}Cr`;
    }

    if (number >= 100000) {
      return `₹${(number / 100000).toFixed(1)}L`;
    }

    if (number >= 1000) {
      return `₹${(number / 1000).toFixed(1)}K`;
    }

    return `₹${number.toFixed(0)}`;
  };

  const chartData = analytics.monthlySales.map((item) => ({
    month: item.month,
    revenue: Number(item.revenue) || 0,
  }));

  return (
    <div className="analytics-page">

      {/* Header */}
      <div className="products-header">
        <div>
          <h1>Analytics</h1>
          <p>
            Understand your business performance through data.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card">
          <p style={{ padding: "10px" }}>{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="inventory-summary">

        <div className="card">

          <div className="stat-top">
            <span>Revenue</span>

            <div className="stat-icon">
              <DollarSign size={20} />
            </div>
          </div>

          <div className="stat-value">
            {loading
              ? "..."
              : formatCompactCurrency(
                  analytics.summary.revenue
                )}
          </div>

          <div className="stat-change">
            <span>From non-canceled orders</span>
          </div>

        </div>

        <div className="card">

          <div className="stat-top">
            <span>Average Order Value</span>

            <div className="stat-icon">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="stat-value">
            {loading
              ? "..."
              : formatCurrency(
                  analytics.summary.averageOrderValue
                )}
          </div>

          <div className="stat-change">
            <span>Revenue per order</span>
          </div>

        </div>

        <div className="card">

          <div className="stat-top">
            <span>Units Sold</span>

            <div className="stat-icon">
              <Package size={20} />
            </div>
          </div>

          <div className="stat-value">
            {loading
              ? "..."
              : Number(
                  analytics.summary.unitsSold || 0
                ).toLocaleString("en-IN")}
          </div>

          <div className="stat-change">
            <span>Non-canceled orders</span>
          </div>

        </div>

      </div>

      {/* Charts and Top Products */}
      <div className="analytics-grid">

        {/* Monthly Sales */}
        <div className="card">

          <div className="card-header">

            <div>
              <h2>Monthly Sales</h2>

              <p>
                Revenue performance over time
              </p>
            </div>

            <BarChart3 size={20} />

          </div>

          <div
            style={{
              width: "100%",
              height: "320px",
              marginTop: "20px",
            }}
          >
            {loading ? (
              <p style={{ padding: "24px" }}>
                Loading chart...
              </p>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={chartData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    tickFormatter={(value) =>
                      formatCompactCurrency(value)
                    }
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(value),
                      "Revenue",
                    ]}
                  />

                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>

        {/* Top Products */}
        <div className="card">

          <div className="card-header">

            <div>
              <h2>Top Products</h2>

              <p>
                Highest revenue contributors
              </p>
            </div>

          </div>

          <div className="analytics-list">

            {loading ? (
              <p style={{ padding: "24px" }}>
                Loading products...
              </p>
            ) : (
              analytics.topProducts.map(
                (product, index) => (
                  <div
                    className="analytics-list-item"
                    key={product.product_id}
                  >

                    <div className="analytics-rank">
                      {index + 1}
                    </div>

                    <div className="analytics-product-info">

                      <strong>
                        {product.product_id.slice(
                          0,
                          12
                        )}
                        ...
                      </strong>

                      <span>
                        {formatCategoryName(
                          product.category
                        )}
                      </span>

                    </div>

                    <div className="analytics-product-value">

                      <strong>
                        {formatCompactCurrency(
                          product.revenue
                        )}
                      </strong>

                      <span>
                        {Number(
                          product.units_sold || 0
                        ).toLocaleString("en-IN")}{" "}
                        units
                      </span>

                    </div>

                  </div>
                )
              )
            )}

          </div>

        </div>

      </div>

      {/* Category Performance */}
      <div className="card">

        <div className="card-header">

          <div>
            <h2>Category Performance</h2>

            <p>
              Revenue and units sold by product
              category
            </p>
          </div>

        </div>

        <div className="table-wrapper">

          {loading ? (
            <p style={{ padding: "24px" }}>
              Loading category data...
            </p>
          ) : (

            <table>

              <thead>
                <tr>
                  <th>CATEGORY</th>
                  <th>UNITS SOLD</th>
                  <th>REVENUE</th>
                </tr>
              </thead>

              <tbody>

                {analytics.categories.map(
                  (category) => (
                    <tr
                      key={category.category}
                    >

                      <td>
                        <strong>
                          {formatCategoryName(
                            category.category
                          )}
                        </strong>
                      </td>

                      <td>
                        {Number(
                          category.units_sold || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        <strong>
                          {formatCurrency(
                            category.revenue
                          )}
                        </strong>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}

export default Analytics;