const IMAGE_VERTEX_SHADER = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uProjectionMatrix;
    uniform vec3 uResolution;

    varying highp vec2 vTextureCoord;

    void main(void) {
    vTextureCoord = aTextureCoord;

    vec3 pos = (uProjectionMatrix * aVertexPosition).xyz;
    vec3 a = pos / uResolution;
    gl_Position = vec4(a, 1);
    }
`;

const IMAGE_FRAGMENT_SHADER = `
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;

    void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`;

export {
    IMAGE_VERTEX_SHADER,
    IMAGE_FRAGMENT_SHADER
}