import React, {useRef, useEffect, useState} from 'react' 


const Canvas = (props) => {
    
    const [gl, setGl] = useState(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current 
        setGl(canvas.getContext('webgl2') || canvas.getContext('experimental-webgl'))   
    }, [])

    return <canvas ref={canvasRef} width="640" height="480"></canvas>
}

export default Canvas