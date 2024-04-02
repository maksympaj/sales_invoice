'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'desktoquotations',
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
      'desktoquotations', 
      'stockId', 
      {
        type: Sequelize.UUID,
        references: {
          model: 'deskstocks', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'desktoquotations',
      'quotationId'
    );
    await queryInterface.removeColumn(
      'desktoquotations',
      'stockId'
    );
  }
};
