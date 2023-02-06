var bcrypt = require("bcrypt");
var jwtUtils = require("../utils/jwt.utils");
var models = require("../models");
var asyncLib = require("async");
const fastValidator = require("fastest-validator");
const { sequelize } = require("../models");

exports.enregistrer = async (req, res) => {
    const shema = {
        libelle: { optional: false, type: "string", max: "100" },
        description: { optional: false, type: "string", max: "100" },
        categorie: { optional: false, type: "string", max: "100" },
        cout: { optional: true, type: "number", convert: true, min: '0' },

    }
    const v = new fastValidator();
    const validation = v.validate(req.body, shema);
    if (validation !== true) {
        console.log(validation)
        return res.status(400).json(validation);
    }

    const idu = await models.Categorie.findOne({ where: { libelle: req.body.categorie }, attributes: ["id"] })

    if (idu) {
        models.Service.findOne({
            where: { libelle: req.body.libelle }
        })
            .then(type => {
                if (type) {
                    return res.status(200).json({ erreur: true, message: "Service existe déjà" })
                }
                models.Service.create({
                    libelle: req.body.libelle,
                    description: req.body.description,
                    cout: req.body.cout,
                    categorieId: idu.id
                })
                    .then(() => {
                        return res.status(201).json({ erreur: false, message: "service enregistrer" })
                    })
                    .catch(err => {
                        return res.status(500).json({ error: true, message: err })
                    })

            })
            .catch(err => {
                return res.status(500).json({ error: true, message: err })
            })
    } else {
        models.Categorie.create({ libelle: req.body.categorie }).then(type => {

            models.Service.create({
                libelle: req.body.libelle,
                description: req.body.description,
                cout: req.body.cout,
                categorieId: type.id
            })
                .then(() => {
                    return res.status(201).json({ erreur: false, message: "service enregistrer" })
                })
                .catch(err => {
                    return res.status(500).json({ error: true, message: err })
                })

        })
            .catch(err => {
                return res.status(500).json({ error: true, message: err })
            })

    }

}
exports.changerStatus = (req, res) => {

    const donnees = req.body
    console.log(req.body)
    models.Service.update(donnees, { where: { id: req.params.id } })
        .then(
            (updated) => {
                return res.status(200).json({ erreur: false, msg: "status modifier avec success" })
            }
        )
        .catch(
            (err) => {
                return res.status(500).json({ erreur: true, msg: "echec de la modification" })
            }
        )
}
exports.getAllService = (req, res) => {
    models.Service.findAll({
        include: [models.Categorie]
    }).then(service => {
        return res.status(200).json(service)
    }).catch(err => {
        return res.status(400).json({ error: true, message: err })
    })
}

exports.deleteOneService = (req, res) => {
    const id = req.params.id
    models.Service.destroy({ where: { id: id } })
        .then(() => {
            return res.status(201).json({ message: "suppression reussi" })
        })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })
}

exports.updateOneService = (req, res) => {
    const shema = {
        libelle: { optional: false, type: "string", max: "100" },
        description: { optional: false, type: "string", max: "100" },
        cout: { optional: true, type: "number", convert: true, min: '0' },
    }
    const v = new fastValidator();
    const validation = v.validate(req.body, shema);
    if (validation !== true) {
        console.log(validation)
        return res.status(400).json(validation);
    }
    models.Service.update(req.body, { where: { id: req.params.id } })
        .then(
            (updated) => {
                return res.status(200).json({ erreur: false, msg: "Service modification reussie" })
            }
        )
        .catch(
            (err) => {
                return res.status(500).json({ erreur: true, msg: "echec de la modification" })
            }
        )
}


exports.Chiffre = (req, res) => {
    sequelize
        .query(
            `Select libelle, sum(cout) as cout, count(eleveId) as eleve from services s, paiements p where s.id=p.serviceId group by libelle`
        )
        .then((eleves) => {
            return res.status(200).json(eleves)
        })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })
}