"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("desktoshipments", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      client: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.STRING,
      },
      qty: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      orderedQty: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      hasDeskTop: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      topColor: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.STRING,
      },
      topMaterial: {
        allowNull: false,
        defaultValue: "",
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
    await queryInterface.dropTable("desktoshipments");
  },
};
