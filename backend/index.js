const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "SmartStock backend is running",
  });
});

// =====================================================
// TEST DATABASE
// =====================================================

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// =====================================================
// PRODUCTS
// =====================================================

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        product_id,
        product_category_name,
        product_weight_g,
        product_length_cm,
        product_height_cm,
        product_width_cm
      FROM products
      ORDER BY product_id
      LIMIT 50
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});

// =====================================================
// CUSTOMERS
// =====================================================

app.get("/api/customers", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        customer_id,
        customer_unique_id,
        customer_city,
        customer_state
      FROM customers
      ORDER BY customer_id
      LIMIT 100
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching customers:", error);

    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
});

// =====================================================
// INVENTORY
// =====================================================

app.get("/api/inventory", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.product_id,
        p.product_category_name,
        i.current_stock,
        i.reorder_level,
        CASE
          WHEN i.current_stock <= i.reorder_level
            THEN 'Low Stock'
          ELSE 'In Stock'
        END AS status
      FROM products p
      JOIN inventory i
        ON p.product_id = i.product_id
      ORDER BY
        CASE
          WHEN i.current_stock <= i.reorder_level THEN 0
          ELSE 1
        END,
        p.product_id
      LIMIT 100
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching inventory:", error);

    res.status(500).json({
      message: "Failed to fetch inventory",
    });
  }
});

// =====================================================
// SALES
// =====================================================

app.get("/api/sales", async (req, res) => {
  try {
    // Total sales from non-cancelled orders
    const totalSalesResult = await pool.query(`
      SELECT COALESCE(SUM(oi.price + oi.freight_value), 0) AS total_sales
      FROM order_items oi
      JOIN orders o
        ON oi.order_id = o.order_id
      WHERE o.order_status <> 'canceled'
    `);

    // Total orders
    const totalOrdersResult = await pool.query(`
      SELECT COUNT(*) AS total_orders
      FROM orders
    `);

    // Pending orders
    const pendingOrdersResult = await pool.query(`
      SELECT COUNT(*) AS pending_orders
      FROM orders
      WHERE order_status IN ('created', 'approved', 'processing')
    `);

    // Recent sales
    const recentSalesResult = await pool.query(`
      SELECT
        o.order_id,
        p.product_category_name AS product_category,
        c.customer_city,
        ROUND(
          SUM(oi.price + oi.freight_value)::numeric,
          2
        ) AS amount,
        o.order_purchase_timestamp,
        o.order_status
      FROM orders o
      JOIN order_items oi
        ON o.order_id = oi.order_id
      LEFT JOIN products p
        ON oi.product_id = p.product_id
      LEFT JOIN customers c
        ON o.customer_id = c.customer_id
      GROUP BY
        o.order_id,
        p.product_category_name,
        c.customer_city,
        o.order_purchase_timestamp,
        o.order_status
      ORDER BY o.order_purchase_timestamp DESC
      LIMIT 20
    `);

    res.json({
      summary: {
        totalSales: Number(totalSalesResult.rows[0].total_sales),
        totalOrders: Number(totalOrdersResult.rows[0].total_orders),
        pendingOrders: Number(
          pendingOrdersResult.rows[0].pending_orders
        ),
      },
      recentSales: recentSalesResult.rows,
    });
  } catch (error) {
    console.error("Error fetching sales:", error);

    res.status(500).json({
      message: "Failed to fetch sales",
    });
  }
});

// =====================================================
// ANALYTICS
// =====================================================

app.get("/api/analytics", async (req, res) => {
  try {
    // -------------------------------------------------
    // TOTAL REVENUE
    // -------------------------------------------------

    const revenueResult = await pool.query(`
      SELECT
        COALESCE(
          SUM(oi.price + oi.freight_value),
          0
        ) AS revenue
      FROM order_items oi
      JOIN orders o
        ON oi.order_id = o.order_id
      WHERE o.order_status <> 'canceled'
    `);

    // -------------------------------------------------
    // TOTAL ORDERS
    // -------------------------------------------------

    const ordersResult = await pool.query(`
      SELECT COUNT(*) AS total_orders
      FROM orders
    `);

    // -------------------------------------------------
    // TOTAL CUSTOMERS
    // -------------------------------------------------

    const customersResult = await pool.query(`
      SELECT COUNT(*) AS total_customers
      FROM customers
    `);

    // -------------------------------------------------
    // UNITS SOLD
    // -------------------------------------------------

    const unitsSoldResult = await pool.query(`
      SELECT COUNT(*) AS units_sold
      FROM order_items oi
      JOIN orders o
        ON oi.order_id = o.order_id
      WHERE o.order_status <> 'canceled'
    `);

    // -------------------------------------------------
    // AVERAGE ORDER VALUE
    // -------------------------------------------------

    const averageOrderValueResult = await pool.query(`
      SELECT
        COALESCE(
          SUM(oi.price + oi.freight_value)
          / NULLIF(COUNT(DISTINCT o.order_id), 0),
          0
        ) AS average_order_value
      FROM order_items oi
      JOIN orders o
        ON oi.order_id = o.order_id
      WHERE o.order_status <> 'canceled'
    `);

    // -------------------------------------------------
    // MONTHLY SALES
    // -------------------------------------------------

    const monthlySalesResult = await pool.query(`
      SELECT
        TO_CHAR(
          DATE_TRUNC('month', o.order_purchase_timestamp),
          'Mon YYYY'
        ) AS month,
        DATE_TRUNC(
          'month',
          o.order_purchase_timestamp
        ) AS month_date,
        ROUND(
          SUM(oi.price + oi.freight_value)::numeric,
          2
        ) AS revenue
      FROM orders o
      JOIN order_items oi
        ON o.order_id = oi.order_id
      WHERE o.order_status <> 'canceled'
      GROUP BY
        DATE_TRUNC(
          'month',
          o.order_purchase_timestamp
        )
      ORDER BY month_date
    `);

    // -------------------------------------------------
    // TOP PRODUCTS
    // -------------------------------------------------

    const topProductsResult = await pool.query(`
      SELECT
        oi.product_id,
        COALESCE(
          p.product_category_name,
          'Unknown'
        ) AS category,
        COUNT(*) AS units_sold,
        ROUND(
          SUM(oi.price + oi.freight_value)::numeric,
          2
        ) AS revenue
      FROM order_items oi
      JOIN orders o
        ON oi.order_id = o.order_id
      LEFT JOIN products p
        ON oi.product_id = p.product_id
      WHERE o.order_status <> 'canceled'
      GROUP BY
        oi.product_id,
        p.product_category_name
      ORDER BY revenue DESC
      LIMIT 10
    `);

    // -------------------------------------------------
    // CATEGORY SALES
    // -------------------------------------------------

    const categoriesResult = await pool.query(`
      SELECT
        COALESCE(
          p.product_category_name,
          'Unknown'
        ) AS category,
        COUNT(*) AS units_sold,
        ROUND(
          SUM(oi.price + oi.freight_value)::numeric,
          2
        ) AS revenue
      FROM order_items oi
      JOIN orders o
        ON oi.order_id = o.order_id
      LEFT JOIN products p
        ON oi.product_id = p.product_id
      WHERE o.order_status <> 'canceled'
      GROUP BY
        p.product_category_name
      ORDER BY revenue DESC
      LIMIT 10
    `);

    // -------------------------------------------------
    // SEND RESPONSE
    // -------------------------------------------------

    const revenue = Number(
      revenueResult.rows[0].revenue
    );

    const totalOrders = Number(
      ordersResult.rows[0].total_orders
    );

    const totalCustomers = Number(
      customersResult.rows[0].total_customers
    );

    const unitsSold = Number(
      unitsSoldResult.rows[0].units_sold
    );

    const averageOrderValue = Number(
      averageOrderValueResult.rows[0].average_order_value
    );

    res.json({
      summary: {
        revenue: revenue,
        totalOrders: totalOrders,
        totalCustomers: totalCustomers,
        customers: totalCustomers,
        unitsSold: unitsSold,
        averageOrderValue: averageOrderValue,
      },

      monthlySales: monthlySalesResult.rows,

      topProducts: topProductsResult.rows,

      categories: categoriesResult.rows,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);

    res.status(500).json({
      message: "Failed to fetch analytics",
    });
  }
});

// =====================================================
// SERVER
// =====================================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `SmartStock backend running on http://localhost:${PORT}`
  );
});