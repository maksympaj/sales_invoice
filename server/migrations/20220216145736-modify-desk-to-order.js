"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("desktoorders", "orderId", {
      type: Sequelize.UUID,
      references: {
        model: "salesorders",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn("desktoorders", "stockId", {
      type: Sequelize.UUID,
      references: {
        model: "deskstocks",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("desktoorders", "shipmentId", {
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
    await queryInterface.removeColumn("desktoorders", "orderId");
    await queryInterface.removeColumn("desktoorders", "stockId");
    await queryInterface.removeColumn("desktoorders", "shipmentId");
  },
};
