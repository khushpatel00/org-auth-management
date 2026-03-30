const express = require('express');
const routes = express.Router();
const root = require('../Controller/auth.controller');

routes.get('login', (req, res) => { return res.json('use login as a post route') })
// routes.post('login', root.login);

module.exports = routes;