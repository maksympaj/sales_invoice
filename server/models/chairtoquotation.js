'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChairToQuotation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChairToQuotation.init(
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
      remark: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'ChairToQuotation',
      tableName: 'chairtoquotations',
    }
  );
  return ChairToQuotation;
};
