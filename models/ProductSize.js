const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductSize = sequelize.define("ProductSize", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    sizeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {

    indexes: [

        {
            unique: true,
            fields: ["productId", "sizeId"]
        }

    ]

});

module.exports = ProductSize;