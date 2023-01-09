const express = require('express');
// const router = express.Router()
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()

//import routed apps
const networks = require("./router-network")
const node = require("./router-node")
const explorer = require("./router-explorer")
const personal = require("./router-personal")

// Routes
app.use("/network", networks)
app.use("/node", node)
app.use("/explorer", explorer)
app.use("/personal", personal)

// Middles
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// Endpoints
app.get('/', (req, res) => {
    res.status(200).send({ hola: 'Mundo' });
})

// ruta not found
app.use("*", (req, res) =>{
    res.status(404).send("NOT FOUND ")
})

app.listen(3000, () => {
    console.log("listening to 3000");
});

//
// Arrancar con npx nodemon app.js
//