'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'accessorytoquotations',
      'quotationId',
      {
        type: Sequelize.UUID,
        references: {
          model: 'quotations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
    await queryInterface.addColumn(
      'accessorytoquotations', 
      'stockId', 
      {
        type: Sequelize.UUID,
        references: {
          model: 'accessorystocks', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'accessorytoquotations',
      'quotationId'
    );
    await queryInterface.removeColumn(
      'accessorytoquotations',
      'stockId'
    );
  }
};
