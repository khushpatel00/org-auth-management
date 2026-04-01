const express = require('express');
const routes = express.Router();

const root = require('../Controller/admin.controller')


// ADMIN ROUTES
routes.post('/', root.registerAdmin); // works
routes.get('/', root.fetchAllAdmins); // works
routes.get('/select', root.findSpecificAdmin); // works 
routes.get('/search', root.findAdmins); // works
routes.get('/:_id', root.fetchAdmin); // works
routes.post('/login', root.login); // works 150%
routes.delete('/:_id', root.deleteAdmin);

module.exports = routes;