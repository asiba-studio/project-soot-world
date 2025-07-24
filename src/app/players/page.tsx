'use client'

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Text, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// アニメーションする立方体コンポーネント
function AnimatedCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.8
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5
    }
  })

  return (
    <Box
      ref={meshRef}
      position={position}
      scale={clicked ? 1.5 : hovered ? 1.2 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      <meshStandardMaterial 
        color={clicked ? '#ff6b6b' : hovered ? '#4ecdc4' : '#45b7d1'} 
        roughness={0.3}
        metalness={0.1}
      />
    </Box>
  )
}

// 浮遊する球体
function FloatingSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 1.5 + 1
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Sphere ref={meshRef} position={[3, 0, 0]} args={[0.8, 32, 32]}>
      <meshStandardMaterial 
        color="#96ceb4" 
        roughness={0.1} 
        metalness={0.9}
        emissive="#96ceb4"
        emissiveIntensity={0.1}
      />
    </Sphere>
  )
}

// 3Dシーンコンポーネント
function Scene() {
  return (
    <>
      {/* ライティング */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff9999" />

      {/* 3Dオブジェクト */}
      <AnimatedCube position={[-2, 0, 0]} />
      <FloatingSphere />

      {/* 3Dテキスト */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        Next.js 15 + R3F
      </Text>

      {/* 環境とシャドウ */}
      <Environment preset="night" />
      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={1} 
        far={10} 
        resolution={256} 
        color="#000000" 
      />

      {/* カメラコントロール */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

// メインページコンポーネント
export default function HomePage() {
  const [autoRotate, setAutoRotate] = useState(true)
  const [showStats, setShowStats] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* ヘッダー */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            R3F Demo
          </h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-200"
            >
              {autoRotate ? '自動回転 ON' : '自動回転 OFF'}
            </button>
            
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-200"
            >
              統計表示
            </button>
          </div>
        </div>
      </header>

      {/* 3Dキャンバス */}
      <div className="h-screen">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          shadows
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>
      </div>

      {/* サイドパネル */}
      <div className="absolute bottom-6 left-6 bg-black/30 backdrop-blur-md text-white p-6 rounded-xl max-w-sm">
        <h3 className="text-lg font-semibold mb-3">操作方法</h3>
        <div className="space-y-2 text-sm">
          <p>🖱️ <strong>ドラッグ</strong>: カメラ回転</p>
          <p>🔍 <strong>スクロール</strong>: ズーム</p>
          <p>👆 <strong>クリック</strong>: オブジェクト操作</p>
          <p>🎯 <strong>ホバー</strong>: 色変更</p>
        </div>
        
        {showStats && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <h4 className="font-semibold mb-2">技術スタック</h4>
            <div className="text-xs space-y-1">
              <p>• Next.js 15 (App Router)</p>
              <p>• React Three Fiber</p>
              <p>• React Three Drei</p>
              <p>• Tailwind CSS v4</p>
              <p>• TypeScript</p>
            </div>
          </div>
        )}
      </div>

      {/* 右下の装飾 */}
      <div className="absolute bottom-6 right-6 text-white/60 text-sm text-right">
        <p>Next.js 15 + R3F</p>
        <p className="text-xs">Interactive 3D Experience</p>
      </div>
    </div>
  )
}