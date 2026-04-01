const express = require('express');
const routes = express.Router();

const root = require('../Controller/manager.controller')

// MANAGER ROUTES
routes.post('/', root.registerManager); // works
routes.get('/', root.fetchAllManagers); // works
routes.post('/login', root.login); // works 150%

routes.get('/select', root.findSpecificManager); // works
routes.get('/search', root.findManagers); // works
routes.get('/:_id', root.fetchManager); // works


module.exports = routes;