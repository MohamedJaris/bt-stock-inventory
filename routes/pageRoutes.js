const express = require("express");

const router = express.Router();

const pageController = require("../controllers/pageController");

const { requireLogin } = require("../middleware/authMiddleware");

// Public
router.get("/login", pageController.login);

// Protected
router.get("/dashboard", requireLogin, pageController.dashboard);

router.get("/categories", requireLogin, pageController.categories);

router.get("/products", requireLogin, pageController.products);

router.get("/stock", requireLogin, pageController.stock);

router.get("/current-stock", requireLogin, pageController.currentStock);

router.get("/stock-history", requireLogin, pageController.stockHistory);

module.exports = router;