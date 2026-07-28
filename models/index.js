const sequelize = require("../config/database");

const Category = require("./Category");
const Size = require("./Size");
const Product = require("./Product");
const StockEntry = require("./StockEntry");
const StockItem = require("./StockItem");
const ProductSize = require("./ProductSize");
const Admin = require("./Admin");

/* Category -> Size */

Category.hasMany(Size, {
    foreignKey: "categoryId",
    as: "sizes",
    onDelete: "CASCADE"
});

Size.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category"
});


/* Category -> Product */

Category.hasMany(Product, {
    foreignKey: "categoryId",
    as: "products",
    onDelete: "CASCADE"
});

Product.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category"
});


/* Category -> StockEntry */

Category.hasMany(StockEntry, {
    foreignKey: "categoryId",
    as: "stockEntries",
    onDelete: "CASCADE"
});

StockEntry.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category"
});


/* StockEntry -> StockItem */

StockEntry.hasMany(StockItem, {
    foreignKey: "stockEntryId",
    as: "items",
    onDelete: "CASCADE"
});

StockItem.belongsTo(StockEntry, {
    foreignKey: "stockEntryId",
    as: "stockEntry"
});


/* Product -> StockItem */

Product.hasMany(StockItem, {
    foreignKey: "productId",
    as: "stockItems"
});

StockItem.belongsTo(Product, {
    foreignKey: "productId",
    as: "product"
});


/* Size -> StockItem */

Size.hasMany(StockItem, {
    foreignKey: "sizeId",
    as: "stockItems"
});

StockItem.belongsTo(Size, {
    foreignKey: "sizeId",
    as: "size"
});


/* Product -> ProductSize */

Product.hasMany(ProductSize, {
    foreignKey: "productId",
    as: "availableSizes",
    onDelete: "CASCADE"
});

ProductSize.belongsTo(Product, {
    foreignKey: "productId",
    as: "product"
});


/* Size -> ProductSize */

Size.hasMany(ProductSize, {
    foreignKey: "sizeId",
    as: "products",
    onDelete: "CASCADE"
});

ProductSize.belongsTo(Size, {
    foreignKey: "sizeId",
    as: "size"
});


module.exports = {
    sequelize,
    Category,
    Size,
    Product,
    ProductSize,
    StockEntry,
    StockItem,
    Admin
};