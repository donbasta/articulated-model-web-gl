// import { mat4 } from 'gl-matrix';
import * as mat4 from './matrix.js';

const initShaderProgramLight = (gl) => {
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec3 aNormalLocation;
    
    uniform vec3 u_lightWorldPosition;
    uniform mat4 u_world;
    //uniform mat4 u_worldViewProjection;
    uniform mat4 u_worldInverseTranspose;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying vec3 v_normal;
    varying vec3 v_surfaceToLight;

    varying lowp vec4 vColor;
    
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      v_normal = mat3(u_worldInverseTranspose) * aNormalLocation;
      vec3 surfaceWorldPosition = (u_world * aVertexPosition).xyz;
      v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
      vColor = aVertexColor;
    }
  `
  const fsSource = `
    precision mediump float;
    varying vec3 v_normal;
    varying vec3 v_surfaceToLight;

    varying lowp vec4 vColor;
    
    void main() {
      vec3 normal = normalize(v_normal);
      vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
      float light = dot(normal, surfaceToLightDirection);
      gl_FragColor = vColor;
      gl_FragColor.rgb *= light;
    }
    `

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

const initShaderProgram = (gl) => {
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
    `
  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
    `

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

const initBuffersLight = (gl, model) => {
  const {positions, colors} = model
  const normals = mat4.generateNormalsFromModel(positions);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    normal: normalBuffer
  };
}

const initBuffers = (gl, model) => {

  // Create a buffer for the cube's vertex positions.

  const {positions, colors} = model
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.
  // Convert the array of colors into a table for all the vertices.
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  const indices = [];
  for(let i = 0; i < positions.length; i++) {
    indices.push(i)
  }

  // Now send the element array to GL
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

// const drawScene = (gl, programInfo, buffers, count, angle, zoom, translate, proj) => {
//   gl.clearColor(0.5, 0.5, 0.2, 0.8);  // Clear to black, fully opaque
//   gl.clearDepth(1.0);                 // Clear everything
//   gl.enable(gl.DEPTH_TEST);           // Enable depth testing
//   gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

//   // Clear the canvas before we start drawing on it.
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//   // Create a perspective matrix, a special matrix that is
//   // used to simulate the distortion of perspective in a camera.
//   // Our field of view is 45 degrees, with a width/height
//   // ratio that matches the display size of the canvas
//   // and we only want to see objects between 0.1 units
//   // and 100 units away from the camera.
//   let projectionMatrix = mat4.getProjectorType('default');
//   if (proj === 'perspective') {
//     const fieldOfView = 45 * Math.PI / 180;   // in radians
//     const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
//     const zNear = 0.1;
//     const zFar = 100.0;
//     projectionMatrix = mat4.perspective(fieldOfView, aspect, zNear, zFar);
//   } else if (proj === 'orthographic') {
//     projectionMatrix = mat4.orthographic(-7, 7, -7, 7, -7, 7);
//   } else if (proj === 'oblique') {
//     projectionMatrix = mat4.oblique(60 * Math.PI / 180, 15 * Math.PI / 180);
//   }
  
//   let modelViewMatrix = mat4.create();

//   modelViewMatrix = mat4.translate(modelViewMatrix, [translate, 0.0, 0.0]);
//   modelViewMatrix = mat4.translate(modelViewMatrix, [-0.0, 0.0, zoom]);
//   modelViewMatrix = mat4.rotate(modelViewMatrix, angle.x * Math.PI / 180, 'x');
//   modelViewMatrix = mat4.rotate(modelViewMatrix, angle.y * Math.PI / 180, 'y');
//   modelViewMatrix = mat4.rotate(modelViewMatrix, angle.z * Math.PI / 180, 'z');

//   {
//     const numComponents = 3;
//     const type = gl.FLOAT;
//     const normalize = false;
//     const stride = 0;
//     const offset = 0;
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
//     gl.vertexAttribPointer(
//         programInfo.attribLocations.vertexPosition,
//         numComponents,
//         type,
//         normalize,
//         stride,
//         offset);
//     gl.enableVertexAttribArray(
//         programInfo.attribLocations.vertexPosition);
//   }

//   // Tell WebGL how to pull out the colors from the color buffer
//   // into the vertexColor attribute.
//   {
//     const numComponents = 4;
//     const type = gl.FLOAT;
//     const normalize = false;
//     const stride = 0;
//     const offset = 0;
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
//     gl.vertexAttribPointer(
//         programInfo.attribLocations.vertexColor,
//         numComponents,
//         type,
//         normalize,
//         stride,
//         offset);
//     gl.enableVertexAttribArray(
//         programInfo.attribLocations.vertexColor);
//   }

//   // Tell WebGL which indices to use to index the vertices
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

//   // Tell WebGL to use our program when drawing
//   gl.useProgram(programInfo.program);

//   // Set the shader uniforms
//   gl.uniformMatrix4fv(
//       programInfo.uniformLocations.projectionMatrix,
//       false,
//       projectionMatrix);
//   gl.uniformMatrix4fv(
//       programInfo.uniformLocations.modelViewMatrix,
//       false,
//       modelViewMatrix);

//   {
//     const vertexCount = count
//     const type = gl.UNSIGNED_SHORT;
//     const offset = 0;
//     gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
//   }
// }

const drawScene = (gl, programInfo, buffers, count, angle, zoom, translate, proj) => {
  gl.clearColor(0.5, 0.5, 0.2, 0.8);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let projectionMatrix = mat4.getProjectorType('default');
  if (proj === 'perspective') {
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    projectionMatrix = mat4.perspective(fieldOfView, aspect, zNear, zFar);
  } else if (proj === 'orthographic') {
    projectionMatrix = mat4.orthographic(-7, 7, -7, 7, -7, 7);
  } else if (proj === 'oblique') {
    projectionMatrix = mat4.oblique(60 * Math.PI / 180, 15 * Math.PI / 180);
  }
  
  let modelViewMatrix = mat4.create();

  modelViewMatrix = mat4.translate(modelViewMatrix, [translate, 0.0, 0.0]);
  modelViewMatrix = mat4.translate(modelViewMatrix, [-0.0, 0.0, zoom]);
  modelViewMatrix = mat4.rotate(modelViewMatrix, angle.x * Math.PI / 180, 'x');
  modelViewMatrix = mat4.rotate(modelViewMatrix, angle.y * Math.PI / 180, 'y');
  modelViewMatrix = mat4.rotate(modelViewMatrix, angle.z * Math.PI / 180, 'z');

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
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  if (programInfo.withLight === true) {
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
      gl.vertexAttribPointer(
          programInfo.attribLocations.normalLocation,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.normalLocation);
    }

    const worldMatrix = mat4.create();
    const worldInverseMatrix = mat4.inverse(worldMatrix);
    const worldInverseTransposeMatrix = mat4.transpose(worldInverseMatrix);

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.worldInverseTransposeLocation,
      false, 
      worldInverseTransposeMatrix
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.worldLocation, 
      false, 
      worldMatrix
    );
    
    gl.uniform3fv(programInfo.uniformLocations.lightWorldPositionLocation, [20, 30, 60]);
  }


  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const vertexCount = count
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}


export {initShaderProgramLight, initBuffersLight, initShaderProgram, loadShader, initBuffers, drawScene}