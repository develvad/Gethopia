import './App.css'
import SideBar from "../components/sidebar/sidebar.jsx";
import Header from "../components/header/header.jsx";
import Main from "../components/main/main.jsx";

function App() {

  return (
    <div className="App">
      <div className="dash" role="application">
        <SideBar />
        <div className="dash-app" id="dash-nav">
          <Header />
          <Main />
        </div>
      </div>
    </div>
  )
}

export default App;
