import { useEffect, useState } from "react";
import { WS_URL } from "../app/room/[slug]/config";

export function useSocket(){
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlNDlkNGJkNi02MzUxLTRlM2EtODY1Ny05ZjFlNWY3OTc0MGIiLCJpYXQiOjE3NDQ5NzEwMDR9.qd_yXjec-W6bfkJlNt-6LY7ePfXxIDTk4CR0fuo6_5A`);
        ws.onopen= () =>{
            setLoading(false);
            setSocket(ws)
        }
    },[])

    return{
        socket,
        loading
    }
}
