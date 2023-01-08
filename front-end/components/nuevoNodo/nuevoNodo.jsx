import { useForm } from 'react-hook-form'
import {useQuery} from "react-query";
import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";

const NuevoNodo = () => {
    const { register, handleSubmit } = useForm()
    const [idNodo, setIdNodo] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setIdNodo(searchParams.get('red'));
    });


    const { isLoading, error, data, refetch, isFetching } =
        useQuery(['newAddress'] , async () => {
            console.log('idRED: ' + idNodo);
            return await axios.post('ENDPOINT PARA CREAR NUEVO NODO' + idNodo);
        }, {enabled: false});

    const alPulsar = (datosBoton) => {
        console.log(datosBoton);
        refetch();

    }

    return(

        <div>
            <header className="dash-titlebar mb-2">
                <h3> Nuevo nodo para la red: <strong> <u> { idNodo } </u> </strong>  </h3>

            </header>
            { isFetching &&
                <>
                    <h3 className='mx-2 my-2'>---</h3>
                    <img src="/public/loading.svg"/>
                </>
                }
            {
                !isFetching &&
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