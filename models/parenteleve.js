'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParentEleve extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ParentEleve.hasMany(models.Eleve)
    }
  }
  ParentEleve.init({
    prenom: DataTypes.STRING,
    nom: DataTypes.STRING,
    sexe: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    telephone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ParentEleve',
  });
  return ParentEleve;
};