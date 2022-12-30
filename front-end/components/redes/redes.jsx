import { Outlet, Link } from 'react-router-dom'
import {useEffect, useState} from "react";
import axios from "axios";
import './redes.css';
import {useQuery} from "react-query";

const Redes = () => {
    const [sites, setSites] = useState([]);
    const [modalDisp, setModalDisp] = useState(false);
    const [netSelected, setNetSelected] = useState({});
    const getSites = async () => {
        const sitesFromBack = await axios.get('http://localhost:3000/network/listAll');
        console.log(sitesFromBack.data);
        setSites(sitesFromBack.data);
    }
    useEffect( () => {
        getSites();
    } ,[]);

    const { isLoading, error, data, refetch } = useQuery(['newNet'] , async () => {
        const resDelete = await axios.delete('http://localhost:3000/network/deleteNetwork/' + netSelected);
        return resDelete;
    }, {enabled: false});

    const deleteNet = (net) => {
        console.log(net);
        console.log(net.name[4]);
        setModalDisp(true);
        setNetSelected(net.name[4]);

    }

    const closeModal = () => {
        setModalDisp(false);
    }

    const deleteModalConfirm = () => {
        setTimeout(()=>  {
            refetch();
            setModalDisp(false);
        }, 100)
        setTimeout(() => {
            getSites();
        }, 1000);
    }

    return (
        <main>
            <header className="dash-titlebar">
                <span className='btn btn-icon btn-accent-2 ml-md-auto'>           
                    <Link style={{color:"#B7C46E"}} className='btn-icon-label' to="/nuevared">Crear nueva red</Link>
                </span>      
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
                            <th>ID</th>
                            <th>Nodos</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        { sites.map((site, i) => {
                            return (<tr key={i}>
                                <td>
                                    <input type="checkbox" value="option-1" />
                                </td>
                                <td><a href="#">{site.name.slice(1,5)}</a></td>
                                <td>{site.id.slice(0,9)}...{ site.id.slice(site.id.length -5, site.id.length )}</td>
                                <td className="table-td-select">
                                    <select className="form-control" id="example-select-2">
                                        <option>Nodo1</option>
                                        <option>...</option>
                                    </select>
                                </td>
                                <td className="table-td-progress">
                                    <div className="progress">
                                        <div className="progress-bar bg-success w-100" role="progressbar" aria-valuenow="25"
                                             aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </td>
                                <td className="table-td-buttons">
                                    <a href="#" style={{cursor: "not-allowed", pointerEvents: 'auto'}}  className="btn btn-icon btn-primary btn-sm disabled">
                                        <span className="icon icon-xs fa fa-play"></span>
                                    </a>
                                    <a href="#" style={{cursor: "not-allowed", pointerEvents: 'auto'}} className="btn btn-icon btn-accent-2 btn-sm mx-1 disabled">
                                        <span className="icon icon-xs fa fa-stop"></span>
                                    </a>
                                    <a href="#" onClick={() => deleteNet(site)} className="btn btn-icon btn-danger btn-sm">
                                        <span className="icon icon-xs fa fa-trash"></span>
                                    </a>
                                </td>
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <Outlet/>
            </div>
            { isLoading &&
                <>
                    <img src="/public/loading.svg"/>
                </>
            }
            <div className="card" style={{width: "500px", margin: "0 auto", display: modalDisp ? 'block' : 'none' }}>
                <div className="info__padding" >
                    <h3>Borrar</h3>
                    <p>
                        ¿Desea Borrar esa red y los nodos asociados?
                    </p>
                </div>
                <div className="button__group">
                    <button onClick={closeModal}>Cancelar</button>
                    <button onClick={deleteModalConfirm}>Borrar</button>
                </div>
            </div>

        </main>

    )
}

export default Redes;