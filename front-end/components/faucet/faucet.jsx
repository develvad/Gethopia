// const Faucet = () => {

//     return (
//         <main>
//             <header className="dash-titlebar">
//                 <h3>Faucet</h3>
//             </header>
//         </main>

//     )
// }

// export default Faucet;
import { useState } from 'react'
import { useEffect } from 'react'
// import './App.css'
const {ethereum} = window


function App() {
  const [cuenta, setCuenta] = useState(null)
  const [saldo, setSaldo] = useState("")
  const [isLoading, setIsLoading] = useState(false)

//   async function enviarGoer() {
//     setIsLoading(true)
//     const response = await fetch(`http://localhost:3000/enviar/${cuenta}`)
//     if (response.status == "200") {
//       const datos = await response.json();
//       await buscarSaldo(cuenta)
//       setIsLoading(false)
//     }
//   }

  async function buscarSaldo(cuenta) {
    const response = await fetch(`http://localhost:3000/balance/${cuenta}`)
    if (response.status == "200") {
      const datos = await response.json();
      setSaldo(datos)
    }
  }

  // esuEffect es lo que permite conectarnos con el metamask
  useEffect(() => {
    ethereum.request({ method: 'eth_requestAccounts' }).then(cuentas => {
      setCuenta(cuentas[0])
      buscarSaldo(cuentas[0])

      ethereum.on("accountsChanged", (cuentas)=> {
          setCuenta(cuentas[0])
          buscarSaldo(cuentas[0])

      })
    });

  }, [])
  // parte de la interfax
  return (
    <div className="container"> 
      <div>Cuenta {cuenta}</div>
      <div>Saldo = {JSON.stringify(saldo)}</div>
      {!isLoading && <button onClick={() => enviarGoer()} className= 'mt-3 btn btn-primary'>Enviar 0.001 Goerl</button>}
      {isLoading && <div>Se esta realizando la tx</div>}
    </div>
  )
}

export default App
