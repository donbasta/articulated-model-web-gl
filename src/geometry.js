import * as mat4 from './matrix';
import * as vec3 from './vector';

const createSphere = (radius, thetaSegment, phiSegment) => {
    const vertexNum = 2 + (thetaSegment - 1) * phiSegment;
    const indexNum = phiSegment * 6 + (thetaSegment - 2) * phiSegment * 6;
    const indices = new Int16Array(indexNum);
    const positions = new Float32Array(3 * vertexNum);
    const normals = new Float32Array(3 * vertexNum);
  
    const thetaStep = Math.PI / thetaSegment;
    const phiStep = 2.0 * Math.PI / phiSegment;
  
    // setup positions & normals
    let posCount = 0;
    let normalCount = 0;
    posCount = addVertex3(positions, posCount, 0, -radius, 0);
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
        posCount = addVertex3(positions, posCount, p[0], p[1], p[2]);
        const np = vec3.norm(p);
        normalCount = addVertex3(normals, normalCount, np[0], np[1], np[2]);
      }
    }
    posCount = addVertex3(positions, posCount, 0, radius, 0);
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