"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shipment extends Model {
    static associate(models) {
      
    }
  }
  Shipment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      poNum: DataTypes.INTEGER,
      itemType: DataTypes.STRING,
      stockId: DataTypes.STRING,
      qty: DataTypes.INTEGER,
      orderQty: DataTypes.INTEGER,
      finishDate: DataTypes.DATEONLY,
      location: DataTypes.STRING,
      supplier: DataTypes.STRING,
      beam: DataTypes.STRING,
      akNum: DataTypes.STRING,
      heworkNum: DataTypes.STRING,
      remark: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Shipment",
      tableName: "shipments",
    }
  );
  return Shipment;
};
