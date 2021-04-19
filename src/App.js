import React, {useState, useRef, useEffect} from 'react'
import './App.css'
import {initShaderProgram, initShaderProgramWithTexture, renderScene} from './utils'
import Slider from './Slider'
import smiley from "./smiley.png";

import { createSphere } from './geometry';
import balok from './models/balok';
import GLObject from './GLObject';
import { loadTexture } from './imageTextureUtils';

const App = () => {
    const canvasRef = useRef(null);
    const [saveUrl, setSaveUrl] = useState(null);
    const [objList, setObjList] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(0);
    const [glAttr, setGlAttr] = useState(null);
    const [withImageTexture, setImageTexture] = useState(true);

    const createNewObject = (model, name, anchorPoint) => {
        const obj = new GLObject(model, name, anchorPoint);
        console.log("done create with id : ", obj.id);
        obj.setPosition(0, 0, 0);
        obj.setRotation(0, 0, 0);
        obj.setScale(1, 1, 1);
        objList.push(obj);
        setObjList(objList);
    };

    const loadProgram = (gl, texture) => {
        const shaderProgram = !withImageTexture ? initShaderProgram(gl) : initShaderProgramWithTexture(gl);
        
        const programInfo = 
        !withImageTexture ? {
            withTexture: false,
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
        } : {
            imageTexture: texture,
            withTexture: true,
            program: shaderProgram,
            attribLocations: {
              vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
              textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            },
            uniformLocations: {
              projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            //   modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
              resolutionMatrix: gl.getUniformLocation(shaderProgram, 'uResolution'),
              uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            },
        };

        setGlAttr({
            gl: gl,
            programInfo: programInfo,
        });

        return programInfo;
    }

    useEffect(() => {
        createNewObject(balok(0, 100, 0, 100, 0, 100), "badan", [0, 0, 0]);
        createNewObject(balok(100, 300, 40, 60, 40, 60), "tangan kanan", [0, 0, 0]);
        createNewObject(balok(-200, 0, 40, 60, 40, 60), "tangan kiri", [0, 0, 0]);

        // console.log(objList);

        objList[0].addChild(objList[1]);
        objList[0].addChild(objList[2]);

        // const sphereMesh = createSphere()

        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        let texture;
        if (withImageTexture) {
            texture = loadTexture(gl, smiley);
        }

        const programInfo = loadProgram(gl, texture);

        renderScene(gl, programInfo, objList);
    }, []);

    const handleX = (angle) => {
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

    const handleTranslate = (coef) => {
        renderScene(glAttr.gl, glAttr.programInfo, objList);
    }

    const changeSelectedObjectId = (e) => {
        setSelectedObjectId(e.target.value);
    }

    const applyImageTexture = () => {
        console.log("hello");
        setImageTexture(!withImageTexture);

        let texture;
        if (withImageTexture) {
            texture = loadTexture(glAttr.gl, smiley);
        }

        const programInfo = loadProgram(glAttr.gl, texture);

        renderScene(glAttr.gl, programInfo, objList);
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
                <Slider min={-50} max={50} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId]} onChange={handleTranslate}/>
                <button onClick={applyImageTexture}>Apply image texture</button>
                {/* <img width={200} height={200} src={img} /> */}
            </div>
        </div>
    )
}

export default App;
