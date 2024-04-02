'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chairstocks', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      brand: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      model: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      frameColor: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      backColor: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      seatColor: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      backMaterial: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      seatMaterial: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      withHeadrest: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      withAdArmrest: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
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
      isRegistered: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('chairstocks');
  },
};
