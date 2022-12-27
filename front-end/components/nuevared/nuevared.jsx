import { useForm } from 'react-hook-form'
import { useState } from 'react';

const NuevaRed = () => {
        
    const { register, handleSubmit } = useForm()
        
    const [numNodos, setNumNodos] = useState()
    const [idRed, setIdRed] = useState()
    
    function alPulsar(datosBotón) {
        setNumNodos(datosBotón.cantidad)
        setIdRed(datosBotón.idRed)
        console.log("Crearíamos una red con ", numNodos, "nodos y llamada", idRed)
    }

    return(
        <div>
            <h3 className='mx-2'>Nueva Red</h3>
            <form onSubmit={handleSubmit(alPulsar)}>
                <div className="form-group mx-2">
                    <label>Introduzca número de nodos</label>
                    <input {...register('cantidad')} type="number" className="form-control"/>
                </div>
                <div className="form-group mx-2">
                    <label>Introduzca identificador de red</label>
                    <input {...register('idRed')} type="string" className="form-control"/>
                </div>
                <button type="submit" className="btn btn-primary mt-1 mx-2">Añadir red</button>
            </form>
        </div>
    )

}

export default NuevaRed;