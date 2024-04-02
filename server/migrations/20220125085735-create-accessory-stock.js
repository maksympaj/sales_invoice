'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accessorystocks', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      category: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      remark: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      thumbnailURL: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      unitPrice: {
        allowNull: false,
        defaultValue: 1000,
        type: Sequelize.FLOAT,
      },
      isRegistered: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      balance: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      qty: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      shipmentDate: {
        type: Sequelize.DATEONLY,
      },
      arrivalDate: {
        type: Sequelize.DATEONLY,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('accessorystocks');
  },
};
