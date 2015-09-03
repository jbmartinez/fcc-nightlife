'use strict';

var express = require('express');
var controller = require('./venue.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/location/:location', controller.search);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;