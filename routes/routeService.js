const express = require('express')
const routes = express.Router()
const controller = require('../controllers/controllerService')

routes.post('/', controller.enregistrer)
routes.post('/s/:id', controller.changerStatus)
routes.put('/:id', controller.updateOneService)
routes.get('/', controller.getAllService)
routes.get('/ca', controller.Chiffre)
routes.delete('/:id', controller.deleteOneService)

module.exports = routes