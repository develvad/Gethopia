import { Outlet, useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'

const Explorador = () => {

    const {register, handleSubmit} = useForm()
    const navegar = useNavigate()
    const introducirInfo = (datos) => {
        if(datos.datosForm.length == 66) // Si la longitud es 66 navegamos a tx
            navegar(`tx/${datos.datosForm}`)
        if(datos.datosForm.length == 42) // Si la longitud es 42 navegamos a saldo
            navegar(`saldo/${datos.datosForm}`)
        if(/^\d+\.?\d*$/.test(datos.datosForm)) //Si el dato es un número navegamos a bloque
            navegar(`bloque/${datos.datosForm}`)

    }

    return( 
    <main>
        <header className="dash-titlebar">
            <h3>Explorador de redes locales</h3>
        </header>
            <form className='d-flex justify-content-center gap-1 my-2' onSubmit={handleSubmit(introducirInfo)}>
                <input {...register('datosForm')} size={100}></input>
                <button className="mx-3 btn btn-primary">Introducir</button>
            </form>
            <div className="border my-3 p-2">
                <Outlet></Outlet>
            </div>
</main>
    )
}

export default Explorador;