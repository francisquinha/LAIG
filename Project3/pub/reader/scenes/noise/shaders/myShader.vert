#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

uniform float scale;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;

    vec4 myColor = texture2D(uSampler2, aTextureCoord);
    vec3 offset = vec3(0,0,0);
    offset.y = myColor.g; 
    offset *= scale; // necessario para normalizar, caso contrario parecia um castelo!!

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}