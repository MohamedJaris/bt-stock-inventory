const express = require("express");

const router = express.Router();

const controller = require("../controllers/stockController");

const { requireLogin } = require("../middleware/authMiddleware");

router.get("/category/:categoryId", requireLogin, controller.getStockData);

router.post("/", requireLogin, controller.saveStockEntry);

router.get("/dashboard", requireLogin, controller.getDashboardSummary);

router.get(
    "/history/date",
    controller.getStockHistoryByDate
);
router.get("/history", controller.getStockHistory);

router.get("/current", controller.getCurrentStock);



module.exports = router;