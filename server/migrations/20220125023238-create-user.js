'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      email: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
        unique: true,
      },
      firstName: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      avatarURL: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      prefix: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.CHAR(2),
      },
      isActive: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      isDeleted: {
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('users');
  },
};
