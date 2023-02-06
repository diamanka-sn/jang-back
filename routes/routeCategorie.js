const express = require('express')
const routes = express.Router()
const controller = require('../controllers/controllerCategorie')

routes.post('/', controller.addCategorie)
routes.get('/', controller.getAllCategorie)
routes.delete('/:id', controller.deleteOneCategorie)

module.exports = routes