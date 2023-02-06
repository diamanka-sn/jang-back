'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Service.belongsToMany(models.Eleve, {
        through: "Paiement",
        foreignKey: "serviceId",
      })

      models.Service.belongsTo(models.Categorie, {foreignKey: 'categorieId'})
    }
  }
  Service.init({
    libelle: DataTypes.STRING,
    description: DataTypes.STRING,
    cout: DataTypes.INTEGER,
    categorieId: DataTypes.INTEGER,
    status:{
      type:DataTypes.BOOLEAN,
      defaultValue: true
    } 
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};