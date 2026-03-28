const express = require('express');
const routes = express.Router();

const root = require('../Controller/manager.controller')

// MANAGER ROUTES
routes.post('/', root.registerManager);
routes.get('/', root.fetchAllManagers);
routes.get('/:_id', root.fetchManager);
routes.get('/:searchquery', root.findSpecificManager);
routes.get('/:searchquery', root.findManagers);


module.exports = routes;