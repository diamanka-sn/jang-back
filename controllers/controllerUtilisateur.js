var bcrypt = require("bcrypt");
var jwtUtils = require("../utils/jwt.utils");
var models = require("../models");
var asyncLib = require("async");
const fastValidator = require("fastest-validator");

const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;


exports.inscrire = async (req, res, next) => {
    const shema = {
      nom: { optional: false, type: "string", max: "100" },
      prenom: { optional: false, type: "string", max: "100" },
      adresse: { optional: false, type: "string", max: "100" },
      telephone: { optional: false, type: "string", max: "9" },
      email: { optional: false, type: "email", max: "50" },
      password: { optional: false, type: "string", min: "6" },
      sexe: {optional:false, type: "string", max:"2"}
      //profil: { optional: false, type: 'string', min: '6' }
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
  
    let user = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      sexe: req.body.sexe,
      telephone: req.body.telephone,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      profile: "admin",
      //photo: "test",
    };
  
    const user0 = await models.Utilisateur.findOne({
      where: { email: email },
    });
    if (user0) {
      return res.status(200).json({
        err: true,
        error: "l'adresse email est déja utilisé",
        errorEmail: true,
      });
    }
  
    const user1 = await models.Utilisateur.findOne({
      where: { telephone: telephone },
    });
    if (user1) {
      return res.status(200).json({
        err: true,
        error: "Le numero de telephone est déja utilisé",
        errorTelephone: true,
      });
    }
  
    const utilisateur = await models.Utilisateur.create(user);
    return res.status(200).json({
      err: false,
     
      token: jwtUtils.generateTokenForUser(v),
      message: "inscription reussie",
      iduser: utilisateur.id,
    });
    //   res.status(200).send(utilisateur);
    //   console.log(utilisateur);
  };

exports.login = (req, res) => {
    const shema = {
        email: { optional: false, type: "email" },
        password: { optional: false, type: "string", min: "3" },
    };
    password = req.body.password;
    email = req.body.email;

    const v = new fastValidator();
    const validation = v.validate(req.body, shema);
    if (!validation) {
        return res.status(400).json({ message: "Parametres non saisies" });
    }
    //   const user = await models.Utilisateur.findOne({
    //     where: { login: login },
    //   })

    asyncLib.waterfall(
        [
            function (done) {
                models.Utilisateur.findOne({
                    where: { email: email },
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ error: "Erreur de verification" });
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    bcrypt.compare(
                        password,
                        userFound.password,
                        function (errBycrypt, resBycrypt) {
                            done(null, userFound, resBycrypt);
                        }
                    );
                } else {
                    return res.status(404).json({ error: "login ou mot de passe incorrect" });
                }
            },
            function (userFound, resBycrypt, done) {
                if (resBycrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({ error: "Mot de passe invalides" });
                }
            },
        ],
        function (userFound) {
            if (userFound) {
                return res.status(201).json({
                    userId: userFound.id,
                    utilisateur: userFound,
                    token: jwtUtils.generateTokenForUser(userFound),
                });
            } else {
                return res.status(500).json({ error: "Impossible de connecter l'utilisateur" });
            }
        }
    );
};


exports.modifierMp = (req, res, next) => {
    const donnees = req.body
    const shema = {
        ancien: { optional: false, type: 'string', min: '8' }
    }
    const v = new fastValidator()
    const validation = v.validate(donnees, shema)
    if (validation != true) {
        return res.status(200).json({ error: true, message: 'veillez renseigner tous les champs' })
    }
    models.Utilisateur.findOne({ where: { email: req.params.email } })
        .then(user => {
            if (user) {
                bcrypt.compare(donnees.ancien, user.get('password'))
                    .then(resultat => {
                        if (resultat) {
                            bcrypt.hash(donnees.nouveau, 5, (err, bcryptedMotDePasse) => {
                                models.Utilisateur.update({ password: bcryptedMotDePasse }, { where: { id: user.get('id') } })
                            })
                            return res.status(200).json({ error: false, message: 'mot de passe modifier avec succé' })
                        }
                        return res.status(200).json({ error: true, message: 'le mot de passe est incorrect' })
                    })
                    .catch(err => {
                        return res.status(500).json(err)
                    })
                return

            }
            return res.status(500).json({ error: true, message: 'utilisateur invalide' })
        })
        .catch(err => {
            return res.status(500).json(err)
        })
}


exports.updateUtilisateur = async (req, res) => {
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);
    var id = req.params.id;
    // Params
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var telephone = req.body.telephone;
    var adresse = req.body.adresse;
    var email = req.body.email;
    // var nom = req.body.bio;
    console.log(userId);
    asyncLib.waterfall(
        [
            function (done) {
                models.Utilisateur.findOne({
                    //  attributes: ['id', 'bio'],
                    where: { id: id },
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ error: "unable to verify user" });
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    userFound
                        .update({
                            nom: nom ? nom : userFound.nom,
                            prenom: prenom ? prenom : userFound.prenom,
                            telephone: telephone ? telephone : userFound.telephone,
                            adresse: adresse ? adresse : userFound.adresse,
                            email: email ? email : userFound.email,
                        })
                        .then(function () {
                            done(userFound);
                        })
                        .catch(function (err) {
                            res.status(500).json({ error: "cannot update user" });
                        });
                } else {
                    res.status(404).json({ error: "user not found" });
                }
            },
        ],
        function (userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ error: "cannot update user profile" });
            }
        }
    );
};

exports.deconnexion = (req, res, next) => {
    return res.status(200).json({ err: false, message: 'deconnexion reussi' });

}