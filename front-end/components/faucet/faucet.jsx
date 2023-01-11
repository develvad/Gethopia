import {useEffect, useState, useContext} from "react";
const {ethereum} = window
import { Contexto } from '../../src/App'

const Faucet = () => {
    const [estado] = useContext(Contexto)
    const [redActiva] = useState(estado.redActiva);

    const [cuenta, setCuenta] = useState(null)
    const [saldo, setSaldo] = useState("")
    const [isLoading, setIsLoading] = useState(false)
  
    async function getSaldo(cuenta){ 
      // const respuesta = await fetch(`http://localhost:3000/faucet/saldo/${cuenta}`)
      const respuesta = await fetch(`http://localhost:3000/faucet/${redActiva}/saldo/${cuenta}`)
      if (respuesta.status == "200"){
        const datos = await respuesta.json() 
        setSaldo(datos)
      }
    }
    
    async function enviarETH(){   
      setIsLoading(true)
      // const respuesta = await fetch(`http://localhost:3000/faucet/enviar/${cuenta}`)
      const respuesta = await fetch(`http://localhost:3000/faucet/${redActiva}/enviar/${cuenta}`)
      if (respuesta.status == "200"){
        const datos = await respuesta.json() 
        await getSaldo(cuenta)
      }
      setIsLoading(false)
    }
  
    useEffect(() => {
      ethereum.request({ method: 'eth_requestAccounts' }).then(cuentas => {
        setCuenta(cuentas[0])
        getSaldo(cuentas[0])
        ethereum.on("accountsChanged", (cuentas) => {
          setCuenta(cuentas[0])
          getSaldo(cuentas[0])
        })
      })
    }, [])

    return (
        <main>
            <header className="dash-titlebar">
                <h3>Faucet</h3>
            </header>
            <div className="container mx-1 my-1">
                <div>Cuenta: {cuenta}</div>
                <div>Saldo: {saldo.saldoEthers} ETH</div>
                {!isLoading && <button onClick={() => enviarETH()} className='mt-3 btn btn-primary'>Solicitar 10 ETH</button>}
                {isLoading && <div>Procesando transacción...</div>}
            </div>
        </main>

    )
}

export default Faucet;