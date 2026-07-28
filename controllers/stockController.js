const {
  sequelize,
  Category,
  Product,
  ProductSize,
  Size,
  StockEntry,
  StockItem,
} = require("../models");

exports.getStockData = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Load all products with their assigned sizes
    const products = await Product.findAll({
      where: { categoryId },

      include: [
        {
          model: ProductSize,
          as: "availableSizes",

          attributes: ["sizeId"],

          include: [
            {
              model: Size,
              as: "size",

              attributes: ["id", "sizeName", "displayOrder"],
            },
          ],
        },
      ],

      order: [["name", "ASC"]],
    });

    // Build a unique master size list
    const sizeMap = new Map();

    products.forEach((product) => {
      product.availableSizes.forEach((ps) => {
        if (!sizeMap.has(ps.size.id)) {
          sizeMap.set(ps.size.id, {
            id: ps.size.id,
            sizeName: ps.size.sizeName,
            displayOrder: ps.size.displayOrder,
          });
        }
      });
    });

    const sizes = [...sizeMap.values()].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );

    // Clean API for frontend
    const formattedProducts = products.map((product) => ({
      id: product.id,

      name: product.name,

      sizes: product.availableSizes
        .map((ps) => ({
          id: ps.size.id,
          sizeName: ps.size.sizeName,
          displayOrder: ps.size.displayOrder,
        }))
        .sort((a, b) => a.displayOrder - b.displayOrder),
    }));

    res.json({
      success: true,

      products: formattedProducts,

      sizes,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to load stock data.",
    });
  }
};

exports.saveStockEntry = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { entryDate, categoryId, remarks, items } = req.body;

    const stockEntry = await StockEntry.create(
      {
        entryDate,
        categoryId,
        remarks,
      },
      { transaction }
    );

    for (const item of items) {
      await StockItem.create(
        {
          stockEntryId: stockEntry.id,
          productId: item.productId,
          sizeId: item.sizeId,
          quantity: item.quantity,
        },
        { transaction }
      );
    }

    await transaction.commit();

    res.json({
      success: true,
      message: "Stock saved successfully.",
    });
  } catch (error) {
    await transaction.rollback();

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to save stock.",
    });
  }
};

exports.getStockHistory = async (req, res) => {
  try {
    const history = await StockEntry.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },

        {
          model: StockItem,
          as: "items",

          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name"],
            },

            {
              model: Size,
              as: "size",
              attributes: ["id", "sizeName", "displayOrder"],
            },
          ],
        },
      ],

      order: [
        ["entryDate", "DESC"],
        ["id", "DESC"],
      ],
    });

    res.json({
      success: true,

      data: history,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to load history.",
    });
  }
};
exports.getCurrentStock = async (req, res) => {
  try {
    const stockData = await StockItem.findAll({
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "categoryId"],
        },

        {
          model: Size,
          as: "size",
          attributes: ["id", "sizeName", "displayOrder"],
        },
      ],
    });

    const products = {};
    const sizes = {};

    stockData.forEach((item) => {
      const productId = item.productId;
      const sizeId = item.sizeId;

      // Collect sizes
      sizes[sizeId] = {
        id: sizeId,

        sizeName: item.size.sizeName,

        displayOrder: item.size.displayOrder,
      };

      // Create product row
      if (!products[productId]) {
        products[productId] = {
          id: productId,

          name: item.product.name,

          quantities: {},

          total: 0,
        };
      }

      // Add quantity

      if (!products[productId].quantities[sizeId]) {
        products[productId].quantities[sizeId] = 0;
      }

      products[productId].quantities[sizeId] += Number(item.quantity);

      products[productId].total += Number(item.quantity);
    });

    res.json({
      success: true,

      products: Object.values(products),

      sizes: Object.values(sizes).sort(
        (a, b) => a.displayOrder - b.displayOrder
      ),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to load current stock.",
    });
  }
};
exports.getDashboardSummary = async (req, res) => {
  try {
    const totalCategories = await Category.count();

    const totalProducts = await Product.count();

    const today = new Date().toISOString().split("T")[0];

    const todaysEntries = await StockEntry.count({
      where: {
        entryDate: today,
      },
    });

    const currentStock = await StockItem.sum("quantity");

    res.json({
      success: true,

      data: {
        totalCategories,

        totalProducts,

        todaysEntries,

        currentStock: currentStock || 0,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to load dashboard.",
    });
  }
};

exports.getStockHistoryByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const entries = await StockEntry.findAll({
      where: {
        entryDate: date,
      },

      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },

        {
          model: StockItem,
          as: "items",

          include: [
            {
              model: Product,
              as: "product",

              attributes: ["id", "name"],
            },

            {
              model: Size,
              as: "size",

              attributes: ["id", "sizeName", "displayOrder"],
            },
          ],
        },
      ],
    });

    const categoryMap = {};

    entries.forEach((entry) => {
      const categoryId = entry.category.id;

      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = {
          categoryId,

          categoryName: entry.category.name,

          products: {},
        };
      }

      entry.items.forEach((item) => {
        const productId = item.product.id;

        const sizeName = item.size.sizeName;

        if (!categoryMap[categoryId].products[productId]) {
          categoryMap[categoryId].products[productId] = {
            productId,

            productName: item.product.name,

            sizes: {},
          };
        }

        if (!categoryMap[categoryId].products[productId].sizes[sizeName]) {
          categoryMap[categoryId].products[productId].sizes[sizeName] = 0;
        }

        categoryMap[categoryId].products[productId].sizes[sizeName] += Number(
          item.quantity
        );
      });
    });

    const result = Object.values(categoryMap).map((category) => ({
      categoryName: category.categoryName,

      products: Object.values(category.products),
    }));

    res.json({
      success: true,

      data: result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
