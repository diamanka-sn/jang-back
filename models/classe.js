'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Classe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     models.Classe.belongsToMany(models.Eleve, {
      through: "Inscription",
      foreignKey: "classeId",
     })

    }
  }
  Classe.init({
    nomClasse: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Classe',
  });
  return Classe;
};