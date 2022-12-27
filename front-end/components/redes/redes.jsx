import { Outlet, Link } from 'react-router-dom'

const Redes = () => {

    return (
        <main>
            <header className="dash-titlebar">
                <span className='btn btn-icon btn-accent-2 ml-md-auto'>           
                    <Link className='btn-icon-label' to="nuevared">Crear nueva red</Link>
                </span>      
                {/* <a href="nuevared" className="btn btn-icon btn-accent-2 ml-md-auto">
                    <span className="btn-icon-label">Crear Nueva Red</span>
                </a> */}
            </header>

            <div className="dash-boxes container-fluid">
                <div className="box box-b">
                    <table className="box-table table">
                        <thead>
                        <tr>
                            <th className="table-col-checkbox">
                                <input type="checkbox" value="option-1" />
                            </th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Nodos</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <input type="checkbox" value="option-1" />
                            </td>
                            <td><a href="#">Red 1</a></td>
                            <td>POA</td>
                            <td className="table-td-select">
                                <select className="form-control" id="example-select-2">
                                    <option>Nodo1</option>
                                    <option>Nodo2</option>
                                    <option>Nodo3</option>
                                    <option>Nodo4</option>
                                    isotipo.svg
                                </select>
                            </td>
                            <td className="table-td-progress">
                                <div className="progress">
                                    <div className="progress-bar bg-danger w-100" role="progressbar" aria-valuenow="25"
                                         aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </td>
                            <td className="table-td-buttons">
                                <a href="#" className="btn btn-icon btn-primary btn-sm">
                                    <span className="icon icon-xs fa fa-play"></span>
                                </a>
                                <a href="#" className="btn btn-icon btn-accent-2 btn-sm mx-1">
                                    <span className="icon icon-xs fa fa-stop"></span>
                                </a>
                                <a href="#" className="btn btn-icon btn-danger btn-sm">
                                    <span className="icon icon-xs fa fa-trash"></span>
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="checkbox" value="option-1" />
                            </td>
                            <td><a href="#">Red 2</a></td>
                            <td>POW</td>
                            <td className="table-td-select">
                                    <select className="form-control" id="example-select-2">
                                        <option>Nodo1</option>
                                        <option>Nodo2</option>
                                        <option>Nodo3</option>
                                        <option>Nodo4</option>

                                    </select>
                            </td>
                            <td className="table-td-progress">
                                <div className="progress">
                                    <div className="progress-bar bg-success w-100" role="progressbar" aria-valuenow="25"
                                         aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </td>
                            <td className="table-td-buttons">
                                <a href="#" className="btn btn-icon btn-primary btn-sm">
                                    <span className="icon icon-xs fa fa-play"></span>
                                </a>
                                <a href="#" className="btn btn-icon btn-accent-2 btn-sm mx-1">
                                    <span className="icon icon-xs fa fa-stop"></span>
                                </a>
                                <a href="#" className="btn btn-icon btn-danger btn-sm">
                                    <span className="icon icon-xs fa fa-trash"></span>
                                </a>
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <Outlet/>
            </div>   
        </main>

    )
}

export default Redes;