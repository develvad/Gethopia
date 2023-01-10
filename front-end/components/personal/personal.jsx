import {useEffect, useState} from "react";
const {ethereum} = window

const Personal = () => {

    const [cuenta, setCuenta] = useState(null)
    const [saldo, setSaldo] = useState("")
  
    async function getSaldo(cuenta){ 
      const respuesta = await fetch(`http://localhost:3000/personal/saldo/${cuenta}`)
      if (respuesta.status == "200"){
        const datos = await respuesta.json() 
        setSaldo(datos)
      }
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
                <h3>Área personal</h3>
            </header>
            <div className="container mx-1 my-1">
                <div>Cuenta: {cuenta}</div>
                {/* <div>Saldo: {JSON.stringify(saldo)} ETH</div> */}
                <div>Saldo: {saldo.saldoEthers} ETH</div>
            </div>
        </main>

    )
}

export default Personal;