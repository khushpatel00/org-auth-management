const express = require('express');
const routes = express.Router();

const root = require('../Controller/employee.controller')

// EMPLOYEE ROUTES
routes.post('/', root.registerEmployee);
routes.get('/', root.fetchAllEmployees);
// routes.post('/login', root.login)


routes.get('/select', root.findSpecificEmployee);
routes.get('/search', root.findEmployees);
routes.get('/:_id', root.fetchEmployee);


module.exports = routes;