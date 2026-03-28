const express = require('express');
const routes = express.Router();

const root = require('../Controller/admin.controller')


// ADMIN ROUTES
routes.post('/', root.registerAdmin);
routes.get('/', root.fetchAllAdmins);
routes.get('/:_id', root.fetchAdmin);
routes.get('/:searchquery', root.findSpecificAdmin);
routes.get('/:searchquery', root.findAdmins);

module.exports = routes;