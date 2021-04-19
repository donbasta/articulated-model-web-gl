import * as mat4 from './matrix';
import { loadTexture } from './imageTextureUtils';
import { COLOR_VERTEX_SHADER, COLOR_FRAGMENT_SHADER } from './shaders/colorTexture';
import { IMAGE_VERTEX_SHADER, IMAGE_FRAGMENT_SHADER } from './shaders/imageTexture';

const initShaderProgram = (gl) => {
  const vsSource = COLOR_VERTEX_SHADER;
  const fsSource = COLOR_FRAGMENT_SHADER;

  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
    return null
  }

  return shaderProgram
}

const initShaderProgramWithTexture = (gl) => {
  const vsSource = IMAGE_VERTEX_SHADER;
  const fsSource = IMAGE_FRAGMENT_SHADER;

  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
    return null
  }

  return shaderProgram
}

const loadShader = (gl, type, source) => {
    const shader = gl.createShader(type)

    gl.shaderSource(shader, source)
    gl.compileShader(shader)
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader)
      return null
    }
  
    return shader
}

const initBuffersFromObject = (gl, object) => {
  let positions = object.vertexArray;
  let colors = object.colorArray;
  let indices = object.indicesArray;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  const temp = [];
  for(let i = 0; i < positions.length; i++) {
    temp.push(i)
  }
  if (indices === undefined) {
    indices = temp;
  }
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

const initBuffersWithImageTexture = (gl, object) => {
  const positions = object.vertexArray;
  const textures = object.textureArray;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textures), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  const indices = [];
  for(let i = 0; i < positions.length; i++) {
    indices.push(i)
  }
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    texture: textureBuffer,
    indices: indexBuffer,
  };
}

const renderScene = (gl, programInfo, objList) => {
  gl.clearColor(0.5, 0.5, 0.2, 0.8);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (const obj of objList) {
    const objectBuffers = 
      !programInfo.withTexture ? initBuffersFromObject(gl, obj) : initBuffersWithImageTexture(gl, obj);
    drawObject(gl, obj, obj.vertexArray.length / 3, objectBuffers, programInfo);
  }
}

const drawObject = (gl, obj, count, buffers, programInfo) => {

  const projectionMatrix = obj.calcProjectionMatrix();

  gl.useProgram(programInfo.program);
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  if (!programInfo.withTexture)
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexColor
    );
  }

  if (programInfo.withTexture)
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texture);
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord, 
      numComponents,
      type,
      normalize, 
      stride,
      offset
    );
    gl.enableVertexAttribArray(
      programInfo.attribLocations.textureCoord
    );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, programInfo.imageTexture);
    gl.uniform1i(
      programInfo.uniformLocations.uSampler, 0
    );
  }

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );

  gl.uniform3fv(
    programInfo.uniformLocations.resolutionMatrix,
    [gl.canvas.width, gl.canvas.height, 1000],
  );

  {
    const vertexCount = count
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

export {
  initShaderProgram, 
  initShaderProgramWithTexture,
  loadShader, 
  renderScene,
} 