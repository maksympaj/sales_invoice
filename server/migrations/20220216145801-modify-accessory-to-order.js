"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("accessorytoorders", "orderId", {
      type: Sequelize.UUID,
      references: {
        model: "salesorders",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn("accessorytoorders", "stockId", {
      type: Sequelize.UUID,
      references: {
        model: "accessorystocks",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("accessorytoorders", "shipmentId", {
      type: Sequelize.UUID,
      references: {
        model: "shipments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("accessorytoorders", "orderId");
    await queryInterface.removeColumn("accessorytoorders", "stockId");
    await queryInterface.removeColumn("accessorytoorders", "shipmentId");
  },
};
