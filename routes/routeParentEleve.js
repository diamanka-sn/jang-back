const express = require('express')
const routes = express.Router()
const controller = require('../controllers/controllerParentEleve')

routes.post('/', controller.ajouterParent)
routes.post('/getParents', controller.searchParent)
routes.get('/', controller.getAllParrentEleve)
routes.get('/:id', controller.getOneParent)
routes.delete('/:id', controller.deleteOneParent)
routes.put('/:id', controller.updateOneParent)

module.exports = routes