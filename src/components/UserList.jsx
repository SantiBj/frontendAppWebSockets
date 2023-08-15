import { useEffect, useState } from "react"
import { w3cwebsocket } from "websocket"

export function UserList(){
    const [Customers,setCustomers] = useState([])
    const wsPath = "ws://127.0.0.1:8000/ws/sock"
    const client = new w3cwebsocket(wsPath)

    function handlerUserUpdate(updatedCustomer) {
        setCustomers([
            ...Customers,
            JSON.parse(updatedCustomer)
        ])
    }

    useEffect(()=>{
        async function dataConsult() {
            const consult = await fetch('http://127.0.0.1:8000/api/customer/')
            const data = await consult.json()
            setCustomers(data)
        }
        dataConsult()

        client.onopen = ()=>{
            console.log("connected")
        }

        client.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log(data)
            if (data.type === 'newCustomer'){
                handlerUserUpdate(data.customer)
            }
        }

        
    },[])

    if (Customers.length == 0){
        return <h1>Cargando ..</h1>
    }
    return (
        <div>
            <h2>Customers</h2>
            <ul>
                {
                    Customers.map(customer => (
                        <li key={customer.id}>{ customer.name }</li>
                    ))
                }
            </ul>
        </div>
    )
}