'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesOrder extends Model {
    static associate(models) {
      this.belongsTo(models.User, { as: 'Seller', foreignKey: 'sellerId' });
      this.hasMany(models.ServiceToOrder, {
        foreignKey: 'orderId'
      });
      this.hasMany(models.ChairToOrder, {
        foreignKey: 'orderId'
      });
      this.hasMany(models.DeskToOrder, {
        foreignKey: 'orderId'
      });
      this.hasMany(models.AccessoryToOrder, {
        foreignKey: 'orderId'
      });
      this.belongsToMany(models.ChairStock, {
        through: 'ChairToOrder',
        foreignKey: 'orderId',
        otherKey: 'stockId'
      });
      this.belongsToMany(models.DeskStock, {
        through: 'DeskToOrder',
        foreignKey: 'orderId',
        otherKey: 'stockId',
      });
      this.belongsToMany(models.AccessoryStock, {
        through: 'AccessoryToOrder',
        foreignKey: 'orderId',
        otherKey: 'stockId',
      });
    }
  }
  SalesOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      invoiceNum: DataTypes.INTEGER,
      name: DataTypes.STRING,
      district: DataTypes.STRING,
      street: DataTypes.STRING,
      block: DataTypes.STRING,
      floor: DataTypes.STRING,
      unit: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      timeLine: DataTypes.INTEGER,
      remark: { type: DataTypes.STRING, allowNull: true },
      signURL: DataTypes.STRING,
      paid: DataTypes.BOOLEAN,
      paymentTerms: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      discount: DataTypes.FLOAT,
      discountType: DataTypes.INTEGER,
      surcharge: DataTypes.FLOAT,
      surchargeType: DataTypes.INTEGER,
      finished: DataTypes.BOOLEAN,
      isPreorder: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'SalesOrder',
      tableName: 'salesorders',
    }
  );
  return SalesOrder;
};
