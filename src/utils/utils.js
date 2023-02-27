import * as mat4 from '../math/matrix';
import * as samps from '../samples';

const FIELD_OF_VIEW_DEG = 60;

const initBuffersFromObject = (gl, object) => {
  const positions = object.vertexArray;
  const colors = object.colorArray;
  let indices = object.indexArray;

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
    index: indexBuffer,
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
    index: indexBuffer,
  };
}

const initBuffersWithBumpTexture = (gl, object) => {
  const normals = object.normalArray || samps.normals;
  const positions = object.vertexArray || samps.positions;
  const textures = object.textureArray;
  let indices = object.indexArray;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textures), gl.STATIC_DRAW);

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
    texture: textureBuffer,
    index: indexBuffer,
  }
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
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clearDepth(1.0);                 
  gl.enable(gl.DEPTH_TEST);          
  gl.depthFunc(gl.LEQUAL);

  for (const obj of objList) {
    let objectBuffers;
    const count = obj.indexArray !== undefined ? obj.indexArray.length : obj.vertexArray.length / 3;
    switch (programInfo.textureType) {
      case "image":
        objectBuffers = initBuffersWithImageTexture(gl, obj);
        drawObject(gl, obj, count, objectBuffers, programInfo, depth);
        break;
      case "environment":
        objectBuffers = initBuffersWithEnvironmentTexture(gl, obj, programInfo.environmentTexture);
        drawObjectEnvironmentShaders(gl, obj, count, objectBuffers, programInfo, depth);
        break;
      case "bump":
        objectBuffers = initBuffersWithBumpTexture(gl, obj);
        drawObjectBumpShaders(gl, obj, count, objectBuffers, programInfo, depth);
        break;
      default:
        objectBuffers = initBuffersFromObject(gl, obj);
        drawObject(gl, obj, count, objectBuffers, programInfo, depth);
    }
  }
}

const drawObjectBumpShaders = (gl, obj, count, buffers, programInfo, depth) => {
  gl.useProgram(programInfo.program);

  const fieldOfViewRadians = degToRad(FIELD_OF_VIEW_DEG);

  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projectionMatrix = mat4.perspective(fieldOfViewRadians, aspect, 1, 2000);

  const cameraPosition = [0, 0, 2];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const cameraMatrix = mat4.lookAt(cameraPosition, target, up);
  let viewMatrix = mat4.inverse(cameraMatrix);
  viewMatrix = mat4.translate(viewMatrix, [0, 0, depth]);
  const transformationMatrix = mat4.create();
  const worldMatrix = obj.calcProjectionMatrix();
  const normalMatrix = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ];
  const lightPosition = [5, 5, 5, 5];
  const normalVec4 = [1, 0, 0, 0];

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
      offset
    );
    gl.enableVertexAttribArray(
      programInfo.attribLocations.positionLocation
    );
  }
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
    gl.bindTexture(gl.TEXTURE_2D, programInfo.bumpTexture);
    gl.uniform1i(
      programInfo.uniformLocations.uSampler, 0
    );
  }

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.transformationLocation,
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
  gl.uniformMatrix3fv(
    programInfo.uniformLocations.normalMatrixLocation,
    false,
    normalMatrix
  );
  gl.uniform4fv(
    programInfo.uniformLocations.lightPosition,
    lightPosition
  );
  gl.uniform4fv(
    programInfo.uniformLocations.diffuseProduct,
    [10.0, 69.0, 20.0, 1.0]
  );
  gl.uniform4fv(
    programInfo.uniformLocations.normalLocation,
    normalVec4
  );
  
  {
    const vertexCount = count
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

const drawObjectEnvironmentShaders = (gl, obj, count, buffers, programInfo, depth) => {
  gl.useProgram(programInfo.program);

  const fieldOfViewRadians = degToRad(FIELD_OF_VIEW_DEG);

  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projectionMatrix = mat4.perspective(fieldOfViewRadians, aspect, 1, 2000);

  const cameraPosition = [0, 0, 2];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const cameraMatrix = mat4.lookAt(cameraPosition, target, up);
  let viewMatrix = mat4.inverse(cameraMatrix);
  viewMatrix = mat4.translate(viewMatrix, [0, 0, depth]);
  const transformationMatrix = mat4.create();
  const worldMatrix = obj.calcProjectionMatrix();
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
    programInfo.uniformLocations.transformationLocation,
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
  gl.useProgram(programInfo.program);

  const fieldOfViewRadians = degToRad(FIELD_OF_VIEW_DEG);

  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projectionMatrix = mat4.perspective(fieldOfViewRadians, aspect, 1, 2000);

  const cameraPosition = [0, 0, 2];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const cameraMatrix = mat4.lookAt(cameraPosition, target, up);
  let viewMatrix = mat4.inverse(cameraMatrix);
  viewMatrix = mat4.translate(viewMatrix, [0, 0, depth]);
  const transformationMatrix = mat4.create();
  const worldMatrix = obj.calcProjectionMatrix();

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
    programInfo.uniformLocations.transformationLocation,
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
