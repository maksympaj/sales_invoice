'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'servicetoquotations',
      'quotationId',
      {
        type: Sequelize.UUID,
        references: {
          model: 'quotations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'servicetoquotations',
      'quotationId'
    );
  }
};
