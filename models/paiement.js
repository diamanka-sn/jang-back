'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Paiement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Paiement.belongsTo(models.Eleve,{ foreignKey: 'eleveId' })
      models.Paiement.belongsTo(models.Service,{ foreignKey: 'serviceId' })
    }
  }
  Paiement.init({
    mois: DataTypes.INTEGER,
    serviceId: DataTypes.INTEGER,
    eleveId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Paiement',
  });
  return Paiement;
};