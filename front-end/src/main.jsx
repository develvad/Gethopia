import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'

// const queryClient = new QueryClient();

// import { createContext } from 'react'

// export const Contexto = createContext()

// const [estado, setEstado] = React.useState({
//     redActiva:1
// })


ReactDOM.createRoot(document.getElementById('root')).render(  
    // <React.StrictMode>
    //     <Contexto.Provider value={[estado, setEstado]}>
    //         <BrowserRouter>
    //             <QueryClientProvider client={queryClient}>
                    <App/>
//                 </QueryClientProvider>
//             </BrowserRouter>
//         </Contexto.Provider>
//   </React.StrictMode>
)
