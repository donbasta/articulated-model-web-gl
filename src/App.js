import React, {useState, useRef, useEffect} from 'react'
import './App.css'
import {renderScene} from './utils/utils'
import {initShaderProgram, createProgramInfo} from './utils/programUtils';
import Slider from './components/Slider'
import smiley from "./smiley.png";

import GLObject from './GLObject';
import { loadImageTexture } from './utils/imageTextureUtils';
import { loadEnvironmentTexture } from './utils/environmentTextureUtils';

const App = () => {
    const loaded = useRef(false);
    const canvasRef = useRef(null);
    const [objList, setObjList] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(0);
    const [glAttr, setGlAttr] = useState(null);
    const [textureType, setTextureType] = useState("default");
    const [depth, setDepth] = useState(-2);
    let playAnimation = false;
    const [animasiObject, setAnimasiObject] = useState([
        {
            start: [
                0,
                0,
                0
            ],
            end: [
                0,
                0,
                0
            ],
            duration: 1000,
            baf: true
        },
        {
            start: [
                0,
                0,
                0
            ],
            end: [
                0,
                0,
                0
            ],
            duration: 1000,
            baf: true
        },
        {
            start: [
                0,
                0,
                0
            ],
            end: [
                0,
                0,
                0
            ],
            duration: 1000,
            baf: true
        },
        {
            start: [
                0,
                0,
                0
            ],
            end: [
                0,
                0,
                0
            ],
            duration: 1000,
            baf: true
        },
        {
            start: [
                0,
                -20,
                0
            ],
            end: [
                0,
                20,
                0
            ],
            duration: 1000,
            baf: true
        },
        {
            start: [
                0,
                -20,
                0
            ],
            end: [
                0,
                20,
                0
            ],
            duration: 1000,
            baf: true
        },
        {
            start: [
                0,
                0,
                -20
            ],
            end: [
                0,
                0,
                20
            ],
            duration: 1000,
            baf: true
        },
        {
            start: [
                0,
                0,
                200
            ],
            end: [
                0,
                0,
                160
            ],
            duration: 1000,
            baf: true
        },
        {
            start: [
                0,
                0,
                20
            ],
            end: [
                0,
                0,
                0
            ],
            duration: 1000,
            baf: true
        },{
            start: [
                0,
                0,
                -20
            ],
            end: [
                0,
                0,
                0
            ],
            duration: 1000,
            baf: true
        }
    ]);

    const createNewObject = (model, name, anchorPoint, position, rotation) => {
        const obj = new GLObject(model, name, anchorPoint);
        obj.setPosition(position[0], position[1], position[2]);
        obj.setRotation(rotation[0], rotation[1], rotation[2]);
        obj.setScale(1, 1, 1);
        objList.push(obj);
        setObjList(objList);
    };

    const loadProgram = (gl, texture) => {
        const shaderProgram = initShaderProgram(textureType, gl);
        const programInfo = createProgramInfo(textureType, shaderProgram, gl, texture);
        setGlAttr({
            gl: gl,
            programInfo: programInfo,
        });
        return programInfo;
    }

    useEffect(() => {
        
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');

        let texture;
        if (textureType === "image") {
            texture = loadImageTexture(gl, smiley);
        }
        if (textureType === "environment") {
            texture = loadEnvironmentTexture(gl);
        }
        if (textureType === "bump") {
            texture = loadImageTexture(gl, smiley);
        }

        const programInfo = loadProgram(gl, texture);

        renderScene(gl, programInfo, objList, depth);
    }, []);

    useEffect(() => {
        if (loaded.current) {
            let texture = null;
            if (textureType === "image") {
                texture = loadImageTexture(glAttr.gl, smiley);
            }
            if (textureType === "environment") {
                texture = loadEnvironmentTexture(glAttr.gl);
            }
            const programInfo = loadProgram(glAttr.gl, texture);
            renderScene(glAttr.gl, programInfo, objList, depth);
        } else {
            loaded.current = true;
        }
    }, [textureType]);

    const handleX = (angle) => {
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

    const handleTranslateX = (coef) => {
        const obj = objList[selectedObjectId];
        const current = obj.position;
        obj.translateObj(coef / 100, current[1], current[2]);
        renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
    }

    const handleTranslateY = (coef) => {
        const obj = objList[selectedObjectId];
        const current = obj.position;
        obj.translateObj(current[0], coef / 100, current[2]);
        renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
    }
    
    const handleTranslateZ = (coef) => {
        const obj = objList[selectedObjectId];
        const current = obj.position;
        obj.translateObj(current[0], current[1], coef / 100);
        renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
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

    const download = (content, fileName, contentType) => {
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
        let jsonData = JSON.stringify(data, undefined, 4);
        download(jsonData, 'model.json', 'application/json');
    }

    const loadObject = (file, callback) => {
        if (file.type && file.type.indexOf('json') === -1) {
            alert('File is not an JSON.', file.type, file);
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            let data = JSON.parse(atob(event.target.result.toString().match(/(?<=base64,).*/).toString()));
            setObjList([])
            data.objList.forEach(obj => {
                const balok = {
                    positions : obj.vertexArray,
                    colors : obj.colorArray,
                    indices: obj.indexArray,
                    normals: obj.normalArray,
                    textures: obj.textureArray,
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
    }

    const handleLoad = (e) => {
        const callback = (list, animasiList) => {
            setObjList(list);
            renderScene(glAttr.gl, glAttr.programInfo, objList, depth);
            setAnimasiObject(animasiList);
        }
        loadObject(e.target.files[0], callback);
    }

    const changeCameraDepth = (e) => {
        setDepth(e.target.value);
        renderScene(glAttr.gl, glAttr.programInfo, objList, e.target.value);
    }

    const playAnimasi = () => {
        // setPlayAnimation(!playAnimation);
        playAnimation = !playAnimation;
        if (playAnimation) {
            requestAnimationFrame(render);
        }
    }

    const lerp = (a, b, t, baf) => {
        let hasilFloor = Math.floor(t);
        let sisaBagi = t % 1;
        if (hasilFloor % 2 === 1 && baf) {
            return a * sisaBagi + b * (1 - sisaBagi);
        }
        return b * sisaBagi + a * (1 - sisaBagi);
    }
    
    const positionNow = (now, animasiObj) => {
        return [
            lerp(animasiObj.start[0], animasiObj.end[0], now/animasiObj.duration, animasiObj.baf),
            lerp(animasiObj.start[1], animasiObj.end[1], now/animasiObj.duration, animasiObj.baf),
            lerp(animasiObj.start[2], animasiObj.end[2], now/animasiObj.duration, animasiObj.baf)
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
            <canvas ref={canvasRef} width="1000" height="500"></canvas>
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

                <p> Translate x </p>
                <Slider min={-500} max={500} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].position[0]} onChange={handleTranslateX}/>
                <p> Translate Y </p>
                <Slider min={-500} max={500} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].position[1]} onChange={handleTranslateY}/>
                <p> Translate Z </p>
                <Slider min={-500} max={500} value={objList[selectedObjectId] === undefined ? 0 : objList[selectedObjectId].position[2]} onChange={handleTranslateZ}/>

                <div style={{textAlign: "center"}}>

                    <button className="btn" onClick={applyNoTexture}>Apply no texture</button>
                    <button className="btn" onClick={applyImageTexture}>Apply image texture</button>
                    <button className="btn" onClick={applyEnvironmentTexture}>Apply environment texture</button>
                    <button className="btn" onClick={applyBumpTexture}>Apply bump texture</button>

                    <button className="btn" onClick={saveObject}>Save Object</button>
                    <input type="file" id="load" onChange={handleLoad}/>
                    <button className="btn" onClick={playAnimasi}>Animasi</button>

                </div>
            </div>
        </div>
    )
}

export default App;
