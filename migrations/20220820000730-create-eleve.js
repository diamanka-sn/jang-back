'use strict';

const { sequelize } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Eleves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        allowNull: false,
        // autoIncrement: true,
        type: Sequelize.INTEGER
      },
      parentEleveId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'ParentEleves',
          key: 'id'
        }
      },
      prenom: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nom: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lieuNaissance: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dateNaissance: {
        allowNull: false,
        type: Sequelize.DATE
      },
      sexe: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      email: {
        allowNull: true,
        unique: true,
        type: Sequelize.STRING
      },
      telephone: {
        allowNull: true,
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
    await queryInterface.dropTable('Eleves');
  }
};