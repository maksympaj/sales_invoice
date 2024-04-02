'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'servicetoorders',
      'orderId',
      {
        type: Sequelize.UUID,
        references: {
          model: 'salesorders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'servicetoorders',
      'orderId'
    );
  }
};
