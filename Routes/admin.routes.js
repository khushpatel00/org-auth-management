const express = require('express');
const routes = express.Router();

const root = require('../Controller/admin.controller')


// ADMIN ROUTES
routes.post('/', root.registerAdmin);
routes.get('/', root.fetchAllAdmins);
routes.get('/select', root.findSpecificAdmin);
routes.get('/search', root.findAdmins);
routes.get('/:_id', root.fetchAdmin);

module.exports = routes;