'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeskStock extends Model {
    static associate(models) {      
    }
  }
  DeskStock.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      supplierCode: DataTypes.STRING,
      model: DataTypes.STRING,
      color: DataTypes.STRING,
      armSize: DataTypes.STRING,
      feetSize: DataTypes.STRING,
      beamSize: DataTypes.STRING,
      remark: DataTypes.STRING,
      thumbnailURL: DataTypes.STRING,
      unitPrice: DataTypes.FLOAT,
      isRegistered: DataTypes.BOOLEAN,
      balance: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      shipmentDate: DataTypes.DATEONLY,
      arrivalDate: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: 'DeskStock',
      tableName: 'deskstocks',
    }
  );
  return DeskStock;
};
