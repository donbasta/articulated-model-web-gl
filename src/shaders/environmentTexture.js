const ENVIRONMENT_VERTEX_SHADER = 
`   #version 300 es
    
    in vec4 a_position;
    in vec3 a_normal;

    uniform mat4 u_projection;
    uniform mat4 u_view;
    uniform mat4 u_world;
    uniform mat4 u_transformation;

    out vec3 v_worldPosition;
    out vec3 v_worldNormal;

    void main() {
    // Multiply the position by the matrix.
    gl_Position = u_projection * u_view * u_world * u_transformation * a_position;

    // send the view position to the fragment shader
    v_worldPosition = (u_world * a_position).xyz;

    // orient the normals and pass to the fragment shader
    v_worldNormal = mat3(u_world) * a_normal;
    }`;

const ENVIRONMENT_FRAGMENT_SHADER = 
`   #version 300 es
    
    precision highp float;
    
    // Passed in from the vertex shader.
    in vec3 v_worldPosition;
    in vec3 v_worldNormal;
    
    // The texture.
    uniform samplerCube u_texture;
    
    // The position of the camera
    uniform vec3 u_worldCameraPosition;
    
    // we need to declare an output for the fragment shader
    out vec4 outColor;
    
    void main() {
    vec3 worldNormal = normalize(v_worldNormal);
    vec3 eyeToSurfaceDir = normalize(v_worldPosition - u_worldCameraPosition);
    vec3 direction = reflect(eyeToSurfaceDir,worldNormal);
    
    outColor = texture(u_texture, direction);
    }`;

export {
    ENVIRONMENT_FRAGMENT_SHADER,
    ENVIRONMENT_VERTEX_SHADER,
};