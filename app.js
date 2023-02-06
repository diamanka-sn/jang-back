const express = require("express");
const app = express();
const bodyParse = require("body-parser");
const path = require('path');
const cors = require('cors')

const routesUtilisateur = require('./routes/routeUtilisateur')
const routesParent = require('./routes/routeParentEleve')
const routesService = require('./routes/routeService')
const routeCategorie = require('./routes/routeCategorie')
const routeEleve = require('./routes/routeEleve')
const routeDepense = require('./routes/routeDepense')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(bodyParse.json())
app.use(express.urlencoded({ extended: true }))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/utilisateur', routesUtilisateur)
app.use('/parent', routesParent)
app.use('/service', routesService)
app.use('/categorie', routeCategorie)
app.use('/eleve', routeEleve)
app.use('/depense', routeDepense)


module.exports = app;
