'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quotation extends Model {
    static associate(models) {
      this.belongsTo(models.User, { as: 'Seller', foreignKey: 'sellerId' });
      this.hasMany(models.ServiceToQuotation, {
        foreignKey: 'quotationId'
      });
      this.hasMany(models.DeskToQuotation, {
        foreignKey: 'quotationId'
      });
      this.belongsToMany(models.ChairStock, {
        through: 'ChairToQuotation',
        foreignKey: 'quotationId',
        otherKey: 'stockId',
      });
      this.belongsToMany(models.DeskStock, {
        through: 'DeskToQuotation',
        foreignKey: 'quotationId',
        otherKey: 'stockId',
      });
      this.belongsToMany(models.AccessoryStock, {
        through: 'AccessoryToQuotation',
        foreignKey: 'quotationId',
        otherKey: 'stockId',
      });
    }
  }
  Quotation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      quotationNum: DataTypes.INTEGER,
      name: DataTypes.STRING,
      district: DataTypes.STRING,
      street: DataTypes.STRING,
      block: DataTypes.STRING,
      floor: DataTypes.STRING,
      unit: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      timeLine: DataTypes.INTEGER,
      remark: DataTypes.STRING,
      paymentTerms: DataTypes.STRING,
      validTil: DataTypes.INTEGER,
      discount: DataTypes.FLOAT,
      discountType: DataTypes.INTEGER,
      surcharge: DataTypes.FLOAT,
      surchargeType: DataTypes.INTEGER,
      finished: DataTypes.BOOLEAN,
      isPreorder: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Quotation',
      tableName: 'quotations',
    }
  );
  return Quotation;
};
