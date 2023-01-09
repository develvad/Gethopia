import { useForm } from 'react-hook-form'
import {useQuery} from "react-query";
import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";

const NuevoNodo = () => {
    const { handleSubmit } = useForm()
    const [idRed, setIdRed] = useState('')
    const [idNodo, setIdNodo] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIdRed(searchParams.get('red'));
        setIdNodo(searchParams.get('nodo'));
    });

    useEffect(() => {
        console.log(idRed);
        if (idRed) {

        }
    }, [idNodo]);

    const { isLoading: isLoadingAddr, error: errorAddr, data: dataAddr, refetch: reftechAddr, isFetching: isFetchingAddr } =
        useQuery(['newAddress'] , async () => {
            return await axios.post('http://localhost:3000/node/createNodeAddress/' + idRed + '/' + idNodo);
        }, {enabled: false});

    const { isLoading: isLoadingDB, error: errorDB, data: dataDB, refetch: reftechDB, isFetching: isFetchingDB } =
        useQuery(['newNode'] , async () => {
            return await axios.post('http://localhost:3000/node/createNodeDB/' + idRed + '/' + idNodo);
        }, {enabled: false});

    const { isLoading: isLoadingStatic, error: errorStatic, data: dataStatic, refetch: reftechStatic, isFetching: isFetchingStatic } =
        useQuery(['newStatic'] , async () => {
            return await axios.get(' http://localhost:3000/network/staticNode/' + idRed);
        }, {enabled: false});

    const { isLoading: isLoadingCont, error: errorCont, data: dataCont, refetch: reftechCont, isFetching: isFetchingCont } =
        useQuery(['newContainer'] , async () => {
            return await axios.post('http://localhost:3000/node/createNodeContainer/' + idRed +  '/' + idNodo);
        }, {enabled: false});

    const alPulsar = (datosBoton) => {

        setLoading(true);
        setTimeout(() => {
            reftechAddr().then(() => {
                reftechDB().then(() => {
                    setTimeout(() => {
                        reftechStatic().then(() =>{
                            reftechCont().then(() => {
                                setLoading(false);
                            });
                        });
                    }, 1000);
                });
            })
        }, 100);
    }

    return(

        <div>
            <header className="dash-titlebar mb-2">
                { !loading && <h3> Nuevo nodo para la red: <strong> <u> { idRed } </u> </strong>  </h3>}
                { loading && <h3> Creando nuevo Nodo  </h3> }


            </header>
            { loading &&
                <>
                    <img src="/public/loading.svg"/>
                </>
                }
            {
                !loading &&
                <>
                    <form onSubmit={handleSubmit(alPulsar)}>
{/*                        <div className="form-group mx-2">
                            <label>Introduzca identificador de red</label>
                            <input {...register('idNodo')} type="number" className="form-control"/>
                        </div>*/}
                        <button type="submit" className="btn btn-primary mt-1 mx-2">Añadir nuevo nodo</button>
                    </form>
                </>
            }
        </div>
    )
}

export default NuevoNodo;