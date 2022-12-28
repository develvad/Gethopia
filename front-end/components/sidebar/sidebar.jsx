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
                    <li className="dash-nav-item mx-1">      
                        <span style={{color:"#B7C46E"}} className="fa-solid fa-network-wired"></span>
                        <span>           
                            <Link style={{display:"inline-block", color:"#B7C46E"}} to="/redes">Redes</Link>
                        </span>      
                    </li>
                    <li className="dash-nav-item mx-1">
                        <span style={{color:"#B7C46E"}} className="fa-solid fa-magnifying-glass"></span>
                        <span>           
                            <Link style={{display:"inline-block", color:"#B7C46E"}} to="/explorador">Explorador</Link>
                        </span>      
                    </li>
                    <li className="dash-nav-item mx-1">
                        <span style={{color:"#B7C46E"}} className="fa-solid fa-user"></span>
                        <span>           
                            <Link style={{display:"inline-block", color:"#B7C46E"}} to="/personal">Área personal</Link>
                        </span>      
                    </li>
                    <li className="dash-nav-item mx-1">
                        <span style={{color:"#B7C46E"}} className="fa-solid fa-faucet"></span>
                        <span>           
                            <Link style={{display:"inline-block", color:"#B7C46E"}} to="/faucet">Faucet</Link>
                        </span>      
                    </li>
                </ul>
                <footer className="dash-nav-tools d-flex justify-content-between">
                    <a href="#"><span style={{color:"#B7C46E"}} className="icon fa fa-question-circle"></span></a>
                    <a href="#"><span style={{color:"#B7C46E"}} className="icon fa fa-user-secret"></span></a>
                    <a href="#"><span style={{color:"#B7C46E"}} className="icon fa fa-file-contract"></span></a>
                    <a href="#"><span style={{color:"#B7C46E"}} className="icon fa fa-solid fa-hashtag"></span></a>
                </footer>
            </nav>

        </>
    )
}
export default SideBar;