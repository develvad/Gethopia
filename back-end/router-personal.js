const ex = require('express')
const router = ex.Router();
module.exports = router
const Web3 = require('Web3')
const cors = require('cors')

router.use(cors())

// const web3 = new Web3("http://localhost:8545")
const web3 = new Web3("https://mainnet.infura.io/v3/20b55e65c65649c686d7abc8e4853f0b")

router.get("/saldo/:cuenta", async (req, res) =>{
    const saldo = await web3.eth.getBalance(req.params.cuenta)
    // res.send({ saldo })
    res.send({ saldo : web3.utils.fromWei(saldo, 'ether') })
})
