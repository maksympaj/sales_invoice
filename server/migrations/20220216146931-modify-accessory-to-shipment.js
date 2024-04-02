"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("accessorytoshipments", "shipmentId", {
      type: Sequelize.UUID,
      references: {
        model: "shipments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn("accessorytoshipments", "stockId", {
      type: Sequelize.UUID,
      references: {
        model: "accessorystocks",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("accessorytoshipments", "stockId");
    await queryInterface.removeColumn("accessorytoshipments", "shipmentId");
  },
};
