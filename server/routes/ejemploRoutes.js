// Definir las rutas relacionadas con los hobbies, incluyendo obtener hobbies, recomendaciones, likes y dislikes
const express = require('express');
const router = express.Router();
const ejemploController = require('../controllers/ejemploController');


router.post('/funcionEjemplo', ejemploController.funcionEjemplo);



module.exports = router;