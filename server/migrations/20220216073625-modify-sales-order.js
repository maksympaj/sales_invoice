'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'salesorders', // name of Source model
      'sellerId', // name of the key we're adding 
      {
        type: Sequelize.UUID,
        references: {
          model: 'users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'salesorders', // name of Source model
      'sellerId' // key we want to remove
    );
  }
};
