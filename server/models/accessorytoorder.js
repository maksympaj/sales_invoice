"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AccessoryToOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.SalesOrder, {
        foreignKey: "orderId",
      });
      this.belongsTo(models.AccessoryStock, {
        foreignKey: "stockId",
      });
      this.belongsTo(models.Shipment, {
        foreignKey: "shipmentId",
      });
    }
  }
  AccessoryToOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      unitPrice: DataTypes.FLOAT,
      qty: DataTypes.INTEGER,
      deliveryOption: DataTypes.STRING,
      preOrder: DataTypes.BOOLEAN,
      preDeliveryDate: DataTypes.DATEONLY,
      estDeliveryDate: DataTypes.DATEONLY,
      from: DataTypes.TIME,
      to: DataTypes.TIME,
      delivered: DataTypes.BOOLEAN,
      poNum: DataTypes.STRING,
      signURL: DataTypes.STRING,
      remark: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "AccessoryToOrder",
      tableName: "accessorytoorders",
    }
  );
  return AccessoryToOrder;
};
