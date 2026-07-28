const {
    Product,
    Category,
    ProductSize,
    Size
} = require("../models");

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        categoryId: req.params.categoryId,
      },

      order: [["id", "DESC"]],
    });

    res.json({
      success: true,

      data: products,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to fetch products.",
    });
  }
};

exports.addProduct = async (req, res) => {
  const transaction = await Product.sequelize.transaction();

  try {
    const { categoryId, name, sizes } = req.body;

    if (!categoryId || !name || !sizes || sizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Category, product name and sizes are required.",
      });
    }

    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const existing = await Product.findOne({
      where: {
        categoryId,
        name,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product already exists.",
      });
    }

    const product = await Product.create(
      {
        categoryId,
        name,
      },
      {
        transaction,
      }
    );

    const productSizeRecords = [];

    for (let i = 0; i < sizes.length; i++) {
      let sizeName = sizes[i].trim();

      let size =
    await Size.findOne({

        where: {

            categoryId,
            sizeName

        },

        transaction

    });

      if (!size) {
        const maxDisplayOrder = await Size.max("displayOrder", {

          where: {
              categoryId
          },
      
          transaction
      
      });
      
      size = await Size.create({
      
          categoryId,
      
          sizeName,
      
          displayOrder: (maxDisplayOrder || 0) + 1
      
      }, {
      
          transaction
      
      });
      }

      productSizeRecords.push({
        productId: product.id,

        sizeId: size.id,
      });
    }

    await ProductSize.bulkCreate(
      productSizeRecords,

      {
        transaction,
      }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,

      message: "Product added successfully.",

      data: product,
    });
  } catch (error) {
    await transaction.rollback();

    console.log(error);

    res.status(500).json({
      success: false,

      message: "Something went wrong.",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,

        message: "Product not found.",
      });
    }

    res.json({
      success: true,

      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Something went wrong.",
    });
  }
};
