import {Outlet, Link, useNavigate} from 'react-router-dom'
import {useEffect, useState} from "react";
import axios from "axios";
import './redes.css';
import {useQuery} from "react-query";

const Redes = () => {
    const [sites, setSites] = useState([]);
    const [newSites, setNewSites] = useState([]);
    const [modalDisp, setModalDisp] = useState(false);
    const [modalNodeDisp, setModalNodeDisp] = useState(false);
    const [netSelected, setNetSelected] = useState('');
    const [nodeSelected, setNodeSelected] = useState('1');
    const navigate = useNavigate();

    const getSites = async () => {
        const sitesFromBack = await axios.get('http://localhost:3000/network/listAll');
        let tempArr = [];

        if(sitesFromBack.data && sitesFromBack.data.length >= 1) {
            sitesFromBack.data.forEach((container) => {
                console.log(container);
                let tempObj = {};
                if (container.name.endsWith('nodo1')) {
                    console.log('Entro a nodo1');
                    console.log(container.name.indexOf('nodo'));
                    tempObj.netName = container.name.substring(1, 5);
                    tempObj.nodeName = container.name.substring(container.name.indexOf('nodo'), container.name.length);
                    tempObj.name = container.name;
                    tempObj.id = container.id;
                    tempObj.child = [];
                    tempArr.push(tempObj);
                }
            });
            sitesFromBack.data.forEach((container) => {
              let nodeObjTem = {};
                if (!container.name.endsWith('nodo1')) {
                    console.log('Nodo nuevo');
                    const netName = nodeObjTem.netName = container.name.substring(1, 5);
                    const indexOfNet = tempArr.findIndex((el) => el.netName === netName)
                    nodeObjTem.netName = netName;
                    nodeObjTem.nodeName = container.name.substring(container.name.indexOf('nodo'), container.name.length);
                    nodeObjTem.name = container.name;
                    nodeObjTem.id = container.id;
                    tempArr[indexOfNet].child.push(nodeObjTem);
                }
            });
            console.log(tempArr);
        }
        setSites(sitesFromBack.data);
        setNewSites(tempArr);
    }

    useEffect( () => {
        getSites();
    } ,[]);

    const { isLoading, error, data, refetch } = useQuery(['delNet'] , async () => {
        const resDelete = await axios.delete('http://localhost:3000/network/deleteNetwork/' + netSelected);
        return resDelete;
    }, {enabled: false});

    const { isLoading: isLoadingNode, error: errorNode, data: dataNode, refetch: refetchNode } = useQuery(['delNode'] , async () => {
        const resDelNode = await axios.delete('http://localhost:3000/node/deleteNode/' + netSelected + '/' + nodeSelected);
        return resDelNode;
    }, {enabled: false});


    const deleteNet = (net) => {
        setModalNodeDisp(false);
        setModalDisp(true);
        setNetSelected(net.name[4]);
    }

    const deleteNode = (node) => {
        console.log(node);
        setModalDisp(false);
        setModalNodeDisp(true);
        setNetSelected(node.netName.substring(node.netName.indexOf('net') + 3, node.netName.length));
        setNodeSelected( nodeSelected.substring(nodeSelected.indexOf('nodo') + 4, nodeSelected.length));
    }

    const closeModal = () => {
        setModalDisp(false);
        setModalNodeDisp(false);
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

    const deleteModalNodeConfirm = () => {
        closeModal();
        console.log('Entro en, deleteModalNodeConfirm');
        setTimeout(()=> {
            refetchNode().then(() => {
                setTimeout(() => {
                    getSites();
                }, 500);
            })

        }, 100)

    }

    const selectNode = (e) => {
        setNodeSelected(e.target.value)
    }

    return (
        <main>
            <header className="dash-titlebar">
                <h3> Redes activas </h3>
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
                        { newSites.map((site, i) => {
                            return (<tr key={i}>
                                <td>
                                    <input type="checkbox" value="option-1" />
                                </td>
                                <td><a href="#">{site.name.slice(1,5)}</a></td>
                                <td>{ site.netName }</td>
                                <td className="table-td-select">
                                    <select className="form-control" onChange={(e) => selectNode(e)} id="example-select-2">
                                        <option>nodo1</option>
                                        {
                                            site.child && site.child.map((child, i) => {
                                                return <option key={i} value={child.nodeName}>{ child.nodeName }</option>
                                            })
                                        }

                                    </select>
                                </td>
                                <td className="table-td-progress">
                                    <div className="progress">
                                        <div className="progress-bar bg-success w-100" role="progressbar" aria-valuenow="25"
                                             aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </td>
                                <td className="table-td-buttons">
                                    <a href="#" onClick={() => navigate("/nuevonodo?red=" + site.netName[3] + '&nodo=' + parseInt(site.child.length + 2, 10) )} className="btn btn-icon btn-primary btn-sm mx-1 ">
                                        <span className="icon icon-xs fa fa-plus"></span>
                                    </a>
                                    <a href="#" onClick={() => deleteNode(site)} className="btn btn-icon btn-accent-2 btn-sm ">
                                        <span className="icon icon-xs fa fa-trash"></span>
                                    </a>
                                    <a href="#" onClick={() => deleteNet(site)} className="btn btn-icon btn-danger btn-sm mx-1">
                                        <span className=" fa-solid fa-x"></span>
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
            { isLoading || isLoadingNode &&
                <>
                    <img src="/public/loading.svg"/>
                </>
            }
            <div className="card" style={{width: "500px", margin: "0 auto", display: modalDisp ? 'block' : 'none' }}>
                <div className="info__padding" >
                    <h3>Borrar Red  { netSelected }</h3>
                    <p>
                        ¿Desea Borrar la red { netSelected } y los nodos asociados?
                    </p>
                </div>
                <div className="button__group">
                    <button onClick={closeModal}>Cancelar</button>
                    <button onClick={deleteModalConfirm}>Borrar</button>
                </div>
            </div>

            <div className="card" style={{width: "500px", margin: "0 auto", display: modalNodeDisp ? 'block' : 'none' }}>
                <div className="info__padding" >
                    <h3>Borrar Nodo</h3>
                    <p>
                        ¿Desea Borrar el Nodo { nodeSelected } de la red { netSelected } ?
                    </p>
                </div>
                <div className="button__group">
                    <button onClick={closeModal}>Cancelar</button>
                    <button onClick={deleteModalNodeConfirm}>Borrar</button>
                </div>
            </div>
        </main>

    )
}

export default Redes;