"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChairToShipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Shipment, {
        foreignKey: "shipmentId",
      });
      this.belongsTo(models.ChairStock, {
        foreignKey: "stockId",
      });
    }
  }
  ChairToShipment.init(
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
      modelName: "ChairToShipment",
      tableName: "chairtoshipments",
    }
  );
  return ChairToShipment;
};
