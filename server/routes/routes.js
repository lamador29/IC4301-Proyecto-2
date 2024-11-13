const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');


router.post('/showTables', controller.showTables);
router.post('/getPages', controller.getPages);
router.post('/getWords', controller.getWords);
router.post('/getPageInfo', controller.getPageInfo);


module.exports = router;