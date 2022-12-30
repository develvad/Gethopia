import { useForm } from 'react-hook-form'
import {useQuery} from "react-query";
import axios from "axios";
import {useEffect, useState} from "react";

const NuevaRed = () => {
    const { register, handleSubmit } = useForm()
    const [idRed, setIdRed] = useState(0);

    useEffect(() => {
        if (idRed !== 0) {
            console.log(' :: ', idRed , ' :: ');
            setTimeout(() => {
                console.log('refecheooooooo');
                refetch();
            }, 100);
        }
    }, [idRed])

        const { isLoading, error, data, refetch, isFetching } = useQuery(['newNet'] , async () => {
        return await axios.post('http://localhost:3000/network/createNetwork/' + idRed);
    }, {enabled: false});
    const alPulsar = (datosBoton) => {
        console.log(datosBoton);
        setIdRed(datosBoton.idRed);
    }

    return(
        <div>
            { isFetching &&
                <>
                    <h3 className='mx-2 my-2'> Creando nueva red </h3>
                    <img src="/public/loading.svg"/>
                </>
                }
            {
                !isFetching &&
                <>
                    <h3 className='mx-2 my-2'>Nueva red { isLoading} </h3>
                    <form onSubmit={handleSubmit(alPulsar)}>
                        <div className="form-group mx-2">
                            <label>Introduzca identificador de red</label>
                            <input {...register('idRed')} type="number" className="form-control"/>
                        </div>
                        <button type="submit" className="btn btn-primary mt-1 mx-2">Añadir red</button>
                    </form>
                </>
            }

        </div>
    )
}

export default NuevaRed;