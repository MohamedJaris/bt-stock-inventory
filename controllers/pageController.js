const path = require("path");

exports.login = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
};

exports.dashboard = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
};

exports.categories = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/categories.html"));
};

exports.products = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/products.html"));
};

exports.stock = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/stock.html"));
};

exports.currentStock = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/current-stock.html"));
};

exports.stockHistory = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/stock-history.html"));
};