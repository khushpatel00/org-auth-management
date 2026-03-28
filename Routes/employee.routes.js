const express = require('express');
const routes = express.Router();

const root = require('../Controller/employee.controller')

// EMPLOYEE ROUTES
routes.post('/', root.registerEmployee);
routes.get('/', root.fetchAllEmployees);
routes.get('/:_id', root.fetchEmployee);
routes.get('/:searchquery', root.findSpecificEmployee);
routes.get('/:searchquery', root.findEmployees);


module.exports = routes;