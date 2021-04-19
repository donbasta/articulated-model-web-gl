const COLOR_VERTEX_SHADER = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uProjectionMatrix;
    uniform vec3 uResolution;

    varying lowp vec4 vColor;

    void main(void) {
    vColor = aVertexColor;

    vec3 pos = (uProjectionMatrix * aVertexPosition).xyz;
    vec3 a = pos / uResolution;
    gl_Position = vec4(a, 1);
    }
`;

const COLOR_FRAGMENT_SHADER = `
    varying lowp vec4 vColor;

    void main(void) {
    gl_FragColor = vColor;
    }
`;

export {
    COLOR_VERTEX_SHADER,
    COLOR_FRAGMENT_SHADER
}