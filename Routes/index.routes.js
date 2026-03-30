const express = require('express');
const routes = express.Router();
const root = require('../Controller/index.controller')

routes.get('/', root.status);
routes.get('/health', root.health);

routes.use('/admin', require('./admin.routes'));
routes.use('/manager', require('./manager.routes'));
routes.use('/employee', require('./employee.routes'));
routes.use('/auth', require('./auth.routes'));


module.exports = routes;