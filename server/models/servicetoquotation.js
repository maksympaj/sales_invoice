'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceToQuotation extends Model {
    static associate(models) {
      this.belongsTo(models.Quotation, {
        foreignKey: 'orderId'
      });
    }
  }
  ServiceToQuotation.init(
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
      modelName: 'ServiceToQuotation',
      tableName: 'servicetoquotations',
    }
  );
  return ServiceToQuotation;
};
