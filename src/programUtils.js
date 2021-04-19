import { COLOR_VERTEX_SHADER, COLOR_FRAGMENT_SHADER } from './shaders/colorTexture';
import { IMAGE_VERTEX_SHADER, IMAGE_FRAGMENT_SHADER } from './shaders/imageTexture';
import { ENVIRONMENT_VERTEX_SHADER, ENVIRONMENT_FRAGMENT_SHADER } from './shaders/environmentTexture';

const vertexShaders = {
  "image": IMAGE_VERTEX_SHADER,
  "default": COLOR_VERTEX_SHADER,
  "environment": ENVIRONMENT_VERTEX_SHADER,
};

const fragmentShaders = {
  "image": IMAGE_FRAGMENT_SHADER,
  "default": COLOR_FRAGMENT_SHADER,
  "environment": ENVIRONMENT_FRAGMENT_SHADER,
};

const initShaderProgram = (textureType, gl) => {
  const vsSource = vertexShaders[textureType];
  const fsSource = fragmentShaders[textureType];

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

const createProgramInfo = (textureType, shaderProgram, gl, texture) => {
  switch (textureType) {
    case "image":
      return {
        imageTexture: texture,
        textureType: textureType,
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
          textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          resolutionMatrix: gl.getUniformLocation(shaderProgram, 'uResolution'),
          uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
      };
      case "environment":
        return {
          environmentTexture: texture,
          textureType: textureType,
          program: shaderProgram,
          attribLocations: {
            positionLocation: gl.getAttribLocation(shaderProgram, "a_position"),
            normalLocation: gl.getAttribLocation(shaderProgram, "a_normal")
          },
          uniformLocations: {
            projectionLocation: gl.getUniformLocation(shaderProgram, "u_projection"),
            viewLocation: gl.getUniformLocation(shaderProgram, "u_view"),
            worldLocation: gl.getUniformLocation(shaderProgram, "u_world"),
            textureLocation: gl.getUniformLocation(shaderProgram, "u_texture"),
            worldCameraPositionLocation: gl.getUniformLocation(shaderProgram, "u_worldCameraPosition")
          },
        };
      case "bump":
        return null;
      default:
        return {
          textureType: textureType,
          program: shaderProgram,
          attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
          },
          uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            resolutionMatrix: gl.getUniformLocation(shaderProgram, 'uResolution'),
          }
        };
  }
}

export {
  initShaderProgram,
  createProgramInfo
};