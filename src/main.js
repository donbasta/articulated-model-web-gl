let gl;
let program;

// create gl context and program when the page loads
const start = () => {

    console.log("test masuk");

    canvas = document.getElementById("draw-shape");
    gl = canvas.getContext("experimental-webgl");
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    program = createProgram(gl, "vertex", "fragment");
}

// compile shader
const compileShader = (gl, shader, shaderType) => {
    let s = gl.createShader(shaderType);

    gl.shaderSource(s, shader);
    gl.compileShader(s);

    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw "Couldn't compile shader: " + gl.getShaderInfoLog(shader);
    }
    return s;
}

// initialize shader
const initShader = (gl, shaderId) => {
    let shader = document.getElementById(shaderId);
    if (!shader) {
        throw ("Unknown script element " + scriptId);
    }

    let shaderType;
    if (shader.type == "x-shader/x-vertex") {
        shaderType = gl.VERTEX_SHADER;
    }
    else if (shader.type == "x-shader/x-fragment") {
        shaderType = gl.FRAGMENT_SHADER;
    }
    else {
        throw ("Shader type undefined");
    }

    return compileShader(gl, shader.text, shaderType);
}

// create gl program
const createProgram = (gl, vertexId, fragmentId) => {
    let vertexShader = initShader(gl, vertexId);
    let fragmentShader = initShader(gl, fragmentId);

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw ("Failed to link " + gl.getProgramInfoLog(program));
    }

    return program;
}

// render all shape into canvas
const render = () => {
    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const identityMat = identityMatrix(4);
    const mat = gl.getUniformLocation(program, "formMatrix");

    gl.useProgram(program);
    gl.uniformMatrix4fv(mat, false, identityMat);

    test();
}

const test2 = () => {
    console.log("TBD");
}

const test1 = () => {
    objectList = [];

    console.log("tesuto");

    const glObject = new GLObject("kubus 1", program, gl);
    glObject.setVertexArray(testData1)
    glObject.setAnchorPoint([0, 0, 0], 3);
    glObject.setPosition(200, 200, 0);
    glObject.setRotation(0, 45, 0);
    glObject.setScale(1, 1, 1);
    glObject.bind();

    const glObject2 = new GLObject("kubus 2", shaderProgram, gl);
    glObject2.setVertexArray(testData1);
    glObject2.setAnchorPoint([100,100,100], 3);
    glObject2.setPosition(0,0,0);
    glObject2.setRotation(0,0,0);
    glObject2.setScale(1,1,1);
    glObject2.bind();

    // const glObject3 = new GLObject(2, shaderProgram, gl);
    // glObject3.setVertexArray(testData1);
    // glObject3.setAnchorPoint([100,100,100], 3);
    // glObject3.setPosition(0,0,0);
    // glObject3.setRotation(0,0,0);
    // glObject3.setScale(1,1,1);
    // glObject3.bind();

    // const glObject4 = new GLObject(3, shaderProgram, gl);
    // glObject4.setVertexArray(testData1);
    // glObject4.setAnchorPoint([100,100,100], 3);
    // glObject4.setPosition(0,0,0);
    // glObject4.setRotation(0,0,0);
    // glObject4.setScale(1,1,1);
    // glObject4.bind();

    // glObject3.addChild(glObject4);
    // glObject2.addChild(glObject3);
    glObject.addChild(glObject2);

    objectList.push(glObject);
    objectList.push(glObject2);
    // objectList.push(glObject3);
    // objectList.push(glObject4);

    for (const obj of objectList) {
        obj.draw();
    }
}