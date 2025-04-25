import { useEffect, useRef } from "react";
import { initDraw } from "../draw";

export default function Canvas({
    roomId,
    socket
}:{
    roomId: string;
    socket : WebSocket;
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(()=>{

        if(canvasRef.current){

            initDraw(canvasRef.current, roomId, socket);
        }

    },[canvasRef])

    return(
        <div style={{
            height: "100vh",
            overflow: "hidden"
        }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        </div>
    )
}