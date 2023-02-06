'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ParentEleves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      prenom: {
        allowNull:false,
        type: Sequelize.STRING
      },
      nom: {
        allowNull:false,
        type: Sequelize.STRING
      },
      sexe: {
        allowNull:false,
        type: Sequelize.BOOLEAN
      },
      email: {
        allowNull:true,
        unique: true,
        type: Sequelize.STRING
      },
      telephone: {
        unique: true,
        allowNull:true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ParentEleves');
  }
};