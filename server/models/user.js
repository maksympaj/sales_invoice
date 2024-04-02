'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // this.hasMany(models.SalesOrder);
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      avatarURL: DataTypes.STRING,
      password: DataTypes.STRING,
      type: DataTypes.STRING,
      prefix: DataTypes.CHAR(2),
      isActive: DataTypes.BOOLEAN,
      isDeleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      defaultScope: {
        // exclude hash by default
        attributes: { exclude: ['password'] },
      },
      scopes: {
        // include hash with this scope
        withPassword: { attributes: {} },
      },
    }
  );
  return User;
};
