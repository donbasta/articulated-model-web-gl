import React, {useState, useRef, useEffect} from 'react'
import './App.css'
import {renderScene} from './utils'
import {initShaderProgram, createProgramInfo} from './programUtils';
import Slider from './Slider'
import smiley from "./smiley.png";

import { sampleCube } from './sampleCube';
import { createSphere } from './geometry';
import balok from './models/balok';
import GLObject from './GLObject';
import { loadImageTexture } from './imageTextureUtils';
import { loadEnvironmentTexture } from './environmentTextureUtils';

const App = () => {
    const loaded = useRef(false);
    const canvasRef = useRef(null);
    const [saveUrl, setSaveUrl] = useState(null);
    const [objList, setObjList] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(0);
    const [glAttr, setGlAttr] = useState(null);
    const [textureType, setTextureType] = useState("environment");

    const createNewObject = (model, name, anchorPoint) => {
        const obj = new GLObject(model, name, anchorPoint);
        obj.setPosition(0, 0, 0);
        obj.setRotation(0, 0, 0);
        obj.setScale(1, 1, 1);
        objList.push(obj);
        setObjList(objList);
    };

    const loadProgram = (gl, texture) => {
        console.log("fsidjfosij", textureType);
        const shaderProgram = initShaderProgram(textureType, gl);
        const programInfo = createProgramInfo(textureType, shaderProgram, gl, texture);

        setGlAttr({
            gl: gl,
            programInfo: programInfo,
        });

        return programInfo;
    }

    useEffect(() => {
        createNewObject(sampleCube, "tes", [0, 0, 0]);
        const sphereModel = createSphere([0.2, 0.2, 0.2], 0.2, 30, 30);
        // console.log(sphereModel);
        createNewObject(sphereModel, "bola", [1, 0, 0]);
        objList[0].addChild(objList[1]);

        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');

        let texture;
        if (textureType === "image") {
            texture = loadImageTexture(gl, smiley);
        }
        if (textureType === "environment") {
            texture = loadEnvironmentTexture(gl);
        }

        const programInfo = loadProgram(gl, texture);
        console.log(programInfo, "hehe");

        renderScene(gl, programInfo, objList);
    }, []);

    useEffect(() => {
        if (loaded.current) {
            let texture = null;
            if (textureType === "image") {
                texture = loadImageTexture(glAttr.gl, smiley);
            }
            const programInfo = loadProgram(glAttr.gl, texture);
            renderScene(glAttr.gl, programInfo, objList);
        } else {
            loaded.current = true;
        }
    }, [textureType]);

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

    const applyNoTexture = () => {
        setTextureType("default");
    }

    const applyImageTexture = () => {
        setTextureType("image");
    }

    const applyEnvironmentTexture = () => {
        setTextureType("environment");
    }

    const applyBumpTexture = () => {
        setTextureType("bump");
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
                <button className="btn" onClick={applyNoTexture}>Apply no texture</button>
                <button className="btn" onClick={applyImageTexture}>Apply image texture</button>
                <button className="btn" onClick={applyEnvironmentTexture}>Apply environment texture</button>
                <button className="btn" onClick={applyBumpTexture}>Apply bump texture</button>
            </div>
        </div>
    )
}

export default App;
