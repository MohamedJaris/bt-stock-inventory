const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();

const db = require("./models");
const createDefaultAdmin = require("./utils/createAdmin");

const { requireLogin } = require("./middleware/authMiddleware");

// ======================================
// Session Store
// ======================================

const sessionStore = new SequelizeStore({
  db: db.sequelize,
});

app.use(
  session({
    secret: "textile-stock-management-secret",

    resave: false,

    saveUninitialized: false,

    store: sessionStore,

    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ======================================
// Middleware
// ======================================

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// ======================================
// Static Files (No automatic index.html)
// ======================================

app.use(
  express.static(path.join(__dirname, "public"), {
    index: false,
  })
);

// ======================================
// Protected Pages
// ======================================

app.get("/", (req, res) => {
  if (req.session.user) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }

  return res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/index.html", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/categories.html", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "categories.html"));
});

app.get("/products.html", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "products.html"));
});

app.get("/stock.html", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "stock.html"));
});

app.get("/current-stock.html", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "current-stock.html"));
});

app.get("/stock-history.html", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "stock-history.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ======================================
// API Routes
// ======================================

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const stockRoutes = require("./routes/stockRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);

// ======================================
// Database Initialization
// ======================================

async function startServer() {
  try {
    await db.sequelize.sync();

    await sessionStore.sync();

    await createDefaultAdmin();

    console.log("✅ Database Connected");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log("--------------------------------");
      console.log("🚀 Textile Stock Management Started");
      console.log(`🌐 http://localhost:${PORT}`);
      console.log("--------------------------------");
    });
  } catch (err) {
    console.error("❌ Failed to start application");

    console.error(err);
  }
}

startServer();
