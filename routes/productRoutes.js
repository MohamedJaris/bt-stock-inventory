const express = require("express");

const router = express.Router();

const controller = require("../controllers/productController");
const { requireLogin } = require("../middleware/authMiddleware");

router.get("/category/:categoryId", requireLogin, controller.getProductsByCategory);

router.post("/", requireLogin, controller.addProduct);

router.delete("/:id", requireLogin, controller.deleteProduct);

module.exports = router;
