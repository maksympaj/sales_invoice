"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("desktoquotations", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      hasDeskTop: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      topMaterial: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.STRING,
      },
      topColor: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.STRING,
      },
      topLength: {
        allowNull: false,
        defaultValue: 800,
        type: Sequelize.FLOAT,
      },
      topWidth: {
        allowNull: false,
        defaultValue: 600,
        type: Sequelize.FLOAT,
      },
      topThickness: {
        allowNull: false,
        defaultValue: 25,
        type: Sequelize.FLOAT,
      },
      topRoundedCorners: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      topCornerRadius: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.FLOAT,
      },
      topHoleCount: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      topHoleType: {
        allowNull: false,
        defaultValue: "Rounded",
        type: Sequelize.STRING,
      },
      topHolePosition: {
        allowNull: false,
        defaultValue: "Left",
        type: Sequelize.STRING,
      },
      topSketchURL: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.STRING,
      },
      unitPrice: {
        allowNull: false,
        defaultValue: 1000,
        type: Sequelize.FLOAT,
      },
      qty: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      deliveryOption: {
        allowNull: false,
        defaultValue: "Delivery Included",
        type: Sequelize.STRING,
      },
      remark: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("desktoquotations");
  },
};
