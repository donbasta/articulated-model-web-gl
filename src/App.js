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
    const [depth, setDepth] = useState(-2);
    // const [playAnimation, setPlayAnimation] = useState(false);
    let playAnimation = false;
    // let animasiObject = [];
    const [animasiObject, setAnimasiObject] = useState([]);

    const createNewObject = (model, name, anchorPoint, position, rotation) => {
        const obj = new GLObject(model, name, anchorPoint);
        // console.log("done create with id : ", obj.id);
        obj.setPosition(position[0], position[1], position[2]);
        obj.setRotation(rotation[0], rotation[1], rotation[2]);
        obj.setScale(1, 1, 1);
        objList.push(obj);
        setObjList(objList);
    }

    useEffect(() => {

        // ===================== UNCOMMENT UNTUK MEMULAI MODELING, SETELAH SELESAI SAVE UNTUK MENJADI JSON ===============
        // ===================== COMMENT DAN LOAD FILE SAVE, UNTUK MELIHAT APAKAH SESIMPAN ===============================
        // createNewObject(balok(0, 400, 0, 400, 0, 200), "badan", [200, 200, 100], [0, 0, 0], [0,180,0]);
        // createNewObject(balok(0, 300, 0, 200, 0, 190), "kepala", [150, 100, 95], [200, 500, 100], [360, 180, 180]);
        // createNewObject(balok(0, 100, 0, 100, 0, 10), "telinga kiri", [100, 0, 5], [25, 50, 50], [0, 180, 180]);
        // createNewObject(balok(0, 100, 0, 100, 0, 10), "telinga kanan", [0, 0, 5], [275, 50, 50], [0, 180, 180]);
        // createNewObject(balok(0, 200, 0, 100, 0, 50), "mulut", [100, 75, 25], [150, 125, 200], [0, 180, 180]);
        // createNewObject(balok(0, 250, 0, 100, 0, 150), "tangan kiri", [250, 50, 75], [50, 345, 100], [0, 270, 180]);
        // createNewObject(balok(0, 250, 0, 100, 0, 150), "tangan kanan", [0, 50, 75], [350, 345, 100], [0, 90, 180]);
        // createNewObject(balok(0, 250, 0, 100, 0, 150), "kaki kiri", [250, 50, 75], [50, 55, 100], [0, 270, 180]);
        // createNewObject(balok(0, 250, 0, 100, 0, 150), "kaki kanan", [0, 50, 75], [350, 55, 100], [0, 90, 180]);
        
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

        renderScene(gl, programInfo, objList, depth);
    }, []);

    const handleX = (angle) => {
        // console.log(objList);
        objList[selectedObjectId].rotateXObj(parseInt(angle));
        renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
    };

    const handleY = (angle) => {
        objList[selectedObjectId].rotateYObj(parseInt(angle));
        renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
    };

    const handleZ = (angle) => {
        objList[selectedObjectId].rotateZObj(parseInt(angle));
        renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
    };

    const handleZoom = (coef) => {
        objList[selectedObjectId].scaleObj(coef, coef, coef);
        renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
    }

    const handleTranslateX = (coef) => {
        const obj = objList[selectedObjectId];
        const current = obj.position;
        obj.translateObj(coef, current[1], current[2]);
        renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
    }

    const handleTranslateY = (coef) => {
        const obj = objList[selectedObjectId];
        const current = obj.position;
        obj.translateObj(current[0], coef, current[2]);
        renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
    }
    
    const handleTranslateZ = (coef) => {
        const obj = objList[selectedObjectId];
        const current = obj.position;
        obj.translateObj(current[0], current[1], coef);
        renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
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
        let clone = JSON.parse(JSON.stringify(objList));
        let childs = [];
        clone.forEach(obj => {
            let arr =[];
            obj.childs.forEach( e => {
                arr.push(e.id)
            })
            obj.childs = [];
            childs.push(arr)
        });
        let data = {
            objList : clone,
            childs : childs,
            animasi : animasiObject
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
                glObject.setPosition(position[0], position[1], position[2]);
                glObject.setRotation(rotation[0], rotation[1], rotation[2]);
                glObject.setScale(scale[0], scale[1], scale[2]);
               
                objList.push(glObject);
            });
            for (let i = 0; i < data.childs.length; i++) {
                const childs = data.childs[i];
                childs.forEach(element => { 
                    objList[i].addChild(objList[element]);
                });
            }
            callback(objList, data.animasi);
        });
        reader.readAsDataURL(file);
    };

    const handleLoad = (e) => {
        // console.log(e.target);
        const callback = (list, animasiList) => {
            setObjList(list);
            renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
            setAnimasiObject(animasiList);
        }
        loadObject(e.target.files[0], callback);
        // setSelectedObjectId(e.target.value);
    }

    const changeCameraDepth = (e) => {
        setDepth(e.target.value);
        // console.log("INI DEPTH ", depth);
        renderScene(glAttr.gl, glAttr.programInfo, objList, e.target.value);
    }

    const playAnimasi = () => {
        playAnimation = !playAnimation;
        if (playAnimation) {
            requestAnimationFrame(render);
        }
    }

    const lerp = (a, b, t) => {
        let hasilFloor = Math.floor(t);
        let sisaBagi = t % 1;
        if (hasilFloor % 2 == 1) {
            return a * sisaBagi + b * (1 - sisaBagi);
        }
        return b * sisaBagi + a * (1 - sisaBagi);
    }
    const positionNow = (now, animasiBadan) => {
        return [
            lerp(animasiBadan.start[0], animasiBadan.end[0], now/animasiBadan.duration),
            lerp(animasiBadan.start[1], animasiBadan.end[1], now/animasiBadan.duration),
            lerp(animasiBadan.start[2], animasiBadan.end[2], now/animasiBadan.duration)
        ];
    }

    const render = (now) => {
        if (playAnimation) {
            for (let i = 0; i < objList.length; i++) {
                let stateNow = positionNow(now, animasiObject[i]);
                objList[i].rotateXObj(stateNow[0]);
                objList[i].rotateYObj(stateNow[1]);
                objList[i].rotateZObj(stateNow[2]);
            }
            
            renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
            requestAnimationFrame(render);            
        }
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
                <p> Camera Depth </p>
                <select name="depth"  id="depth" onChange={changeCameraDepth}>
                    <option key={-1} value={-1}>-1</option>
                    <option key={-2} value={-2}>-2</option>
                    <option key={-3} value={-3}>-3</option>
                    <option key={-4} value={-4}>-4</option>
                    <option key={-5} value={-5}>-5</option>
                </select>
                <p> Rotate x-axis </p>
                <Slider min={0} max={360} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].rotation[0]} onChange={handleX}/>
                <p> Rotate y-axis </p>
                <Slider min={0} max={360} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].rotation[1]} onChange={handleY}/>
                <p> Rotate z-axis </p>
                <Slider min={0} max={360} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].rotation[2]} onChange={handleZ}/>
                <p> Scale </p>
                <Slider min={0.01} max={1} value={objList[selectedObjectId] === undefined ? 1 : objList[selectedObjectId].scale[0]} onChange={handleZoom}/>
                <p> Translate x </p>
                <Slider min={-50} max={50} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].position[0]} onChange={handleTranslateX}/>
                <p> Translate Y </p>
                <Slider min={-50} max={50} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].position[1]} onChange={handleTranslateY}/>
                <p> Translate Z </p>
                <Slider min={-50} max={50} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].position[2]} onChange={handleTranslateZ}/>
                <button onClick={saveObject}>Save Object</button>
                <input type="file" id="load" onChange={handleLoad}/>
                <button onClick={playAnimasi}>Animasi</button>
                {/* <button onClick={onOffShader}>Shader</button> */}
                {/* <button onClick={onOffShader}>ENV</button> */}
                {/* <button onClick={onOffShader}>Texture</button> */}
                {/* <button onClick={onOffShader}>Bump</button> */}
            </div>
        </div>
    )
}

export default App;
