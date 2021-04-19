const faceInfos = [
  {
    target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
    url: 'resources/pos-x.jpg',
  },
  {
    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
    url: 'resources/neg-x.jpg',
  },
  {
    target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
    url: 'resources/pos-y.jpg',
  },
  {
    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
    url: 'resources/neg-y.jpg',
  },
  {
    target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
    url: 'resources/pos-z.jpg',
  },
  {
    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    url: 'resources/neg-z.jpg',
  },
]

const loadEnvironemnt = () => {
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
}