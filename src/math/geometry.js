import * as vec3 from './vector';

const createSphere = (center, radius, thetaSegment, phiSegment, color) => {
    const vertexNum = 2 + (thetaSegment - 1) * phiSegment;
    const indexNum = phiSegment * 6 + (thetaSegment - 2) * phiSegment * 6;
    const indices = new Array(indexNum);
    const positions = new Array(3 * vertexNum);
    const normals = new Array(3 * vertexNum);
    const textures = new Array(2 * indexNum);
    const colors = new Array(4 * indexNum);

    
    for (let i = 0; i < colors.length / 4; i += 4) {
      if (color === "white") {
        colors[i] = 1.0;
        colors[i + 1] = 1.0;
        colors[i + 2] = 1.0;
        colors[i + 3] = 1.0;
      } else if (color === "black") {
        colors[i] = 0.0;
        colors[i + 1] = 0.0;
        colors[i + 2] = 0.0;
        colors[i + 3] = 0.0;
      }
    }

    for (let i = 0; i < textures.length / 3; i += 6) {
      textures[i] = 0.0;
      textures[i + 1] = 0.0;
      textures[i + 2] = 0.0;
      textures[i + 3] = 1.0;
      textures[i + 4] = 1.0;
      textures[i + 5] = 1.0;
    }
  
    const thetaStep = Math.PI / thetaSegment;
    const phiStep = 2.0 * Math.PI / phiSegment;
  
    // setup positions & normals
    let posCount = 0;
    let normalCount = 0;
    posCount = addVertex3(positions, posCount, 0 + center[0], -radius + center[1], 0 + center[2]);
    normalCount = addVertex3(normals, normalCount, 0, -1, 0);
    for (let hi = 1; hi < thetaSegment; hi++) {
      const theta = Math.PI - hi * thetaStep;
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);
      for (let pi = 0; pi < phiSegment; pi++) {
        const phi = pi * phiStep;
        const sinP = Math.sin(-phi);
        const cosP = Math.cos(-phi);
        const p = [
          radius * sinT * cosP,
          radius * cosT,
          radius * sinT * sinP
        ];
        posCount = addVertex3(positions, posCount, p[0] + center[0], p[1] + center[1], p[2] + center[2]);
        const np = vec3.norm(p);
        normalCount = addVertex3(normals, normalCount, np[0], np[1], np[2]);
      }
    }
    posCount = addVertex3(positions, posCount, 0 + center[0], radius + center[1], 0 + center[2]);
    normalCount = addVertex3(normals, normalCount, 0, 1, 0);
  
    // setup indices
    let indexCount = 0;
    for (let pi = 0; pi < phiSegment; pi++) {
      indexCount = addTriangle(indices, indexCount, 0, pi !== phiSegment - 1 ? pi + 2 : 1, pi + 1);
    }
    for (let hi = 0; hi < thetaSegment - 2; hi++) {
      const hj = hi + 1;
      for (let pi = 0; pi < phiSegment; pi++) {
        const pj = pi !== phiSegment - 1 ? pi + 1 : 0;
        indexCount = addQuad(indices, indexCount, 
          pi + hi * phiSegment + 1,
          pj + hi * phiSegment + 1,
          pi + hj * phiSegment + 1,
          pj + hj * phiSegment + 1
        );
      }
    }
    for (let pi = 0; pi < phiSegment; pi++) {
      indexCount = addTriangle(indices, indexCount,
        vertexNum - 1,
        pi + (thetaSegment - 2) * phiSegment + 1,
        (pi !== phiSegment - 1 ? pi + 1 : 0) + (thetaSegment - 2) * phiSegment + 1
      );
    }
  
    return {
      indices: indices,
      positions: positions,
      normals: normals,
      textures: textures,
      colors: colors,
    };
  };

const addVertex3 = (vertices, vi, x, y, z) => {
    vertices[vi++] = x;
    vertices[vi++] = y;
    vertices[vi++] = z;
    return vi;
};

const addTriangle = (indices, i, v0, v1, v2) => {
    indices[i++] = v0;
    indices[i++] = v1;
    indices[i++] = v2;
    return i;
};

const addQuad = (indices, i, v00, v10, v01, v11) => {
    indices[i] = v00;
    indices[i + 1] = indices[i + 5] = v10;
    indices[i + 2] = indices[i + 4] = v01;
    indices[i + 3] = v11;
    return i + 6;
};

export {
    createSphere,
}