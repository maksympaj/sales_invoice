'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'quotations',
      'sellerId',
      {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'quotations',
      'sellerId'
    );
  }
};
