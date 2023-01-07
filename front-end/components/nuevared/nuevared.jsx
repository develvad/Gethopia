import { useForm } from 'react-hook-form'
import {useQuery} from "react-query";
import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const NuevaRed = () => {
    const { register, handleSubmit } = useForm()
    const [idRed, setIdRed] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(idRed);
        if (idRed) {
            setLoading(true);
            setTimeout(() => {
                reftechAddr().then(() => {
                    reftechDB().then(() => {
                        reftechCont().then(() => {
                            setLoading(false);
                        })
                    });
                })
            }, 100);
        }
    }, [idRed]);

    const { isLoading: isLoadingAddr, error: errorAddr, data: dataAddr, refetch: reftechAddr, isFetching: isFetchingAddr } =
        useQuery(['newAddress'] , async () => {
            console.log('idRED: ' + idRed);
            return await axios.post('http://localhost:3000/network/createAddress/' + idRed);
        }, {enabled: false});

    const { isLoading: isLoadingDB, error: errorDB, data: dataDB, refetch: reftechDB, isFetching: isFetchingDB } =
        useQuery(['newNode'] , async () => {
            console.log('idRED: ' + idRed);
            return await axios.post('http://localhost:3000/network/createNodeDB/' + idRed);
        }, {enabled: false});

    const { isLoading: isLoadingCont, error: errorCont, data: dataCont, refetch: reftechCont, isFetching: isFetchingCont } =
        useQuery(['newContainer'] , async () => {
            console.log('idRED: ' + idRed);
            return await axios.post('http://localhost:3000/network/createNodeContainer/' + idRed);
        }, {enabled: false});

    const alPulsar = (datosBoton) => {
        console.log(datosBoton);
        setIdRed(datosBoton.idRed);
    }

    return(
        <div>
            <header className="dash-titlebar mb-3">
                { !loading ? <h3> Crear nueva red </h3> : <h3> Creando nueva red </h3>}
            </header>
            { loading &&
                <>
                    <img src="/public/loading.svg"/>
                </>
                }
            {
                !loading &&
                <>
                    <div className="dash-boxes container-fluid">
                        <div className="row">
                            <div className="col-xl-4 col-lg-9 col-md-6 col-sm-9">
                                <div className="box box-b">
                                    <div className="box-head box-head-sm box-bb">
                                        <h4>Crear una nueva red (ETH-POA)</h4>
                                    </div>
                                    <div className="box-block">
                                        <form onSubmit={handleSubmit(alPulsar)}>
                                            <div className="form-group row">
                                                <div className="col-sm-5">
                                                    <label htmlFor="input-email-3" className="col-form-label">Identificador de red: </label>
                                                </div>
                                                <div className="col-sm-7">
                                                    <input {...register('idRed')} type="number" className="form-control"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-3">
                                                    <button type="submit" className="btn btn-primary ">Añadir red</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default NuevaRed;