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

export class Game{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes!: Shape[];

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.init();
    }


    async init(){
        this.existingShapes = await getExistingShapes(roomId);
    }
}

