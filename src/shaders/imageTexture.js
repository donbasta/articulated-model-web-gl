const IMAGE_VERTEX_SHADER = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uProjectionMatrix;
    //uniform vec3 uResolution;
    //uniform mat4 u_projection;
    uniform mat4 u_view;
    uniform mat4 u_world;
    uniform mat4 u_transformation;

    varying highp vec2 vTextureCoord;

    void main(void) {
        vTextureCoord = aTextureCoord;

        //vec3 pos = (uProjectionMatrix * aVertexPosition).xyz;
        //vec3 a = pos / uResolution;
        //gl_Position = vec4(a, 1);

        gl_Position = uProjectionMatrix * u_view * u_world * u_transformation * aVertexPosition;
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