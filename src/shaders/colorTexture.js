const COLOR_VERTEX_SHADER = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uProjectionMatrix;
    //uniform vec3 uResolution;
    uniform mat4 u_view;
    uniform mat4 u_world;
    uniform mat4 u_transformation;

    varying lowp vec4 vColor;

    void main(void) {
        vColor = aVertexColor;

        //vec3 pos = (uProjectionMatrix * aVertexPosition).xyz;
        //vec3 a = pos / uResolution;
        //gl_Position = vec4(a, 1);

        gl_Position = uProjectionMatrix * u_view * u_world * u_transformation * aVertexPosition;
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
