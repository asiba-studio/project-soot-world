let img;
let mosaicShader;
let mosaicCounterBase = 100.0;
let mosaicCounter = mosaicCounterBase;
let mosaicCounterMin = -50.0;
let mosaicIntensity = [12.0, 6.0, 0.1];
let defaultImageUrl = '';

// 画像とキャンバスの設定
let imageAspect;
let canvasWidth, canvasHeight;
let hoverGap = 0;
let prevMouseX = 0;

// Vertex shader
const vert = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`;

// Fragment shader
const frag = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_mosaicCounter;
uniform vec3 u_mosaicIntensity;
uniform float u_time;
varying vec2 vTexCoord;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec4 mosaic(sampler2D tex, vec2 uv, float intensity) {
  if (intensity <= 0.0) {
    return texture2D(tex, uv);
  }

  vec2 mosaicSize = vec2(intensity);
  
  // セルの中央を基準にした座標計算
  vec2 gridCoord = floor(uv * u_resolution / mosaicSize);
  vec2 cellCenter = (gridCoord + 0.5) * mosaicSize / u_resolution;
  
  return texture2D(tex, cellCenter);
}

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  
  // 3段階のモザイク強度を計算
  float x = uv.x;
  float baseIntensity;

  float leftX = 0.33;
  float rightX = 0.67;
  float lineWidth = 0.5;
  
  if (x < leftX) {
    // 左側: 強いモザイク
    baseIntensity = u_mosaicIntensity.x;
  } else if (x < rightX) {
    // 中央: 中程度のモザイク
    baseIntensity = u_mosaicIntensity.y;
  } else {
    // 右側: 弱いモザイク
    baseIntensity = u_mosaicIntensity.z;
  }

  // 減衰
  float mosaicIntensityFactor = clamp(u_mosaicCounter, 0.0, 100.0) / 100.0;

  // オリジナル色とモザイク色を別々に計算
  vec4 originalColor = texture2D(u_texture, uv);
  vec4 mosaicColor = mosaic(u_texture, uv, baseIntensity);

  // 線形補間で滑らかに変化
  vec4 finalColor = mix(originalColor, mosaicColor, mosaicIntensityFactor);
  
  // 2本の線
  vec4 lineLayer = vec4(0.0, 0.0, 0.0, 0.0);
  bool isLine = (abs(x - leftX) * u_resolution.x < lineWidth) || (abs(x - rightX) * u_resolution.x < lineWidth);
  float lineStrength = 0.7 * clamp(u_mosaicCounter, 10.0, 100.0) / 100.0;
  if (isLine) {
    lineLayer = vec4(0.5, 0.5, 0.5, lineStrength);
  }

  // 最終グラフィック
  gl_FragColor = mix(finalColor, lineLayer, lineLayer.a);
}
`;

function preload() {
  let imageUrl = getImageFromURL();
  img = loadImage(imageUrl);
  mosaicShader = new p5.Shader(this.renderer, vert, frag);
}

function setup() {
  // URLパラメータをコンソールに出力
  const params = new URLSearchParams(window.location.search);
  console.log('URL Parameters:', {
    image: params.get('image'),
    width: params.get('width'), 
    height: params.get('height'),
    aspectRatio: params.get('aspectRatio')
  });
  
  calculateCanvasSize();
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  
  // 計算されたサイズも出力
  console.log('Canvas Size:', { canvasWidth, canvasHeight, imageAspect });
}

function draw() {
  background(50);
  
  if (!img || !imageAspect) return;
  
  let hasMovement = abs(mouseX - prevMouseX) > 0.01;
  
  // カウンターの更新
  if (hasMovement) {
    // ホバー中は大幅に減少
    mosaicCounter -= 15.0;
  } else {
    // 非ホバー時は少し増加
    mosaicCounter += 3.0;
  }

  prevMouseX = mouseX;
  mosaicCounter = constrain(mosaicCounter, mosaicCounterMin, mosaicCounterBase);
  
  // シェーダーを使用
  shader(mosaicShader);
  
  mosaicShader.setUniform('u_texture', img);
  mosaicShader.setUniform('u_resolution', [canvasWidth, canvasHeight]);
  mosaicShader.setUniform('u_mosaicCounter', mosaicCounter);
  mosaicShader.setUniform('u_mosaicIntensity', mosaicIntensity);
  mosaicShader.setUniform('u_time', millis() / 1000.0);
  
  noStroke();
  fill(255);
  rect(0, 0, canvasWidth, canvasHeight);
}

function calculateCanvasSize() {
  if (!img) return;

  const params = getCanvasParams();
  imageAspect = img.width / img.height;

  // URLパラメータからサイズを取得
  if (params.width && params.width !== '100%') {
    // 具体的なピクセル値が指定されている場合
    canvasWidth = parseInt(params.width) || window.innerWidth;
  } else {
    // 100%の場合は親要素の幅を使用
    canvasWidth = window.innerWidth;
  }

  if (params.height && params.height !== 'auto') {
    canvasHeight = parseInt(params.height);
  } else {
    // アスペクト比から高さを計算
    canvasHeight = canvasWidth / imageAspect;
  }
}
function windowResized() {
  calculateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function getCanvasParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    width: params.get('width'),
    height: params.get('height'),
    aspectRatio: params.get('aspectRatio')
  };
}

function getImageFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('image') || params.get('img') || defaultImageUrl;
}