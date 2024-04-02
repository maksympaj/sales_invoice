"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DeskToOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.SalesOrder, {
        foreignKey: "orderId",
      });
      this.belongsTo(models.DeskStock, {
        foreignKey: "stockId",
      });
      this.belongsTo(models.Shipment, {
        foreignKey: "shipmentId",
      });
    }
  }
  DeskToOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      hasDeskTop: DataTypes.BOOLEAN,
      topMaterial: DataTypes.STRING,
      topColor: DataTypes.STRING,
      topLength: DataTypes.FLOAT,
      topWidth: DataTypes.FLOAT,
      topThickness: DataTypes.FLOAT,
      topRoundedCorners: DataTypes.INTEGER,
      topCornerRadius: DataTypes.FLOAT,
      topHoleCount: DataTypes.INTEGER,
      topHoleType: DataTypes.STRING,
      topHolePosition: DataTypes.STRING,
      topSketchURL: DataTypes.STRING,
      unitPrice: DataTypes.FLOAT,
      qty: DataTypes.INTEGER,
      deliveryOption: DataTypes.STRING,
      preOrder: DataTypes.BOOLEAN,
      preDeliveryDate: DataTypes.DATEONLY,
      estDeliveryDate: DataTypes.DATEONLY,
      from: DataTypes.TIME,
      to: DataTypes.TIME,
      delivered: DataTypes.BOOLEAN,
      akNum: DataTypes.STRING,
      heworkNum: DataTypes.STRING,
      signURL: DataTypes.STRING,
      remark: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "DeskToOrder",
      tableName: "desktoorders",
    }
  );
  return DeskToOrder;
};
