'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChairStock extends Model {
    static associate(models) {      
    }
  }
  ChairStock.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      brand: DataTypes.STRING,
      model: DataTypes.STRING,
      frameColor: DataTypes.STRING,
      backColor: DataTypes.STRING,
      seatColor: DataTypes.STRING,
      backMaterial: DataTypes.STRING,
      seatMaterial: DataTypes.STRING,
      withHeadrest: DataTypes.BOOLEAN,
      withAdArmrest: DataTypes.BOOLEAN,
      remark: DataTypes.STRING,
      thumbnailURL: DataTypes.STRING,
      unitPrice: DataTypes.FLOAT,
      balance: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      shipmentDate: DataTypes.DATEONLY,
      arrivalDate: DataTypes.DATEONLY,
      isRegistered: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'ChairStock',
      tableName: 'chairstocks',
    }
  );
  return ChairStock;
};
