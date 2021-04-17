import React, {useState, useRef, useEffect} from 'react'
import './App.css'
import {initShaderProgram, renderScene} from './utils'
import Slider from './Slider'
import * as mat4 from './matrix.js';

import {kubus} from './kubus';
import {kubus2} from './kubus2';
import tetrahedronSolid from './tetrahedronSolid';
import GLObject from './GLObject';

const App = () => {
    const canvasRef = useRef(null);
    const [saveUrl, setSaveUrl] = useState(null);
    const [objList, setObjList] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(0);
    const [glAttr, setGlAttr] = useState(null);

    const createNewObject = (model, name, anchorPoint) => {
        const obj = new GLObject(model, name, anchorPoint);
        console.log("done create with id : ", obj.id);
        obj.setPosition(0, 0, 0);
        obj.setRotation(0, 0, 0);
        obj.setScale(2, 2, 2);
        objList.push(obj);
        setObjList(objList);
    }

    useEffect(() => {

        // createNewObject(kubus, "kubus 1", [0, 0, 0]);
        // createNewObject(kubus2, "kubus 2", [1, 1, 1]);
        // tetrahedronSolid.positions = mat4.multiplyMatrixAndScalar(tetrahedronSolid.positions, 100);
        createNewObject(kubus2, "kubus 2", [1, 1, 1]);

        console.log(objList);

        // objList[0].addChild(objList[1]);

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
                // cameraMatrix: gl.getUniformLocation(shaderProgram, 'uCameraMatrix'),
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
        const current = objList[selectedObjectId].rotation;
        objList[selectedObjectId].rotateObj(angle, 0, 0);
        renderScene(glAttr.gl, glAttr.programInfo, objList);
    };

    const handleY = (angle) => {
        const current = objList[selectedObjectId].rotation;
        objList[selectedObjectId].rotateObj(0, angle, 0);
        renderScene(glAttr.gl, glAttr.programInfo, objList);
    };

    const handleZ = (angle) => {
        const current = objList[selectedObjectId].rotation;
        objList[selectedObjectId].rotateObj(0, 0,angle);
        renderScene(glAttr.gl, glAttr.programInfo, objList);
    };

    const handleZoom = (coef) => {
        // setZoom(-coef/10.0);

        renderScene(glAttr.gl, glAttr.programInfo, objList);
    }

    const handleTranslate = (coef) => {
        // setTranslate(coef/10);
        // objList[selectedObjectId].translateObj(coef, 0, 0);
        renderScene(glAttr.gl, glAttr.programInfo, objList);
    }

    const changeSelectedObjectId = (e) => {
        console.log(e.target);
        console.log("id yang terpilih saat ini adalah: ", e.target.value);
        setSelectedObjectId(e.target.value);

        console.log("objList: \n", objList);
    }

    return (
        <div>
            <div className="canvas-container">
            <canvas ref={canvasRef} width="640" height="480"></canvas>
            </div>
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
            <Slider min={-50} max={50} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId]} onChange={handleTranslate}/>
        </div>
    )
}

export default App;
