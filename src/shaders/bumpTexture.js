const BUMP_VERTEX_SHADER = `
varying vec3 L; // light vector in texture-space coordinates
varying vec3 V; // view vector in texture-space coordinates
attribute vec2 vTexCoord;
attribute vec4 vPosition;
uniform vec4 Normal;
uniform vec4 LightPosition;
uniform mat4 ModelView;
uniform mat4 Projection;
uniform mat4 u_world;
uniform mat4 u_transformation;
uniform mat3 NormalMatrix;
uniform vec3 objTangent; // Tangent vector in object coordinates
varying vec2 fTexCoord;
void main()
{
    fTexCoord = vTexCoord;
    vec3 eyePosition = (ModelView * vPosition).xyz;
    vec3 eyeLightPos = (ModelView * LightPosition).xyz;

    // Normal, tangent, and binormal in eye coordinates
    vec3 N = normalize(NormalMatrix * Normal.xyz);
    vec3 T = normalize(NormalMatrix * objTangent);
    vec3 B = cross(N, T);

    // Light vector in texture space
    L.x = dot(T, eyeLightPos - eyePosition);
    L.y = dot(B, eyeLightPos - eyePosition);
    L.z = dot(N, eyeLightPos - eyePosition);
    L = normalize(L);

    // View vector in texture space7.10 Blending Techniques 365
    V.x = dot(T, -eyePosition);
    V.y = dot(B, -eyePosition);
    V.z = dot(N, -eyePosition);
    V = normalize(V);
    gl_Position = Projection * ModelView * u_world * u_transformation * vPosition;
}
`;

const BUMP_FRAGMENT_SHADER = `
precision mediump float;
varying vec3 L;
varying vec3 V;
varying vec2 fTexCoord;
uniform sampler2D texMap;
uniform vec4 DiffuseProduct;
void main()
{
    vec4 N = texture2D(texMap, fTexCoord);
    vec3 NN = normalize(2.0*N.xyz - 1.0);
    vec3 LL = normalize(L);
    float Kd = max(dot(NN, LL), 0.0);
    gl_FragColor = vec4(Kd * DiffuseProduct.xyz, 1.0);
}
`

export {
    BUMP_VERTEX_SHADER,
    BUMP_FRAGMENT_SHADER,
}
