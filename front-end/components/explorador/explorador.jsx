import { Outlet, useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { useEffect, useState } from "react";
import axios from "axios";

const Explorador = () => {

    const { register, handleSubmit } = useForm()
    const navegar = useNavigate()
    const introducirInfo = (datos) => {
        if (datos.datosForm.length == 66) // Si la longitud es 66 navegamos a tx
            navegar(`tx/${datos.datosForm}`)
        if (datos.datosForm.length == 42) // Si la longitud es 42 navegamos a saldo
            navegar(`saldo/${datos.datosForm}`)
        if (/^\d+\.?\d*$/.test(datos.datosForm)) //Si el dato es un número navegamos a bloque
            navegar(`bloque/${datos.datosForm}`)

    }

    const [redes, setRedes] = useState([]);
    const [redActiva, setredActiva] = useState([]);
    const getRedes = async () => {
        const sitesFromBack = await axios.get('http://localhost:3000/network/listAll');
        console.log(sitesFromBack.data);
        let tempArr = [];

        sitesFromBack.data.forEach((i) => {
            let tempObj = {};
            tempObj = i.name.substring(i.name.indexOf("net") + 3, i.name.indexOf("nodo"))
            tempArr.push(parseInt(tempObj)); 
        })

        let arr = tempArr.filter( (value, index, self) => {
            return self.indexOf(value) === index
        })
        console.log(arr.sort());
        
        setRedes(arr.sort());
    }
    useEffect(() => {
        getRedes();
    }, []);

    return (
        <main>
            <header className="dash-titlebar">
                <h3>Explorador de redes locales</h3>
            </header>

            <form className='d-flex gap-1 my-2 mx-2' onSubmit={handleSubmit(introducirInfo)}>
                <select style={{ color: "#B7C46E" }} className='btn btn-icon-label btn-accent-2' onChange={(e) => setredActiva(e.target.value.slice(4))}>
                    {
                        redes.map((numRed) => <option key={numRed}>Red {numRed}</option>)
                    }
                </select>
                <input className="mx-1" {...register('datosForm')} size={100} placeholder=" Introduzca hash, número de bloque o cuenta"></input>
                <button style={{ color: "#B7C46E" }} className='btn btn-icon-label btn-accent-2'>Buscar</button>
            </form>
            <div className="border my-3 p-2">
                <Outlet></Outlet>
            </div>
        </main>
    )
}

export default Explorador;