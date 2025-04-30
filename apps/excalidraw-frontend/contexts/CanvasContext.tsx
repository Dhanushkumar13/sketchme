import { createContext, ReactNode, useContext, useState } from "react";

type Tool = 'pencil' | 'eraser';

interface CanvasContextType{
    tool: Tool;
    setTool: (tool: Tool) => void;
    lineWidth: number;
    setLineWidth: (width: number) => void;
    color: string;
    setColor: (color: string) => void;
}

const CanvasContext = createContext<CanvasContextType>({
    tool: 'pencil',
    setTool: () => {},
    lineWidth: 4,
    setLineWidth: () => {},
    color: '#ffffff',
    setColor: ()=>{},
});

interface CanvasProviderProps{
    children: ReactNode
}

//creating context provider
export const CanvasProvider: React.FC<CanvasProviderProps> = ({children}) => {
    const [tool, setTool] = useState<Tool>('pencil');
    const [lineWidth, setLineWidth] = useState<number>(4);
    const [color, setColor] = useState<string>('#ffffff');

    const value = {
        tool,
        setTool,
        lineWidth,
        setLineWidth,
        color,
        setColor
    }

    return (
        <CanvasContext.Provider value={value}>
            {children}
        </CanvasContext.Provider>
    );
};

//creating custom hook
export const useCanvasContext = () => useContext(CanvasContext);