import pos_x from './resources/pos-x.jpg';
import pos_y from './resources/pos-y.jpg';
import pos_z from './resources/pos-z.jpg';
import neg_x from './resources/neg-x.jpg';
import neg_y from './resources/neg-y.jpg';
import neg_z from './resources/neg-z.jpg';

const loadEnvironmentTexture = (gl) => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  const faceInfos = [
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      url: pos_x,
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      url: neg_x,
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      url: pos_y,
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      url: neg_y,
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      url: pos_z,
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      url: neg_z,
    },
  ]

  faceInfos.forEach((faceInfo) => {
    const {target, url} = faceInfo;
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 512;
    const height = 512;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;

    gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

    const image = new Image();
    image.src = url;
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    };
  });

  gl.generateMipmap(gl.TEXTURE_CUBE_MAP); 
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  return texture;
}

export {
  loadEnvironmentTexture,
};