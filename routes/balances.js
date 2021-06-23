var express = require('express');
var router = express.Router();
const data = require('../data/user');
const auth = require('../middleware/auth');
const schemaUserCreate = require('../schema/userCreate');
const schemaUserUpdate = require('../schema/userUpdate');