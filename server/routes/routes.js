// Definir las rutas relacionadas con los hobbies, incluyendo obtener hobbies, recomendaciones, likes y dislikes
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');


router.get('/showTables', controller.showTables);



module.exports = router;