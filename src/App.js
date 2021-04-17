import React, {useState, useRef, useEffect} from 'react'
import './App.css'
import {initShaderProgram, initBuffers, drawScene, renderScene} from './utils'
import Slider from './Slider'

import {kubus} from './kubus';

const App = () => {
    const canvasRef = useRef(null);

    const [saveUrl, setSaveUrl] = useState(null);

    const [objList, addObjList] = useState([kubus, kubus]);

    // const [currentModel, changeModel] = useState(kubus);

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
                cameraMatrix: gl.getUniformLocation(shaderProgram, 'uCameraMatrix'),
            }
        };

        setGlAttr({
            gl: gl,
            programInfo: programInfo,
        });

        renderScene(gl, programInfo, objList, rotationAngle, zoom, translate);

    }, [objList]);

    // useEffect(() => {
    //     const dataToSave = {
    //         positions: currentModel.positions,
    //         colors: currentModel.colors,
    //         rotangle: rotationAngle,
    //         zoom: zoom,
    //         translate: translate,
    //     }

    //     const textSave = JSON.stringify(dataToSave) 

    //     const data = new Blob([textSave], {type: 'text/json'})

    //     const url = window.URL.createObjectURL(data)

    //     setSaveUrl(url)

        
    // }, [currentModel, rotationAngle, zoom, translate])

    const handleX = (angle) => {
        setRotationAngle({
            x: angle,
            y: rotationAngle.y,
            z: rotationAngle.z
        });

        renderScene(glAttr.gl, glAttr.programInfo, objList, rotationAngle, zoom, translate);

        // drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    };

    const handleY = (angle) => {
        setRotationAngle({
            x: rotationAngle.x,
            y: angle,
            z: rotationAngle.z
        });

        renderScene(glAttr.gl, glAttr.programInfo, objList, rotationAngle, zoom, translate);

        // drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    };

    const handleZ = (angle) => {
        setRotationAngle({
            x: rotationAngle.x,
            y: rotationAngle.y,
            z: angle
        });

        renderScene(glAttr.gl, glAttr.programInfo, objList, rotationAngle, zoom, translate);

        // drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    };

    const handleZoom = (coef) => {
        setZoom(-coef/10.0);

        renderScene(glAttr.gl, glAttr.programInfo, objList, rotationAngle, zoom, translate);

        // drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    }

    const handleTranslate = (coef) => {
        setTranslate(coef/10);

        renderScene(glAttr.gl, glAttr.programInfo, objList, rotationAngle, zoom, translate);

        // drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    }

    const handleReset = () => {
        setRotationAngle({
            x: 0,
            y: 0,
            z: 0
        })
        setZoom(-6.0)
        setTranslate(0.0)

        renderScene(glAttr.gl, glAttr.programInfo, objList, rotationAngle, zoom, translate);

        // drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    };

    // const handleFileChange = (e) => {
    //     let files = e.target.files[0]

    //     console.log(files)


    //     const reader = new FileReader();

    //     reader.onload = () => {
    //         try {
    //             const data = JSON.parse(reader.result)

    //             console.log(data)
    //             setRotationAngle(data.rotangle)
    //             setZoom(data.zoom)
    //             setTranslate(data.translate)
    //             changeModel({positions: data.positions, colors: data.colors})
    //         } catch (ex) {
    //             console.log(ex)
    //         }
    //     }
    //     reader.readAsText(files)
    // }   

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
            {/* <input onChange={handleFileChange} type="file" id="files" name="files[]"/> */}
            <a className="btn" download="myModel.json" href={saveUrl}>Download as JSON</a>
        </div>
    )
}

export default App;
