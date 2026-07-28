const express = require("express");

const router = express.Router();

const controller = require("../controllers/categoryController");

const { requireLogin } = require("../middleware/authMiddleware");

router.get("/", requireLogin, controller.getAllCategories);

router.post("/", requireLogin, controller.addCategory);

router.delete("/:id", requireLogin, controller.deleteCategory);

module.exports = router;