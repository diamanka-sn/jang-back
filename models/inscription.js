'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     models.Inscription.belongsTo(models.Eleve,{ foreignKey: 'eleveId' })
     models.Inscription.belongsTo(models.Classe,{ foreignKey: 'classeId' })
    }
  }
  Inscription.init({
    annee: DataTypes.INTEGER,
    eleveId: DataTypes.INTEGER,
    classeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Inscription',
  });
  return Inscription;
};