'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceToOrder extends Model {
    static associate(models) {
      this.belongsTo(models.SalesOrder, {
        foreignKey: 'orderId'
      });
    }
  }
  ServiceToOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      description: DataTypes.STRING,
      price: DataTypes.FLOAT
    },
    {
      sequelize,
      modelName: 'ServiceToOrder',
      tableName: 'servicetoorders',
    }
  );
  return ServiceToOrder;
};
