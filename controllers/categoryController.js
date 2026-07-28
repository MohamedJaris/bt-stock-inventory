const { Category } = require("../models");

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [["id", "DESC"]]
        });

        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories."
        });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Category name is required."
            });
        }

        const existing = await Category.findOne({
            where: { name: name.trim() }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Category already exists."
            });
        }

        const category = await Category.create({
            name: name.trim()
        });

        res.status(201).json({
            success: true,
            message: "Category added successfully.",
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        res.json({
            success: true,
            message: "Category deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
};