import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getSaldo } from './api'

export default function Saldo() {
    const params = useParams()
    const {data, isLoading, error} = useQuery(['dir', params.dir], getSaldo)

    if(isLoading) 
        return <h1>Cargando...</h1>
        
    if(error)
        return <h1>Error</h1>

    return <pre>
        <h4>Saldo</h4>
        {JSON.stringify(data, null, 4)}
    </pre>
}