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
                    {/* <li className="dash-nav-item active">
                        <a href="/redes">
                            <span className="fa-solid fa-network-wired"></span>
                            <span className="mx-2 dash-nav-item-text">Redes</span> 
                        </a>
                    </li> */}
                    <li className="dash-nav-item">      
                        <span className="fa-solid fa-network-wired"></span>
                        <span>           
                            <Link className='mx-2' to="/redes">Redes</Link>
                        </span>      
                    </li>
                    <li className="dash-nav-item">
                        {/* <a href="explorador">
                            <span className="icon pe-7s-note2"></span>
                            <span className="dash-nav-item-text">Explorador</span>
                        </a> */}    
                        <span className="fa-solid fa-magnifying-glass"></span>
                        <span>           
                            <Link className='mx-2' to="/explorador">Explorador</Link>
                        </span>      
                    </li>
                    <li className="dash-nav-item">
                        {/* <a href="personal">
                            <span className="icon pe-7s-plus"></span>
                            <span className="dash-nav-item-text">Área personal</span>
                        </a> */}  
                        <span className="fa-solid fa-user"></span>
                        <span>           
                            <Link className='mx-2' to="/personal">Área personal</Link>
                        </span>      
                    </li>
                    <li className="dash-nav-item">
                        {/* <a href="faucet">
                            <span className="icon pe-7s-plus"></span>
                            <span className="dash-nav-item-text">Faucet</span>
                        </a> */}
                        <span className="fa-solid fa-faucet"></span>
                        <span>           
                            <Link className='mx-2' to="/faucet">Faucet</Link>
                        </span>      
                    </li>
                </ul>
                <footer className="dash-nav-tools d-flex justify-content-between">
                    <a href="#"><span className="icon fa fa-question-circle"></span></a>
                    <a href="#"><span className="icon fa fa-user-secret"></span></a>
                    <a href="#"><span className="icon fa fa-file-contract"></span></a>
                    <a href="#"><span className="icon fa fa-solid fa-hashtag"></span></a>
                </footer>
            </nav>

        </>
    )
}
export default SideBar;