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

    let articulatedModel = Model();

    articulatedModel.draw();
}

// save all shapes into .csv external files
const saveShapes = () => {

}

// load shape
const loadShapes = (text) => {

}

// Load external file into canvas
const load = () => {

}

// load button enabler disabler
const checkLoad = () => {

}