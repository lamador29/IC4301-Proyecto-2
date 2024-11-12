const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');


router.post('/showTables', controller.showTables);
router.post('/getPages', controller.getPages);
router.post('/getWords', controller.getWords);


module.exports = router;