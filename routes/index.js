var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/:page?', indexController.getHome);

router.get('/term/:title/:page?', indexController.getTerm);

router.post('/term/:title/:page?', indexController.postTerm);

router.post('/vote', indexController.vote)

// router.post('/search', indexController.postSearch)

module.exports = router;
