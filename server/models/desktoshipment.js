"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DeskToShipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Shipment, {
        foreignKey: "shipmentId",
      });
      this.belongsTo(models.DeskStock, {
        foreignKey: "stockId",
      });
    }
  }
  DeskToShipment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      client: DataTypes.STRING,
      qty: DataTypes.INTEGER,
      orderedQty: DataTypes.INTEGER,
      hasDeskTop: DataTypes.BOOLEAN,
      topColor: DataTypes.STRING,
      topMaterial: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DeskToShipment",
      tableName: "desktoshipments",
    }
  );
  return DeskToShipment;
};
