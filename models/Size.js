const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Size = sequelize.define("Size", {

    id: {

        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true

    },

    categoryId: {

        type: DataTypes.INTEGER,
        allowNull: false

    },

    sizeName: {

        type: DataTypes.STRING,
        allowNull: false

    },

    displayOrder: {

        type: DataTypes.INTEGER,
        allowNull: false

    }

});

module.exports = Size;