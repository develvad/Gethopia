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
                    <li className="dash-nav-item active">
                        <a href="#">
                            <span className="icon pe-7s-helm"></span>
                            <span className="dash-nav-item-text">Redes</span>
                        </a>
                    </li>
                    <li className="dash-nav-item">
                        <a href="#">
                            <span className="icon pe-7s-note2"></span>
                            <span className="dash-nav-item-text">Nodos</span>
                        </a>
                    </li>
                    <li className="dash-nav-item">
                        <a href="#">
                            <span className="icon pe-7s-plus"></span>
                            <span className="dash-nav-item-text">Cuentas</span>
                        </a>
                    </li>
                </ul>
                <footer className="dash-nav-tools">
                    <a href="#"><span className="icon fa fa-cog"></span></a>
                    <a href="#"><span className="icon fa fa-question-circle"></span></a>
                </footer>
            </nav>

        </>
    )
}
export default SideBar;