const express = require('express')
const routes = express.Router()
const controller = require('../controllers/controllerEleve')

routes.get('/', controller.getAllEleves)
routes.get('/:id', controller.getOneEleve)
routes.get('/pr/:id', controller.getParcours)
routes.get('/h/:id', controller.getHistorique)
routes.post('/', controller.ajouterEleve)
routes.post('/paiement', controller.ajouterPaiement)
routes.get('/p/:id', controller.getListeEleveOneParent)
routes.delete('/:id', controller.deleteOneEleve)
routes.put('/:id', controller.updateOneEleve)

module.exports = routes