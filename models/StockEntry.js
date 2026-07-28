const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StockEntry = sequelize.define("StockEntry", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    entryDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    remarks: {
        type: DataTypes.STRING,
        allowNull: true
    }

});

module.exports = StockEntry;