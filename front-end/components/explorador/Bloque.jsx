import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getBloque } from './api'
import { Link } from 'react-router-dom'

export default function Bloque() {
    const params = useParams()
    const {data, isLoading, error} = useQuery(['numBloque', params.numBloque], getBloque)

    if(isLoading) 
        return <h1>Cargando...</h1>
        
    if(error)
        return <h1>Error</h1>

    return (
    <div>
        <table className="table">
            <thead>
                <tr>
                    <th>Lista de transacciones</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.transactions.map((tx, indice) => 
                        <tr key={indice}>  
                            <Link to={`/explorador/tx/${tx}`}>{tx}</Link> 
                        </tr>
                    )
                }
            </tbody>
        </table>
        <pre>
            <h4>Bloque</h4>
            {JSON.stringify(data, null, 4)}
        </pre>
    </div>
    )
}