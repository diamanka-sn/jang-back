var bcrypt = require("bcrypt");
var jwtUtils = require("../utils/jwt.utils");
var models = require("../models");
var asyncLib = require("async");
const fastValidator = require("fastest-validator");
const { sequelize } = require("../models");

var annee = new Date().getUTCFullYear();
const anneeScolaire = parseInt(annee) + 1

exports.ajouterEleve = async (req, res) => {
    const shema = {
        nom: { optional: false, type: "string", max: "100" },
        prenom: { optional: false, type: "string", max: "100" },
        lieuNaissance: { optional: false, type: "string", max: "100" },
        classe: { optional: false, type: "string", max: "100" },
        parent: { optional: true, type: "number", convert: true, min: '0' }
    };
    const v = new fastValidator();
    const validation = v.validate(req.body, shema);
    if (validation !== true) {
        return res.status(400).json(validation);
    }
    const parent = await models.ParentEleve.findOne({ where: { telephone: req.body.parent }, attributes: ["id"] })
    const code = await models.Eleve.findOne({ attributes: [[sequelize.fn('max', sequelize.col('code')), 'code']], })
    const classe = await models.Classe.findOne({ where: { nomClasse: req.body.classe }, attributes: ["id"] })

    console.log(code)
    if (parent) {
        const eleve = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            dateNaissance: req.body.dateNaissance,
            lieuNaissance: req.body.lieuNaissance,
            sexe: req.body.sexe,
            telephone: req.body.telephone,
            email: req.body.email,
            ParentEleveId: parent.id,
            code: parseInt(code.code) + 1
        }

        models.Eleve.create(eleve)
            .then((el) => {
                if (el) {
                    if (classe) {
                        models.Inscription.create({
                            eleveId: el.id,
                            classeId: classe.id,
                            annee: parseInt(anneeScolaire)
                        }).then(() => {
                            return res.status(201).json({ errorParent: false, message: "eleve enregistrer" })
                        }).catch(err => {
                            return res.status(500).json({ error: true, message: err })
                        })
                    } else {
                        models.Classe.create({
                            nomClasse: req.body.classe
                        }).then((cl) => {
                            models.Inscription.create({
                                eleveId: el.id,
                                classeId: cl.id,
                                annee: parseInt(anneeScolaire)
                            }).then(() => {
                                return res.status(201).json({ errorParent: false, message: "eleve enregistrer" })
                            }).catch(err => {
                                return res.status(500).json({ error: true, message: err })
                            })
                        })
                    }
                }
            })
            .catch(err => {
                return res.status(500).json({ error: true, message: err })
            })
    } else {
        return res.status(201).json({ errorParent: true, message: "Parent n'existe pas" })
    }

}

exports.ajouterPaiement =  (req, res) => {
    models.Paiement.create(
        req.body)
        .then(() => {
            return res.status(201).json({ erreur: false, message: "paiement enregistrer" })
        })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })
}

exports.getAllEleves = (req, res) => {
    models.Eleve.findAll({
        include: [models.ParentEleve],
        //attributes: ["prenom", "nom", "sexe", "DATE_FORMAT(dateNaissance, '%d-%m-%Y') as dateNaissance" , "lieuNaissance", [sequelize.literal('ParentEleve.nom'), 'nomP'], [sequelize.literal('ParentEleve.prenom'), 'prenomP']]
    }).then((eleves) => {
        return res.status(200).json(eleves)
    })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })
}

exports.getOneEleve = (req, res) => {
    models.Eleve.findOne({ include: [models.ParentEleve], where: { id: req.params.id } }).then((parents) => {
        return res.status(200).json(parents)
    })
        .catch(function (err) {
            return res.status(500).json(err);
        })
}

exports.getParcours = (req, res) => {
    var p = req.params.id
    sequelize
        .query(
            `Select code, prenom, nom,sexe,annee,nomClasse from eleves e, inscriptions i, classes c where e.id=i.eleveId and c.id=i.classeId and e.id='${p}'`
        )
        .then((eleves) => {
            return res.status(200).json(eleves)
        })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })
}

exports.getHistorique = (req, res) => {
    var p = req.params.id
    sequelize
        .query(
            `Select libelle, p.createdAt as date,s.cout, mois from eleves e, paiements p, services s where e.id=p.eleveId and s.id=p.serviceId and e.id='${p}'`
        )
        .then((eleves) => {
            return res.status(200).json(eleves)
        })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })
}


exports.getListeEleveOneParent = (req, res) => {
    var p = req.params.id
    sequelize
        .query(
            `Select code, prenom, nom,sexe,annee,nomClasse from eleves e, inscriptions i, classes c where e.id=i.eleveId and c.id=i.classeId and e.parentEleveId='${p}'`
        )
        .then((eleves) => {
            return res.status(200).json(eleves)
        })
        .catch(err => {
            return res.status(500).json({ error: true, message: err })
        })
}

exports.deleteOneEleve = (req, res, next) => {
    models.Eleve.destroy({ where: { id: req.params.id } })
        .then((deleted) => {
            if (deleted == 1) {
                return res.status(200).json({ 'msg': "suppression reussie" })
            } else {
                return res.status(500).json({ 'msg': "id non trouvé" })
            }
        })
        .catch((err) => {
            return res.status(500).json(err)
        })
}

exports.updateOneEleve = (req, res, next) => {
    models.Eleve.update(req.body, { where: { id: req.params.id } })
        .then((updated) => {
            return res.status(200).json({ erreur: false, msg: "modification reussie" })
        })
        .catch((err) => {
            return res.status(500).json({ erreur: false, msg: "Echec de la modification" })
        })
}

