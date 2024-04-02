"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AccessoryToShipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Shipment, {
        foreignKey: "shipmentId",
      });
      this.belongsTo(models.AccessoryStock, {
        foreignKey: "stockId",
      });
    }
  }
  AccessoryToShipment.init(
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
    },
    {
      sequelize,
      modelName: "AccessoryToShipment",
      tableName: "accessorytoshipments",
    }
  );
  return AccessoryToShipment;
};
