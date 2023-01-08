const ex = require('express')
const router = ex.Router();
module.exports = router
const Web3 = require('Web3')
const cors = require('cors')

router.use(cors())

const URL_NODO = "http://localhost:8566"

const web3 = new Web3(URL_NODO)
// const web3 = new Web3(new Web3.providers.HttpProvider(URL_NODO))

router.get("/", async (req,res) => {
    const numBloque = await web3.eth.getBlockNumber()
    res.send({numBloque})
})

router.get("/bloque/:numBloque", async (req,res) => {
    try{
        const bloque = await web3.eth.getBlock(req.params.numBloque)
        res.send(bloque)
    }catch(error) {
        res.status(500).send({mensaje: error.message})
    }
})

router.get("/tx/:numTx", async (req,res) => {
    const tx = await web3.eth.getTransaction(req.params.numTx)
    res.send(tx)
})


router.get("/saldo/:dir", async (req,res) => {
    const saldo = await web3.eth.getBalance(req.params.dir)
    res.send({'saldo wei': saldo, 'saldo ether': web3.utils.fromWei(saldo, 'ether')})
})
