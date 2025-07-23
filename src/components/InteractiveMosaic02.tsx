'use client'

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import p5 from "p5";


export interface P5SketchProps {
  preload?: (p5: p5) => void;
  setup?: (p5: p5, canvasParentRef: Element) => void;
  draw?: (p5: p5) => void;
  windowResized?: (p5: p5) => void;
  [key: string]: any;
}

const Sketch = dynamic(() => import("react-p5"), {
  loading: () => <div>Loading...</div>,
  ssr: false,
}) as React.ComponentType<P5SketchProps>;

interface InteractiveMosaic02Props {
  width?: string | number;
  height?: string | number;
  showTitle?: boolean;
  className?: string;
  style?: React.CSSProperties;
  imageUrl: string;
}

// アスペクト比取得関数
function getAspectRatioFromFilename(imageUrl: string): { width: number; height: number; ratio: number } {
  const filename = imageUrl.split('/').pop() || ''
  const aspectRatioMatch = filename.match(/_(\d+)-(\d+)\.(jpg|jpeg|png|webp)$/i)

  if (aspectRatioMatch) {
    const [, width, height] = aspectRatioMatch
    const w = parseInt(width, 10)
    const h = parseInt(height, 10)
    return { width: w, height: h, ratio: w / h }
  }

  return { width: 1, height: 1, ratio: 1 }
}

export default function InteractiveMosaic02({
  width = '100%',
  height,
  showTitle = false,
  imageUrl,
  className = '',
  style = {}
}: InteractiveMosaic02Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [aspectRatio, setAspectRatio] = useState<{ width: number; height: number; ratio: number }>({ width: 1, height: 1, ratio: 1 });

  // 画像とシェーダー用の変数
  const loadedImageRef = useRef<any>(null);
  const imageLoadedRef = useRef(false);
  const mosaicShaderRef = useRef<any>(null);
  const mosaicCounterRef = useRef(100.0);
  const prevMouseXRef = useRef(0);

  // シェーダー設定
  const mosaicCounterBase = 100.0;
  const mosaicCounterMin = -50.0;
  const mosaicIntensity = [12.0, 6.0, 0.1];

  // アスペクト比を取得
  useEffect(() => {
    const ratio = getAspectRatioFromFilename(imageUrl);
    setAspectRatio(ratio);
  }, [imageUrl]);

  // サイズ計算
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const titleHeight = showTitle ? 40 : 0;

        const availableWidth = Math.max(rect.width, 100);
        let finalWidth = availableWidth;
        let finalHeight;

        if (height) {
          if (typeof height === 'string' && height.includes('%')) {
            const parentHeight = rect.height || 400;
            finalHeight = (parentHeight * parseInt(height.replace('%', ''), 10) / 100) - titleHeight;
          } else {
            finalHeight = (typeof height === 'string' ? parseInt(height.replace('px', ''), 10) : height) - titleHeight;
          }
        } else {
          finalHeight = finalWidth / aspectRatio.ratio;
        }

        setDimensions({
          width: Math.max(finalWidth, 100),
          height: Math.max(finalHeight, 100)
        });
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: observedWidth, height: observedHeight } = entry.contentRect;
        const titleHeight = showTitle ? 40 : 0;

        let finalWidth = Math.max(observedWidth, 100);
        let finalHeight;

        if (height) {
          if (typeof height === 'string' && height.includes('%')) {
            finalHeight = (observedHeight * parseInt(height.replace('%', ''), 10) / 100) - titleHeight;
          } else {
            finalHeight = (typeof height === 'string' ? parseInt(height.replace('px', ''), 10) : height) - titleHeight;
          }
        } else {
          finalHeight = finalWidth / aspectRatio.ratio;
        }

        setDimensions({
          width: Math.max(finalWidth, 100),
          height: Math.max(finalHeight, 100)
        });
      }
    });

    if (containerRef.current) {
      updateDimensions();
      resizeObserver.observe(containerRef.current);
    }

    const timer = setTimeout(updateDimensions, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [showTitle, aspectRatio, height]);

  const preload = (p5: p5) => {
    // 画像を読み込み
    loadedImageRef.current = p5.loadImage(imageUrl, () => {
      imageLoadedRef.current = true;
      console.log("画像が読み込まれました:", imageUrl);
    }, (error: any) => {
      console.error("画像の読み込みに失敗しました:", error);
    });
  };

  const setup = (p5: p5, canvasParentRef: Element) => {
    // WebGLモードでキャンバスを作成
    const canvas = p5.createCanvas(dimensions.width, dimensions.height, (p5 as any).WEBGL);
    canvas.parent(canvasParentRef);

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

    try {
      // シェーダーを作成
      mosaicShaderRef.current = p5.createShader(vert, frag);
    } catch (error) {
      console.error("シェーダーの作成に失敗しました:", error);
    }

    p5.noStroke();
    p5.background(50);

    // モザイクカウンターを初期化
    mosaicCounterRef.current = mosaicCounterBase;
  };

  const draw = (p5: p5) => {
    if (!loadedImageRef.current || !imageLoadedRef.current || !mosaicShaderRef.current) {
      p5.background(50);
      return;
    }

    p5.background(50);

    // マウスがキャンバス内にあるかチェック
    const isMouseInCanvas = p5.mouseX >= 0 && p5.mouseX <= p5.width &&
      p5.mouseY >= 0 && p5.mouseY <= p5.height;

    // キャンバス内でのマウス移動を検出
    const hasMovement = isMouseInCanvas && Math.abs(p5.mouseX - prevMouseXRef.current) > 0.01;

    // カウンターの更新
    if (isMouseInCanvas) {
      if (hasMovement) {
        // キャンバス内でマウス移動中は大幅に減少
        mosaicCounterRef.current -= 15.0;
      } else {
        // キャンバス内でマウス停止中は少し減少
        mosaicCounterRef.current -= 5.0;
      }
    } else {
      // キャンバス外では増加
      mosaicCounterRef.current += 3.0;
    }

    prevMouseXRef.current = p5.mouseX;
    mosaicCounterRef.current = p5.constrain(mosaicCounterRef.current, mosaicCounterMin, mosaicCounterBase);

    // シェーダーを使用
    p5.shader(mosaicShaderRef.current);

    // シェーダーにuniformを渡す
    mosaicShaderRef.current.setUniform('u_texture', loadedImageRef.current);
    mosaicShaderRef.current.setUniform('u_resolution', [dimensions.width, dimensions.height]);
    mosaicShaderRef.current.setUniform('u_mosaicCounter', mosaicCounterRef.current);
    mosaicShaderRef.current.setUniform('u_mosaicIntensity', mosaicIntensity);
    mosaicShaderRef.current.setUniform('u_time', p5.millis() / 1000.0);

    p5.noStroke();
    p5.fill(255);

    // WebGLモードでは座標系が異なるため調整
    p5.rect(-p5.width / 2, -p5.height / 2, p5.width, p5.height);
  };

  const windowResized = (p5: p5) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const titleHeight = showTitle ? 40 : 0;

      let newWidth = Math.max(rect.width, 100);
      let newHeight;

      if (height) {
        if (typeof height === 'string' && height.includes('%')) {
          newHeight = (rect.height * parseInt(height.replace('%', ''), 10) / 100) - titleHeight;
        } else {
          newHeight = (typeof height === 'string' ? parseInt(height.replace('px', ''), 10) : height) - titleHeight;
        }
      } else {
        newHeight = newWidth / aspectRatio.ratio;
      }

      p5.resizeCanvas(newWidth, newHeight);
      setDimensions({ width: newWidth, height: newHeight });
    }
  };

  const calculatedHeight = height || `${dimensions.height + (showTitle ? 40 : 0)}px`;

  const containerStyle: React.CSSProperties = {
    width,
    height: calculatedHeight,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    ...style
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
    >
      {showTitle && (
        <div style={{
          padding: '8px 12px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          flexShrink: 0,
          height: '40px',
          display: 'flex',
          alignItems: 'center'
        }}>
          モザイク効果（マウスホバーで解除） - {imageUrl.split('/').pop()} ({aspectRatio.width}:{aspectRatio.height})
        </div>
      )}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <Sketch
          preload={preload}
          setup={setup}
          draw={draw}
          windowResized={windowResized}
        />
      </div>
    </div>
  );
}