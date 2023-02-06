const express = require('express')
const routes = express.Router()
const controller = require('../controllers/controllerUtilisateur')

routes.post("/", controller.inscrire)
routes.post('/login', controller.login)
routes.put('/:id', controller.updateUtilisateur)
routes.post('/modifierMp/:email', controller.modifierMp)

module.exports = routes