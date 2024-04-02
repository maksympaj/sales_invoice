'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accessorytoorders', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      unitPrice: {
        allowNull: false,
        defaultValue: 1000,
        type: Sequelize.FLOAT,
      },
      qty: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      deliveryOption: {
        allowNull: false,
        defaultValue: 'Delivery Included',
        type: Sequelize.STRING,
      },
      preOrder: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      preDeliveryDate: {
        type: Sequelize.DATEONLY,
      },
      estDeliveryDate: {
        type: Sequelize.DATEONLY,
      },
      from: {
        type: Sequelize.TIME,
      },
      to: {
        type: Sequelize.TIME,
      },
      delivered: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      poNum: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.STRING,
      },
      signURL: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      remark: {
        allowNull: true,
        defaultValue: '',
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('accessorytoorders');
  },
};
