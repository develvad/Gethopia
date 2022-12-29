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

    const { isLoading, error, data, refetch } = useQuery(['newNet'] , async () => {
        console.log('----> ', idRed);
        /*
                const response = await axios.post('http://localhost:3000/network/listAll', {});
        */
        const resFrom = await axios.post('http://localhost:3000/network/createNetwork/' + idRed);
        console.log(resFrom);
        return resFrom;
    }, {enabled: false});
    const alPulsar = (datosBoton) => {
        console.log(datosBoton);
        setIdRed(datosBoton.idRed);
    }

    return(
        <div>
            { isLoading &&
                <>
                    <h3> Creando nueva red </h3>
                    <img src="/public/loading.svg"/>
                </>
                }
            {
                !isLoading &&
                <>
                    <h3 className='mx-2 my-2'>Nueva red</h3>
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