"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("chairtoshipments", "shipmentId", {
      type: Sequelize.UUID,
      references: {
        model: "shipments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn("chairtoshipments", "stockId", {
      type: Sequelize.UUID,
      references: {
        model: "chairstocks",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("chairtoshipments", "stockId");
    await queryInterface.removeColumn("chairtoshipments", "shipmentId");
  },
};
