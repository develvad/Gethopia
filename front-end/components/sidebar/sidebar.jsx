import {Link} from 'react-router-dom'

const SideBar = () => {
    return (
        <>
            <nav className="dash-nav" id="dash-nav">
                <header>
                    <a className="dash-nav-toggler">
                        <span className="dash-nav-toggler-icon"></span>
                    </a>
                    <div className="dash-nav-logo">
                        <img src="/public/isotipo.svg" style={{height: '40px'}} />
                    </div>
                </header>
                <ul className="dash-nav-list">
                    <li className="dash-nav-item ">
                        <span>
                            <Link style={{ color:"#B7C46E"}} to="/redes">
                                <span style={{color:"#B7C46E"}} className="fa-solid fa-network-wired"></span>
                                <span className="mx-1">Redes</span>
                            </Link>
                        </span>      
                    </li>
                    <li className="dash-nav-item ">
                            <Link style={{ color:"#B7C46E"}} to="/explorador">
                                <span style={{color:"#B7C46E"}} className="fa-solid fa-magnifying-glass"></span>
                                <span className="mx-1">Explorador</span>
                            </Link>
                    </li>
                    <li className="dash-nav-item">
                        <span>
                            <Link style={{ color:"#B7C46E"}} to="/personal">
                                <span style={{color:"#B7C46E"}} className="fa-solid fa-user"></span>
                                <span className="mx-1">Área Personal</span>
                            </Link>
                        </span>      
                    </li>
                    <li className="dash-nav-item ">
                        <span>
                            <Link style={{color:"#B7C46E"}} to="/faucet">
                                <span style={{color:"#B7C46E"}} className="fa-solid fa-faucet"></span>
                                <span className="mx-1">Faucet</span>
                            </Link>
                        </span>      
                    </li>
                </ul>
                <footer className="dash-nav-tools d-flex justify-content-between">
                    <a href="#" title="Quienes somos"><span style={{color:"#B7C46E"}} className="icon fa fa-question-circle"></span></a>
                    <a href="#" title="Privacidad"><span style={{color:"#B7C46E"}} className="icon fa fa-user-secret"></span></a>
                    <a href="#" title="Terminos y condiciones"><span style={{color:"#B7C46E"}} className="icon fa fa-file-contract"></span></a>
                    <a href="#" title="Redes Sociales"><span style={{color:"#B7C46E"}} className="icon fa fa-solid fa-hashtag"></span></a>
                </footer>
            </nav>

        </>
    )
}
export default SideBar;