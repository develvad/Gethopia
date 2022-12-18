const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// app
const app = express();
// Middles
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
// Endpoints
app.get('/', (req, res) => {
    res.status(200).send({ hola: 'Mundo' });
})

app.listen(3000);

//
// Arrancar con npx nodemon app.js
//