const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.post('/getPages', controller.getPages);
router.post('/getTogetherPages', controller.getTogetherPages);
router.post('/getWords', controller.getWords);
router.post('/getPageInfo', controller.getPageInfo);
router.post('/getWordInfo', controller.getWordInfo);
router.post('/getWikipedia', controller.getWikipedia);
router.post('/search', controller.search);

module.exports = router;