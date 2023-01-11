import { useContext} from "react";
import { Contexto } from '../../src/App'

// export async function getBloque(red, bloque){
export async function getBloque(bloque){
    // const [estado, setEstado] = useContext(Contexto)

    // const respuesta = await fetch(`http://localhost:3000/explorer/${red.queryKey[1][0]}/bloque/${bloque.queryKey[1][1]}`)
    const respuesta = await fetch(`http://localhost:3000/explorer/bloque/${bloque.queryKey[1]}`)
    const datos = await respuesta.json()
    return datos
}

export async function getTx(tx){
    // const [estado, setEstado] = useContext(Contexto)

    const respuesta = await fetch(`http://localhost:3000/explorer/${estado.redActiva}/tx/${tx.queryKey[1]}`)
    const datos = await respuesta.json()
    return datos
}

export async function getSaldo(dir){
    // const [estado, setEstado] = useContext(Contexto)

    const respuesta = await fetch(`http://localhost:3000/explorer/${estado.redActiva}/saldo/${dir.queryKey[1]}`)
    const datos = await respuesta.json()
    return datos
}