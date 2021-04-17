import React, {useState, useRef, useEffect} from 'react'
import './App.css'
import {initShaderProgram, initBuffers, drawScene} from './utils'
import Slider from './Slider'

import kubus from './kubus.json';

const App = () => {
    const canvasRef = useRef(null);

    const [saveUrl, setSaveUrl] = useState(null);

    const [objList, addObjList] = useState([]);

    //ganti model disini
    const [currentModel, changeModel] = useState({
        positions: [-0.8,0.8,1,-1,1,1,0.8,0.8,1,0.8,0.8,1,1,1,1,-1,1,1,0.8,0.8,1,1,1,1,0.8,-0.8,1,1,1,1,1,-1,1,0.8,-0.8,1,0.8,-0.8,1,1,-1,1,-0.8,-0.8,1,1,-1,1,-1,-1,1,-0.8,-0.8,1,-0.8,-0.8,1,-1,-1,1,-0.8,0.8,1,-1,-1,1,-1,1,1,-0.8,0.8,1,1,1,1,1,-1,1,1,1,-1,1,1,-1,1,-1,-1,1,-1,1,-1,-1,1,-1,1,1,-1,-1,-1,-1,-1,-1,-1,1,-1,-1,1,1,1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,-1,-1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-0.4,0.4,-1,-1,1,-1,0.4,0.4,-1,0.4,0.4,-1,1,1,-1,-1,1,-1,0.4,0.4,-1,1,1,-1,0.4,-0.4,-1,1,1,-1,1,-1,-1,0.4,-0.4,-1,0.4,-0.4,-1,1,-1,-1,-0.4,-0.4,-1,1,-1,-1,-1,-1,-1,-0.4,-0.4,-1,-0.4,-0.4,-1,-1,-1,-1,-0.4,0.4,-1,-1,-1,-1,-1,1,-1,-0.4,0.4,-1,0.8,0.8,1,0.8,-0.8,1,0.4,0.4,-1,0.4,0.4,-1,0.4,-0.4,-1,0.8,-0.8,1,-0.8,0.8,1,-0.8,-0.8,1,-0.4,-0.4,-1,-0.4,-0.4,-1,-0.4,0.4,-1,-0.8,0.8,1,0.8,0.8,1,0.4,0.4,-1,-0.4,0.4,-1,-0.4,0.4,-1,-0.8,0.8,1,0.8,0.8,1,0.8,-0.8,1,0.4,-0.4,-1,-0.4,-0.4,-1,-0.4,-0.4,-1,-0.8,-0.8,1,0.8,-0.8,1],
        colors: [0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.5,0.2,0.3,1,0.6,0.4,0.3,1,0.6,0.4,0.3,1,0.6,0.4,0.3,1,0.6,0.4,0.3,1,0.6,0.4,0.3,1,0.6,0.4,0.3,1,0.7,0.3,0.3,1,0.7,0.3,0.3,1,0.7,0.3,0.3,1,0.7,0.3,0.3,1,0.7,0.3,0.3,1,0.7,0.3,0.3,1,0.8,0.2,0.2,1,0.8,0.2,0.2,1,0.8,0.2,0.2,1,0.8,0.2,0.2,1,0.8,0.2,0.2,1,0.8,0.2,0.2,1,0.8,0.1,0.3,1,0.8,0.1,0.3,1,0.8,0.1,0.3,1,0.8,0.1,0.3,1,0.8,0.1,0.3,1,0.8,0.1,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,0.9,0.5,0.3,1,1,0.1,0.5,1,1,0.1,0.5,1,1,0.1,0.5,1,1,0.1,0.5,1,1,0.1,0.5,1,1,0.1,0.5,1,0.9,1,0.4,1,0.9,1,0.4,1,0.9,1,0.4,1,0.9,1,0.4,1,0.9,1,0.4,1,0.9,1,0.4,1,0.65,0.32,0.412,1,0.65,0.32,0.412,1,0.65,0.32,0.412,1,0.65,0.32,0.412,1,0.65,0.32,0.412,1,0.65,0.32,0.412,1,0.45,0.12,0.22,1,0.45,0.12,0.22,1,0.45,0.12,0.22,1,0.45,0.12,0.22,1,0.45,0.12,0.22,1,0.45,0.12,0.22,1]
    });

    //status rotasi, dilatasi dan translasi
    const [rotationAngle, setRotationAngle] = useState({
        x: 0.0,
        y: 0.0,
        z: 0.0
    });
    const [zoom, setZoom] = useState(-6.0);
    const [translate, setTranslate] = useState(0.0);

    //gl attribute
    const [glAttr, setGlAttr] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        const shaderProgram = initShaderProgram(gl);
        
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            }
        };
    
        const buffers = initBuffers(gl, currentModel);

        setGlAttr({
            gl: gl,
            programInfo: programInfo,
            buffers: buffers
        });

        drawScene(gl, programInfo, buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);

    }, [currentModel]);

    useEffect(() => {
        const dataToSave = {
            positions: currentModel.positions,
            colors: currentModel.colors,
            rotangle: rotationAngle,
            zoom: zoom,
            translate: translate,
        }

        const textSave = JSON.stringify(dataToSave) 

        const data = new Blob([textSave], {type: 'text/json'})

        const url = window.URL.createObjectURL(data)

        setSaveUrl(url)

        
    }, [currentModel, rotationAngle, zoom, translate])

    const handleX = (angle) => {
        setRotationAngle({
            x: angle,
            y: rotationAngle.y,
            z: rotationAngle.z
        });

        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    };

    const handleY = (angle) => {
        setRotationAngle({
            x: rotationAngle.x,
            y: angle,
            z: rotationAngle.z
        });

        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    };

    const handleZ = (angle) => {
        setRotationAngle({
            x: rotationAngle.x,
            y: rotationAngle.y,
            z: angle
        });

        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    };

    const handleZoom = (coef) => {
        setZoom(-coef/10.0);

        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    }

    const handleTranslate = (coef) => {
        setTranslate(coef/10);

        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    }

    const handleReset = () => {
        setRotationAngle({
            x: 0,
            y: 0,
            z: 0
        })
        setZoom(-6.0)
        setTranslate(0.0)

        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    };

    const handleFileChange = (e) => {
        let files = e.target.files[0]

        console.log(files)


        const reader = new FileReader();

        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result)

                console.log(data)
                setRotationAngle(data.rotangle)
                setZoom(data.zoom)
                setTranslate(data.translate)
                changeModel({positions: data.positions, colors: data.colors})
            } catch (ex) {
                console.log(ex)
            }
        }
        reader.readAsText(files)
    }   

    return (
        <div>
            <div className="canvas-container">
            <canvas ref={canvasRef} width="640" height="480"></canvas>
            </div>
            <p> Rotate x-axis </p>
            <Slider min={0} max={360} value={rotationAngle.x} onChange={handleX}/>
            <p> Rotate y-axis </p>
            <Slider min={0} max={360} value={rotationAngle.y} onChange={handleY}/>
            <p> Rotate z-axis </p>
            <Slider min={0} max={360} value={rotationAngle.z} onChange={handleZ}/>
            <p> Scale </p>
            <Slider min={30} max={600} value={-10 * zoom} onChange={handleZoom}/>
            <p> Translate x </p>
            <Slider min={-50} max={50} value={0} onChange={handleTranslate}/>
            <button onClick={handleReset} className="btn">Reset Default View</button>
            <input onChange={handleFileChange} type="file" id="files" name="files[]"/>
            <a className="btn" download="myModel.json" href={saveUrl}>Download as JSON</a>
        </div>
    )
}

export default App;
