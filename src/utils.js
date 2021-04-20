import { loadEnvironmentTexture } from './environmentTextureUtils';
import * as mat4 from './matrix';
import * as samps from './samples';

const initBuffersFromObject = (gl, object) => {
  const positions = object.vertexArray;
  const colors = object.colorArray;
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

const initBuffersWithEnvironmentTexture = (gl, object, texture) => {
  const normals = object.normalArray || samps.normals;
  const positions = object.vertexArray || samps.positions;
  const textures = texture;
  let indices = object.indexArray;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

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
    normal: normalBuffer,
    texture: textures,
    index: indexBuffer,
  }
}

const renderScene = (gl, programInfo, objList, depth) => {
  gl.clearColor(0.5, 0.5, 0.2, 0.8); 
  gl.clearDepth(1.0);                 
  gl.enable(gl.DEPTH_TEST);          
  gl.depthFunc(gl.LEQUAL);            

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (const obj of objList) {
    let objectBuffers;
    switch (programInfo.textureType) {
      case "image":
        objectBuffers = initBuffersWithImageTexture(gl, obj);
        drawObject(gl, obj, obj.vertexArray.length / 3, objectBuffers, programInfo, depth);
        break;
      case "environment":
        objectBuffers = initBuffersWithEnvironmentTexture(gl, obj, programInfo.environmentTexture, depth);
        const count = obj.indexArray !== undefined ? obj.indexArray.length : obj.vertexArray.length / 3;
        // const count = obj.positionArray.length / 3;
        drawObjectEnvironmentShaders(gl, obj, count, objectBuffers, programInfo);
        break;
      default:
        objectBuffers = initBuffersFromObject(gl, obj);
        drawObject(gl, obj, obj.vertexArray.length / 3, objectBuffers, programInfo, depth);
    }
  }
}

const drawObjectEnvironmentShaders = (gl, obj, count, buffers, programInfo, depth) => {
  gl.useProgram(programInfo.program);

  const fieldOfViewRadians = degToRad(60);
  // const modelXRotationRadians = degToRad(0 + obj.rotation[0]);
  // const modelYRotationRadians = degToRad(0 + obj.rotation[1]);
  // const modelZRotationRadians = degToRad(0 + obj.rotation[2]);

  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projectionMatrix = mat4.perspective(fieldOfViewRadians, aspect, 1, 2000);
  
  // const A = Math.sin(modelXRotationRadians);
  // const B = Math.cos(modelXRotationRadians);

  const cameraPosition = [0, 0, 2];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const cameraMatrix = mat4.lookAt(cameraPosition, target, up);
  const viewMatrix = mat4.inverse(cameraMatrix);
  // const worldMatrix = mat4.create();
  const transformationMatrix = mat4.create(); 
  const worldMatrix = obj.calcProjectionMatrix();
  // let worldMatrix = mat4.rotateXMatrix(modelXRotationRadians);
  // worldMatrix = mat4.rotate(worldMatrix, modelYRotationRadians, "y");
  // worldMatrix = mat4.rotate(worldMatrix, modelZRotationRadians, "z");

  // let transformationMatrix = mat4.rotateXMatrix(modelXRotationRadians);
  // transformationMatrix = mat4.rotate(transformationMatrix, modelYRotationRadians, "y");
  // transformationMatrix = mat4.rotate(transformationMatrix, modelZRotationRadians, "z");

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.positionLocation,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.positionLocation);
  }
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
      offset
    );
    gl.enableVertexAttribArray(
      programInfo.attribLocations.normalLocation
    )
  }

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.transormationLocation,
    false,
    transformationMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionLocation, 
    false, 
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.viewLocation, 
    false, 
    viewMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.worldLocation, 
    false, 
    worldMatrix
  );
  gl.uniform3fv(
    programInfo.uniformLocations.worldCameraPositionLocation, 
    cameraPosition
  );

  gl.uniform1i(
    programInfo.uniformLocations.textureLocation, 
    0
  );

  {
    const vertexCount = count
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

const drawObject = (gl, obj, count, buffers, programInfo, depth) => {
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

  if (programInfo.textureType === "default")
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

  if (programInfo.textureType === "image")
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

  let cameraMatrix = mat4.getProjectorType('perspective');
  cameraMatrix = mat4.translate(cameraMatrix, [0, 0, depth]);
  // console.log("ini jancok",cameraMatrix);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.cameraMatrix,
    false,
    cameraMatrix
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
  renderScene
} 

const degToRad = (theta) => {
  return theta * Math.PI / 180.0;
}