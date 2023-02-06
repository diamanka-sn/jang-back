var bcrypt = require("bcrypt");
var jwtUtils = require("../utils/jwt.utils");
var models = require("../models");
var asyncLib = require("async");
const fastValidator = require("fastest-validator");

exports.addCategorie = (req, res, next) => {

    const shema = {
        libelle: { optional: false, type: "string", max: "100" },
    }
    const v = new fastValidator();
    const validation = v.validate(req.body, shema)
    if (validation != true) {
        return res.status(200).json(validation)
    }
    const donnees = req.body
    models.Categorie.findOne({ where: { libelle: donnees.libelle } })
        .then(cat => {
            if (cat) {
                return res.status(200).json({ erreur: true, message: "Categorie existe déjà" })
            }
            models.Categorie.create(donnees)
                .then(() => {
                    return res.status(201).json({ message: "categorie enregistrer avec succés" })
                })
                .catch(err => {
                    return res.status(500).json(err)
                })
        })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })

}
exports.getAllCategorie = (req, res) => {
    models.Categorie.findAll().then(cat => {
        return res.status(200).json(cat)
    }).catch(err => {
        return res.status(500).json({ error: true, message: err })
    })
}
exports.deleteOneCategorie = (req, res, next) => {
    const id = req.params['id']
    models.Categorie.destroy({ where: { id: id } })
        .then(() => {
            return res.status(201).json({ message: "suppression reussi" })
        })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })
}

exports.modifier = (req, res, next) => {
    const donnees = req.body
    models.Categorie.findOne({ where: { libelle: donnees.libelle } })
        .then(categorie => {
            if (categorie) {
                if (categorie.get('id') == req.params.id) {
                    models.Categorie.update(donnees, { where: { id: req.params.id } }).then(m => {
                        return res.status(200).json({ erreur: false, message: "modification reussi" })
                    })
                        .catch(err => {

                            return res.status(500).json({ erreur: true })
                        })
                }
                return res.status(200).json({ erreur: true, message: "Categorie existe déja" })
            }
            models.Categorie.update(donnees, { where: { id: req.params.id } }).then(m => {
                return res.status(200).json({ erreur: false, message: "modification reussi" })
            })
                .catch(err => {

                    return res.status(500).json({ erreur: true })
                })

        })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })
}