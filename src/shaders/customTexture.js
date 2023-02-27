const SKYBOX_VERTEX_SHADER_SOURCE =`
    #version 300 es
    out vec3 v_dir;
    uniform mat4 u_skyboxMatrix;
    uniform vec2 u_targetScale;
    const vec2[4] POSITIONS = vec2[](
        vec2(-1.0, -1.0),
        vec2(1.0, -1.0),
        vec2(-1.0, 1.0),
        vec2(1.0, 1.0)
    );
    const int[6] INDICES = int[](
        0, 1, 2,
        3, 2, 1
    );
    void main(void) {
        vec2 position = POSITIONS[INDICES[gl_VertexID]];
        vec3 dir = (u_skyboxMatrix * vec4(position * u_targetScale, -1.0, 0.0)).xyz;
        v_dir = normalize(dir);
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

const SKYBOX_FRAGMENT_SHADER_SOURCE =`
    #version 300 es
    precision highp float;
    in vec3 v_dir;
    out vec4 o_color;
    uniform samplerCube u_skyboxTexture;
    #define HALF_PI 1.57079632679
    mat2 rotate(float r) {
        float c = cos(r);
        float s = sin(r);
        return  mat2(c, s, -s, c);
    }
    vec4 sampleCubemap(samplerCube cubemap, vec3 v) {
        v.xz *= rotate(HALF_PI);
        v.x *= -1.0;
        return texture(cubemap, v);
    }
    void main(void) {
        vec3 skybox = sampleCubemap(u_skyboxTexture, v_dir).rgb;
        o_color = vec4(skybox, 1.0);
    }
`;

export {
    SKYBOX_VERTEX_SHADER_SOURCE,
    SKYBOX_FRAGMENT_SHADER_SOURCE
}
