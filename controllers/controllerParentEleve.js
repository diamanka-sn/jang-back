var bcrypt = require("bcrypt");
var jwtUtils = require("../utils/jwt.utils");
var models = require("../models");
var asyncLib = require("async");
const fastValidator = require("fastest-validator");
const { sequelize } = require("../models");

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
exports.ajouterParent = async (req, res) => {
    const shema = {
        nom: { optional: false, type: "string", max: "100" },
        prenom: { optional: false, type: "string", max: "100" },
        sexe: { optional: false, type: "boolean" },
        telephone: { optional: false, type: "string", max: "9" },
        email: { optional: false, type: "email", max: "50" },
    };

    const v = new fastValidator();
    const validation = v.validate(req.body, shema);
    if (!validation) {
        return res
            .status(200)
            .json({ error: true, message: "veillez remplir tous les champs" });
    }

    email = req.body.email;
    telephone = req.body.telephone;

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'error': 'Email invalide' });
    }

    const user0 = await models.ParentEleve.findOne({
        where: { email: email },
    });

    if (user0) {
        return res.status(200)
            .json({ err: true, error: "L'email est déja utilisé", errorEmail: true });
    }

    const user = await models.ParentEleve.findOne({
        where: { telephone: telephone },
    });
    if (user) {
        return res.status(200).json({
            err: true,
            error: "Le numero de telephone est déja utilisé",
            errorTelephone: true,
        });
    }

    models.ParentEleve.create(req.body).then((userData) => {
        return res.status(200).json({ err: false, msg: "insertion reussie" });
    }).catch(function (err) {
        return res.status(500).json({
            err: true,
            error: "Impossible d'ajouter le parent d'élève",
        })
    })

}

exports.getAllParrentEleve = (req, res) => {
    models.ParentEleve.findAll({
        include:[models.Eleve],
        attributes: ['id','prenom', 'nom', 'email', 'telephone', 'sexe', [sequelize.fn('count', sequelize.col('Eleves.id')), 'enfant']],
        order: [
            ['nom', 'DESC'],
        ],
        group:['email']
    }).then((parents) => {
        return res.status(200).json(parents)
    })
        .catch(function (err) {
            return res.status(500).json(err);
        })
}

exports.getOneParent = (req, res) => {
    models.ParentEleve.findOne({ where: { id: req.params.id } }).then((parents) => {
        return res.status(200).json(parents)
    })
        .catch(function (err) {
            return res.status(500).json(err);
        })
}

exports.deleteOneParent = (req, res, next) => {
    models.ParentEleve.destroy({ where: { id: req.params.id } })
        .then((deleted) => {
            if (deleted == 1) {
                return res.status(200).json({ 'msg': "suppression reussie" })
            } else {
                return res.status(500).json({ 'msg': "id non trouvé" })
            }
        })
        .catch((err) => {
            return res.status(500).json({ "msg": "echec de la suppression" })
        })
}
exports.searchParent = async (req, res) => {
    let payload = req.body.payload
    let search = await models.ParentEleve.findAll({ telephone: { $regex: new RegExp('^' + payload + '.*', 'i') } })

    search = search.slice(0, 10)

    res.send({ payload: search })
}
exports.updateOneParent = (req, res, next) => {
    models.ParentEleve.update(req.body, { where: { id: req.params.id } })
        .then((updated) => {
            return res.status(200).json({ erreur:false,msg: "modification reussie" })
        })
        .catch((err) => {
            return res.status(500).json({ erreur:false,msg: "Echec de la modification" })
        })
}
