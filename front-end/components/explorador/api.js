export async function getBloque(bloque){
    const respuesta = await fetch(`http://localhost:3000/explorer/bloque/${bloque.queryKey[1]}`)
    const datos = await respuesta.json()
    return datos
}

export async function getTx(tx){
    const respuesta = await fetch(`http://localhost:3000/explorer/tx/${tx.queryKey[1]}`)
    const datos = await respuesta.json()
    return datos
}

export async function getSaldo(dir){
    const respuesta = await fetch(`http://localhost:3000/explorer/saldo/${dir.queryKey[1]}`)
    const datos = await respuesta.json()
    return datos
}