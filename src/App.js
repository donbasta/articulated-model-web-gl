import React, {useState, useRef, useEffect} from 'react'
import './App.css'
import {initShaderProgram, renderScene} from './utils'
import Slider from './Slider'
import * as mat4 from './matrix.js';

import hollowCube from './models/hollowCube';
import balok from './models/balok';
import {kubus} from './models/kubus';
import {kubus2} from './models/kubus2';
import tetrahedronSolid from './models/tetrahedronSolid';
import GLObject from './GLObject';

const App = () => {
    const canvasRef = useRef(null);
    const [saveUrl, setSaveUrl] = useState(null);
    const [objList, setObjList] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(0);
    const [glAttr, setGlAttr] = useState(null);

    const createNewObject = (model, name, anchorPoint, position) => {
        const obj = new GLObject(model, name, anchorPoint);
        console.log("done create with id : ", obj.id);
        obj.setPosition(position[0], position[1], position[2]);
        obj.setRotation(0, 0, 0);
        obj.setScale(1, 1, 1);
        objList.push(obj);
        setObjList(objList);
    }

    useEffect(() => {
        createNewObject(balok(-50, 50, -50, 50, -50, 50), "badan", [0, 0, 0], [0, 0, 0]);
        // createNewObject(balok(0, 100, 0, 30, 0, 30), "tangan kanan", [50, 0, 0]);
        createNewObject(balok(0, 200, 0, 40, 0, 40), "tangan kanan", [0, 20, 20], [50, -40, -40]);

        // createNewObject(balok(-50, 150, -10, 10, -50, 10), "tangan kanan", [50, 0, 0]);
        // createNewObject(balok(-250, -50, -10, 10, -50, 10), "tangan kiri", [0, 0, 0]);
        // createNewObject(balok(-250, -50, -10, 10, -50, 10), "lengan kiri", [0, 0, 0]);
        // createNewObject(kubus, "kubus 1", [1, 1, 1]);
        // createNewObject(tetrahedronSolid, "tetrahedron", [1, 1, 1]);
        // createNewObject(hollowCube, "kubus-bolong", [-50, -50, -50]);

        console.log(objList);

        objList[0].addChild(objList[1]);
        // objList[0].addChild(objList[2]);
        // objList[2].addChild(objList[3]);

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
                resolutionMatrix: gl.getUniformLocation(shaderProgram, 'uResolution'),
            }
        };
        setGlAttr({
            gl: gl,
            programInfo: programInfo,
        });

        renderScene(gl, programInfo, objList);
    }, []);

    const handleX = (angle) => {
        console.log(objList);
        objList[selectedObjectId].rotateXObj(angle);
        renderScene(glAttr.gl, glAttr.programInfo, objList);
    };

    const handleY = (angle) => {
        objList[selectedObjectId].rotateYObj(angle);
        renderScene(glAttr.gl, glAttr.programInfo, objList);
    };

    const handleZ = (angle) => {
        objList[selectedObjectId].rotateZObj(angle);
        renderScene(glAttr.gl, glAttr.programInfo, objList);
    };

    const handleZoom = (coef) => {
        renderScene(glAttr.gl, glAttr.programInfo, objList);
    }

    const handleTranslateX = (coef) => {
        const obj = objList[selectedObjectId];
        const current = obj.position;
        obj.translateObj(coef, current[1], current[2]);
        renderScene(glAttr.gl, glAttr.programInfo, objList);
    }

    const handleTranslateY = (coef) => {
        const obj = objList[selectedObjectId];
        const current = obj.position;
        obj.translateObj(current[0], coef, current[2]);
        renderScene(glAttr.gl, glAttr.programInfo, objList);
    }
    
    const handleTranslateZ = (coef) => {
        const obj = objList[selectedObjectId];
        const current = obj.position;
        obj.translateObj(current[0], current[1], coef);
        renderScene(glAttr.gl, glAttr.programInfo, objList);
    }

    const changeSelectedObjectId = (e) => {
        console.log(e.target);
        setSelectedObjectId(e.target.value);
    }

    return (
        <div>
            <div className="canvas-container">
            <canvas ref={canvasRef} width="640" height="480"></canvas>
            </div>
            <div className="slider-container">
                <p> SELECT Object</p>
                <select name="objects" id="objects" onChange={changeSelectedObjectId}>
                    {objList.map(obj => {
                        return (
                            <option key={obj.id} value={obj.id}>{obj.name}</option>
                        )
                    })} 
                </select>
                <p> Rotate x-axis </p>
                <Slider min={0} max={360} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].rotation[0]} onChange={handleX}/>
                <p> Rotate y-axis </p>
                <Slider min={0} max={360} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].rotation[1]} onChange={handleY}/>
                <p> Rotate z-axis </p>
                <Slider min={0} max={360} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].rotation[2]} onChange={handleZ}/>
                <p> Scale </p>
                <Slider min={30} max={600} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId]} onChange={handleZoom}/>
                <p> Translate x </p>
                <Slider min={-50} max={50} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].position[0]} onChange={handleTranslateX}/>
                <p> Translate Y </p>
                <Slider min={-50} max={50} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].position[1]} onChange={handleTranslateY}/>
                <p> Translate Z </p>
                <Slider min={-50} max={50} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].position[2]} onChange={handleTranslateZ}/>
            </div>
        </div>
    )
}

export default App;
