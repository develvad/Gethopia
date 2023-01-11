import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import './App.css'
import SideBar from "../components/sidebar/sidebar.jsx";
import Header from "../components/header/header.jsx";
import Redes from "../components/redes/redes.jsx";
import Explorador from '../components/explorador/explorador';
import Bloque from '../components/explorador/Bloque';
import Saldo from '../components/explorador/Saldo';
import Tx from '../components/explorador/Tx';
import Personal from '../components/personal/personal';
import Faucet from '../components/faucet/faucet';
import NuevaRed from '../components/nuevared/nuevared';
import NuevoNodo from "../components/nuevoNodo/nuevoNodo.jsx";
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'


import { createContext } from 'react'

export const Contexto = createContext()

const queryClient = new QueryClient();

function App() {

  const [estado, setEstado] = React.useState({
    redActiva:1
  })

  return (
    <React.StrictMode>
        <Contexto.Provider value={[estado, setEstado]}>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                  <div className="App">
                    <div className="dash" role="application">
                      <SideBar/>  
                        <div className="dash-app" id="dash-nav">
                          <Header />
                          <Routes>
                            <Route path="/">
                              <Route index element={<Redes/>} />
                              <Route path="*" element={<Redes/>} />
                              <Route path="/redes" element={<Redes/>} />
                              <Route path="/explorador" element={<Explorador/>}>
                                <Route path=":redActiva/bloque/:numBloque" element={<Bloque/>} />
                                <Route path=":redActiva/tx/:hashTx" element={<Tx/>} />
                                <Route path=":redActiva/saldo/:dir" element={<Saldo/>}/>
                              </Route>
                              <Route path="/personal" element={<Personal/>} />
                              <Route path="/faucet" element={<Faucet/>} />
                              <Route path="/nuevared" element={<NuevaRed/>} />
                              <Route path="/nuevonodo" element={<NuevoNodo/>} />
                            </Route>
                          </Routes>
                        </div>
                      </div>
                  </div>
                </QueryClientProvider>
            </BrowserRouter>
        </Contexto.Provider>
  </React.StrictMode>
  )
}

export default App;
