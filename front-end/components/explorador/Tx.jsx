import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getTx } from './api'
import { Link } from 'react-router-dom'

export default function Tx() {
    // const params = useParams()
    // const {data, isLoading, error} = useQuery(['tx', params.hashTx], getTx)

    const {redActiva, hashTx} = useParams()
    const { data, isLoading, error } = useQuery(['hashTx', hashTx], () => {
        return fetch(`http://localhost:3000/explorer/${redActiva}/tx/${hashTx}`).then(res => res.json())
    })

    if(isLoading) 
        return <h1>Cargando...</h1>
        
    if(error)
        return <h1>Error</h1>

    return <div>
        <h4>Transacción</h4>
        <table className="table">
            <thead>
                <tr>
                    <th>Bloque</th>
                    <td>
                       <Link to={`/explorador/${redActiva}/bloque/${data.blockNumber}`}>{data.blockNumber}</Link> 
                    </td>
                </tr>
                <tr>
                    <th>Desde</th>
                    <td>
                       <Link to={`/explorador/${redActiva}/saldo/${data.from}`}>{data.from}</Link> 
                    </td>
                </tr>
                <tr>
                    <th>A</th>
                    <td>
                       <Link to={`/explorador/${redActiva}/saldo/${data.to}`}>{data.to}</Link> 
                    </td>
                </tr>
                <tr>
                    <th>Valor</th>
                    <td>{data.value}</td>
                </tr>
            </thead>
        </table>
        <pre>
            <div>Información completa de la transacción:</div>
    {       JSON.stringify(data, null, 4)}
        </pre>
    </div>
}