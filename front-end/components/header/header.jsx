const Header = () => {

    return (
      <>
          <header className="dash-toolbar">
              <a className="dash-nav-toggler">
                  <span className="dash-nav-toggler-icon"></span>
              </a>
              <div>
                   <img src="/public/logo.svg" style={{height: '25px'}} />
              </div>
              <div className="dropdown dash-toolbar-dropdown">

                  <div className="dropdown-menu dropdown-menu-right"
                       aria-labelledby="username-dropdown">
                      <a className="dropdown-item" href="#">Menu Item 1</a>
                      <a className="dropdown-item" href="#">Menu Item 2</a>
                      <a className="dropdown-item" href="#">Log out</a>
                  </div>
              </div>
          </header>
      </>
    );
}
export default Header;