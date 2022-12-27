import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import './App.css'
import SideBar from "../components/sidebar/sidebar.jsx";
import Header from "../components/header/header.jsx";
import Redes from "../components/redes/redes.jsx";
import Explorador from '../components/explorador/explorador';
import Personal from '../components/personal/personal';
import Faucet from '../components/faucet/faucet';
import NuevaRed from '../components/nuevared/nuevared';


function App() {

  return (
    <BrowserRouter>
    <div className="App">
      <div className="dash" role="application">
        <SideBar/>
          <div className="dash-app" id="dash-nav">
            <Header />
              <Routes>
                <Route path="/">
                  <Route index element={<Redes/>} />
                  <Route path="*" element={<Redes/>} />
                  <Route path="redes" element={<Redes/>} />
                  <Route path="explorador" element={<Explorador/>} />
                  <Route path="personal" element={<Personal/>} />
                  <Route path="faucet" element={<Faucet/>} />
                  <Route path="nuevared" element={<NuevaRed/>} />
              </Route>
            </Routes>
        
        </div>
      </div>
    </div>
  </BrowserRouter>  
  )
}

export default App;
