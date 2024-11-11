//Configurar el servidor, definir rutas, configurar la entrega de archivos y el puerto del servidor
const express = require('express');
const bodyParser = require('body-parser');
/*
const ejemploRoutes = require('./routes/ejemploRoutes');
*/
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
/*
app.use('/example', ejemploRoutes);
*/

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
