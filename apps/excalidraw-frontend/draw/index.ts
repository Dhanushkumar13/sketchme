import axios from 'axios'
import { HTTP_BACKEND } from '../config';

type Shape = {
    type: 'rect',
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: 'circle';
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: 'pencil';
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}


interface Socket {
    onmessage: (e: MessageEvent) => void;
    send: (data: string) => void;
}


export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: Socket): Promise<void> {
    const ctx = canvas.getContext("2d");

    let existingShapes: Shape[] = await getExistingShapes(roomId);
    if (!ctx) {
        return;
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type == 'chat') {
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape.shape);
            clearCanvas(existingShapes, canvas, ctx);
        }
    };

    clearCanvas(existingShapes, canvas, ctx);

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener('mousedown', (e: MouseEvent) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener('mouseup', (e: MouseEvent) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        //@ts-ignore
        const selectedTool = window.selectedTool;
        let shape: Shape | null = null;
        if(selectedTool === 'rect'){
             shape = {
                //@ts-ignore
                type: 'rect',
                x: startX,
                y: startY,
                height,
                width
            }
            
        } else if(selectedTool === 'circle'){
            const radius = Math.max(width, height) /2;
            shape= {
                //@ts-ignore
                type: 'circle',
                radius: radius,
                centerX: startX + radius,
                centerY: startY + radius,
            }
            
        }
        if(!shape){
            return
        }
        existingShapes.push(shape);

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape,
            }),
            roomId
        }));
    });

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255,255,255)";
            //@ts-ignore
            const selectedTool = window.selectedTool;
            if(selectedTool === 'rect'){
                ctx.strokeRect(startX, startY, width, height);
            } else if (selectedTool === 'circle'){
                const centerX = startX + width/2;
                const centerY = startY + height/2;
                const radius = Math.max(width, height) / 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
            }
            
        }
    });
}

function clearCanvas(existingShapes : Shape[], canvas : HTMLCanvasElement, ctx: CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)"
    ctx.fillRect(0,0,canvas.width,canvas.height);

    existingShapes.map((shape) => {
        if(shape.type === 'rect'){
            ctx.strokeStyle= "rgba(255,255,255)"
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);     
        }else if (shape.type === 'circle'){
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        }
    })
}

async function getExistingShapes(roomId : string){
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
    const messages = res.data.messages;

    const shapes = messages.map((x : {message: string})=>{
        const messagesData = JSON.parse(x.message)
        return messagesData.shape;
    })
    return shapes;
}