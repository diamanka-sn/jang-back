var bcrypt = require("bcrypt");
var jwtUtils = require("../utils/jwt.utils");
var models = require("../models");
var asyncLib = require("async");
const fastValidator = require("fastest-validator");
const { sequelize } = require("../models");

exports.getAllDepense = (req, res) => {
    models.Depense.findAll().then(d => {
        return res.status(200).json(d)
    }).catch(err => {
        return res.status(500).json({ erreur: true, message: err })
    })
}

exports.enregistrer = async (req, res) => {
    const shema = {
        libelle: { optional: false, type: "string", max: "100" },
        montant: { optional: true, type: "number", convert: true, min: '0' },

    }
    const v = new fastValidator();
    const validation = v.validate(req.body, shema);
    if (validation !== true) {
        console.log(validation)
        return res.status(400).json(validation);
    }
    models.Depense.create({
        libelle: req.body.libelle,
        montant: req.body.montant,

    })
        .then(() => {
            return res.status(201).json({ erreur: false, message: "Dépenses enregistrer" })
        })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })
}



exports.deleteOneDepense = (req, res) => {
    const id = req.params.id
    models.Depense.destroy({ where: { id: id } })
        .then(() => {
            return res.status(201).json({ message: "suppression reussi" })
        })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })
}

exports.updateOneDepense = (req, res) => {
    const shema = {
        libelle: { optional: false, type: "string", max: "100" },
        montant: { optional: true, type: "number", convert: true, min: '0' }
    }
    const v = new fastValidator();
    const validation = v.validate(req.body, shema);
    if (validation !== true) {
        console.log(validation)
        return res.status(400).json(validation);
    }
    models.Depense.update(req.body, { where: { id: req.params.id } })
        .then(
            (updated) => {
                return res.status(200).json({ erreur: false, msg: "Depense modification reussie" })
            }
        )
        .catch(
            (err) => {
                return res.status(500).json({ erreur: true, msg: "echec de la modification" })
            }
        )
}

exports.ChiffreD = (req, res) => {
    sequelize
        .query(
            `Select * from depenses group by libelle`
        )
        .then((eleves) => {
            return res.status(200).json(eleves)
        })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })
}