const express = require('express')
const routes = express.Router()
const controller = require('../controllers/controllerDepense')

routes.get('/', controller.getAllDepense)
routes.get('/c/', controller.ChiffreD)
routes.post('/', controller.enregistrer)
routes.put('/:id', controller.updateOneDepense)
routes.delete('/:id', controller.deleteOneDepense)

module.exports = routes