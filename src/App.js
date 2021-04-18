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

    const createNewObject = (model, name, anchorPoint, position, rotation) => {
        const obj = new GLObject(model, name, anchorPoint);
        console.log("done create with id : ", obj.id);
        obj.setPosition(position[0], position[1], position[2]);
        obj.setRotation(rotation[0], rotation[1], rotation[2]);
        obj.setScale(1, 1, 1);
        objList.push(obj);
        setObjList(objList);
    }

    useEffect(() => {

        // ===================== UNCOMMENT UNTUK MEMULAI MODELING, SETELAH SELESAI SAVE UNTUK MENJADI JSON ===============
        // ===================== COMMENT DAN LOAD FILE SAVE, UNTUK MELIHAT APAKAH SESIMPAN ===============================
        // createNewObject(balok(0, 400, 0, 400, 0, 200), "badan", [200, 200, 100], [0, 0, 0], [0,0,0]);
        // createNewObject(balok(0, 300, 0, 200, 0, 190), "kepala", [150, 100, 95], [200, 500, 100], [360, 180, 180]);
        // createNewObject(balok(0, 100, 0, 100, 0, 10), "telinga kiri", [100, 0, 5], [25, 50, 50], [0, 180, 180]);
        // createNewObject(balok(0, 100, 0, 100, 0, 10), "telinga kanan", [0, 0, 5], [275, 50, 50], [0, 180, 180]);
        // createNewObject(balok(0, 200, 0, 100, 0, 50), "mulut", [100, 75, 25], [150, 125, 200], [0, 180, 180]);

        
        // createNewObject(balok(0, 250, 0, 100, 0, 150), "tangan kiri", [250, 50, 75], [50, 345, 100], [0, 270, 180]);
        // createNewObject(balok(0, 250, 0, 100, 0, 150), "tangan kanan", [0, 50, 75], [350, 345, 100], [0, 90, 180]);
        // createNewObject(balok(0, 250, 0, 100, 0, 150), "kaki kiri", [250, 50, 75], [50, 55, 100], [0, 270, 180]);
        // createNewObject(balok(0, 250, 0, 100, 0, 150), "kaki kanan", [0, 50, 75], [350, 55, 100], [0, 90, 180]);
        
        // // createNewObject(balok(0, 100, 0, 100, 0, 10), "telinga kanan", [50, 50, 5], [325, 0, 50], [180, 180, 180]);
        // // createNewObject(balok(0, 100, 0, 100, 0, 10), "telinga kiri", [50, 50, 5], [-25, 0, 50], [180, 180, 180]);
        
        
        // objList[0].addChild(objList[1]);
        // objList[1].addChild(objList[2]);
        // objList[1].addChild(objList[3]);
        // objList[1].addChild(objList[4]);
        // objList[0].addChild(objList[5]);
        // objList[0].addChild(objList[6]);
        // objList[0].addChild(objList[7]);
        // objList[0].addChild(objList[8]);
        // console.log(objList);
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

    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    
    const saveObject = () => {
        let childs = [];
        objList.forEach(obj => {
            let arr =[];
            obj.childs.forEach( e => {
                arr.push(e.id)
            })
            childs.push(arr)
        });
        let data = {
            objList : objList,
            childs : childs
        }
        let jsonData = JSON.stringify(data);
        download(jsonData, 'model.json', 'text/plain');
    }

    const loadObject = (file, callback) => {
        if (file.type && file.type.indexOf('json') === -1) {
            console.log('File is not an JSON.', file.type, file);
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            let data = JSON.parse(atob(event.target.result.toString().match(/(?<=base64,).*/).toString()));
            setObjList([])
            data.objList.forEach(obj => {
                const balok = {
                    positions : obj.vertexArray,
                    colors : obj.colorArray
                }
                const glObject = new GLObject(balok, obj.name, obj.anchorPoint);
                const position = obj.position;
                const rotation = obj.rotation;
                const scale = obj.scale;

                glObject.setParentTransformationMatrix(obj.parentTransformationMatrix);
                // obj.setTransformMat(obj.transformMat);
                // obj.localTransProjectionMat
                // obj.projectionMat
                glObject.setPosition(position[0], position[1], position[2]);
                // obj.translateMat3
                glObject.setRotation(rotation[0], rotation[1], rotation[2]);
                // obj.rotationX
                // obj.rotationY
                // obj.rotationZ
                glObject.setScale(scale[0], scale[1], scale[2]);
                // obj.scaleMat3
                // obj.anchorPointmat
                // obj.rotateMat3

                objList.push(glObject);
                // setObjList(objList);
            });
            // console.log(list)
            for (let i = 0; i < data.childs.length; i++) {
                const childs = data.childs[i];
                childs.forEach(element => { 
                    console.log("INI ELEMENT" , element)
                    objList[i].addChild(objList[element]);
                });
            }
            callback(objList);
        });
        reader.readAsDataURL(file);
    };

    const handleLoad = (e) => {
        console.log(e.target);
        const callback = (list) => {
            setObjList(list);
            renderScene(glAttr.gl, glAttr.programInfo, objList);
            
            // objList = list;
            console.log("INI LIST", list);
            console.log("INI OBJ LIST\n", objList);

        }
        loadObject(e.target.files[0], callback);
        // setSelectedObjectId(e.target.value);
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
                <button onClick={saveObject}>Save Object</button>
                <input type="file" id="load" onChange={handleLoad}/>
                {/* <button onClick={loadObject}>Load Object</button> */}
            </div>
        </div>
    )
}

export default App;
