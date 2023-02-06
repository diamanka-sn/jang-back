'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Eleve extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Eleve.belongsToMany(models.Classe, {
        through: "Inscription",
        foreignKey: "eleveId",
      })
      models.Eleve.belongsTo(models.ParentEleve, {
        foreignKey: {
          allowNull: false,
        },
      })
      models.Eleve.belongsToMany(models.Service, {
        through: "Paiement",
        foreignKey: "eleveId",
      })
    }
  }
  Eleve.init({
    code:DataTypes.INTEGER,
    prenom: DataTypes.STRING,
    nom: DataTypes.STRING,
    sexe: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    telephone: DataTypes.STRING,
    dateNaissance:DataTypes.DATE,
    lieuNaissance:DataTypes.STRING,
    parentEleveId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Eleve',
  });
  return Eleve;
};