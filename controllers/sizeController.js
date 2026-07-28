const { Size, Category } = require("../models");

exports.getSizesByCategory = async (req, res) => {
  try {
    const sizes = await Size.findAll({
      where: {
        categoryId: req.params.categoryId,
      },
      order: [["displayOrder", "ASC"]],
    });

    res.json({
      success: true,
      data: sizes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sizes.",
    });
  }
};

exports.addSize = async (req, res) => {
  try {
    const { categoryId, sizeName, displayOrder } = req.body;

    if (!categoryId || !sizeName || !displayOrder) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const existing = await Size.findOne({
      where: {
        categoryId,
        sizeName,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Size already exists for this category.",
      });
    }

    const size = await Size.create({
      categoryId,
      sizeName,
      displayOrder,
    });

    res.status(201).json({
      success: true,
      message: "Size added successfully.",
      data: size,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

exports.deleteSize = async (req, res) => {
  try {
    const deleted = await Size.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Size not found.",
      });
    }

    res.json({
      success: true,
      message: "Size deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};
exports.getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.findAll({
      order: [["displayOrder", "ASC"]],
    });

    res.json({
      success: true,

      data: sizes,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to fetch sizes.",
    });
  }
};
