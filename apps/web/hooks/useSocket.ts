import { useEffect, useState } from "react";
import { WS_URL } from "../app/room/[slug]/config";

export function useSocket(){
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YTVhNDhlZC05MzVhLTRmZjctYjJiYi1lMjY0N2U3ZmQzMGEiLCJpYXQiOjE3NDUyMTg1NTF9.3J-VWsBPo1_JCECdb3PHjzVhMnyikgr4YEKVnGt-5mw`);
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
