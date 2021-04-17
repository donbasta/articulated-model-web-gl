// reference:
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web

// point • matrix

export const create = () => {
    return [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];
};

export const transpose = (matrix) => {
    return [
        matrix[0], matrix[4], matrix[8], matrix[12],
        matrix[1], matrix[5], matrix[9], matrix[13],
        matrix[2], matrix[6], matrix[10], matrix[14],
        matrix[3], matrix[7], matrix[11], matrix[15]
    ];
}

const multiplyMatrixAndPoint = (matrix, point) => {
    // Give a simple variable name to each part of the matrix, a column and row number
    let c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
    let c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
    let c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
    let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];
  
    // Now set some simple names for the point
    let x = point[0];
    let y = point[1];
    let z = point[2];
    let w = point[3];
  
    // Multiply the point against each part of the 1st column, then add together
    let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);
  
    // Multiply the point against each part of the 2nd column, then add together
    let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);
  
    // Multiply the point against each part of the 3rd column, then add together
    let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);
  
    // Multiply the point against each part of the 4th column, then add together
    let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);
  
    return [resultX, resultY, resultZ, resultW];
}

//matrixB • matrixA
const multiplyMatrices = (matrixA, matrixB) => {
    // Slice the second matrix up into rows
    let row0 = [matrixB[ 0], matrixB[ 1], matrixB[ 2], matrixB[ 3]];
    let row1 = [matrixB[ 4], matrixB[ 5], matrixB[ 6], matrixB[ 7]];
    let row2 = [matrixB[ 8], matrixB[ 9], matrixB[10], matrixB[11]];
    let row3 = [matrixB[12], matrixB[13], matrixB[14], matrixB[15]];
  
    // Multiply each row by matrixA
    let result0 = multiplyMatrixAndPoint(matrixA, row0);
    let result1 = multiplyMatrixAndPoint(matrixA, row1);
    let result2 = multiplyMatrixAndPoint(matrixA, row2);
    let result3 = multiplyMatrixAndPoint(matrixA, row3);
  
    // Turn the result rows back into a single matrix
    return [
      result0[0], result0[1], result0[2], result0[3],
      result1[0], result1[1], result1[2], result1[3],
      result2[0], result2[1], result2[2], result2[3],
      result3[0], result3[1], result3[2], result3[3]
    ];
}

const sin = Math.sin;
const cos = Math.cos;

const translationMatrix = (x, y, z) => {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1
    ];
}

const scaleMatrix = (w, h, d) => {
    return [
        w, 0, 0, 0,
        0, h, 0, 0,
        0, 0, d, 0,
        0, 0, 0, 1
    ];
}

const rotateXMatrix = (a) => {
    return [
        1,  0,      0,          0,
        0,  cos(a), -sin(a),    0,
        0,  sin(a), cos(a),     0,
        0,  0,      0,          1
    ];
}

const rotateYMatrix = (a) => {
    return [
        cos(a),     0,  sin(a), 0,
        0,          1,  0,      0,
        -sin(a),    0,  cos(a), 0,
        0,          0,  0,      1
    ];
}

const rotateZMatrix = (a) => {
    return [
        cos(a), -sin(a),    0,  0,
        sin(a), cos(a),     0,  0,
        0,      0,          1,  0,
        0,      0,          0,  1
    ];
};

export const rotate = (mat, angle, axis) => {
    if (axis === 'x') {
        return multiplyMatrices(mat, rotateXMatrix(angle));
    } else if (axis === 'y') {
        return multiplyMatrices(mat, rotateYMatrix(angle));
    } else if (axis === 'z') {
        return multiplyMatrices(mat, rotateZMatrix(angle));
    }
};

export const translate = (mat, vec) => {
    return multiplyMatrices(mat, translationMatrix(vec[0], vec[1], vec[2]));
}

const projector = {
    'orthographic' : [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, -1, -1,
        0, 0, 0, 0
    ],
    'default' : [
        1.8106601238250732, 0, 0, 0,
        0, 2.4142136573791504, 0, 0,
        0, 0, -1.0020020008087158, -1,
        0, 0, -0.20020020008087158, 0
    ]
}

export const getProjectorType = (projectorType) => {
    if (projector[projectorType] === undefined) {
        return projector['default'];
    }
    return projector[projectorType];
}

const frustum = (left, right, bottom, top, near, far) => {
    const rl = right - left;
    const tb = top - bottom;
    const fn = far - near;

    return [
        (near * 2.0) / rl, 0, 0, 0,
        0, (near * 2.0) / tb, 0, 0,
        (right + left) / rl, (top + bottom) / tb, -(far + near) / fn, -1,
        0, 0, -(far * near * 2.0) / fn, 0
    ];
}

export const perspective = (fovy, aspect, near, far) => {
    const top = near * Math.tan(fovy / 2);
    const right = top * aspect;
    return frustum(-right, right, -top, top, near, far);
}

export const orthographic = (left, right, bottom, top, near, far) => {
    const rl = right - left;
    const tb = top - bottom;
    const fn = far - near;
    
    return transpose([
        2/rl, 0, 0, 0,
        0, 2/tb, 0, 0,
        0, 0, -2/fn, 0,
        -(left+right)/rl, -(top+bottom)/tb, -(far+near)/fn, 1
    ]);
}

export const oblique = (theta, phi) => {
    const cotT = 1/Math.tan(theta);
    const cotP = 1/Math.tan(phi);

    const H = transpose([
        1, 0, 0, 0,
        0, 1, 0, 0,
        cotT, cotP, 1, 0,
        0, 0, 0, 1,
    ]);

    let mat = create();
    mat[10] = 0;
    mat = multiplyMatrices(mat, orthographic(-1, 1, -1, 1, -1, 1));
    mat = multiplyMatrices(mat, H);
    return mat;
}

export const generateNormalsFromModel = (mat) => {
    let ret = [];
    for (let i = 0; i < mat.length; i += 9) {
        const v1 = [mat[i], mat[i + 1], mat[i + 2]];
        const v2 = [mat[i + 3], mat[i + 4], mat[i + 5]];
        const v3 = [mat[i + 6], mat[i + 7], mat[i + 8]];
        const normalVector = crossProduct(sub(v2, v1), sub(v3, v1));
        const unitNormalVector = normalize(normalVector);
        ret = ret.concat(unitNormalVector, unitNormalVector, unitNormalVector);
    }
    return ret;
}

const crossProduct = (a, b) => {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}

const sub = (a, b) => {
    return [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
    ];
}

export const normalize = (v, dst) => {
    dst = dst || new Array(3);
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    // make sure we don't divide by 0.
    if (length > 0.00001) {
      dst[0] = v[0] / length;
      dst[1] = v[1] / length;
      dst[2] = v[2] / length;
    }
    return dst;
  }

  export const inverse = (m, dst) => {
    dst = dst || new Array(16);
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0  = m22 * m33;
    var tmp_1  = m32 * m23;
    var tmp_2  = m12 * m33;
    var tmp_3  = m32 * m13;
    var tmp_4  = m12 * m23;
    var tmp_5  = m22 * m13;
    var tmp_6  = m02 * m33;
    var tmp_7  = m32 * m03;
    var tmp_8  = m02 * m23;
    var tmp_9  = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;

    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    dst[0] = d * t0;
    dst[1] = d * t1;
    dst[2] = d * t2;
    dst[3] = d * t3;
    dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
          (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
    dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
          (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
    dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
          (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
    dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
          (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
    dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
          (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
    dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
          (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
    dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
          (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
    dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
          (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
    dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
          (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
    dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
          (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
    dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
          (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
    dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
          (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

    return dst;
  }
