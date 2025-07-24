'use client'

import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// 動物の名前リスト
const animals = [
  'Cat', 'Dog', 'Lion', 'Tiger', 'Elephant', 'Giraffe', 'Zebra', 'Monkey',
  'Rabbit', 'Bear', 'Wolf', 'Fox', 'Deer', 'Horse', 'Cow', 'Pig',
  'Sheep', 'Goat', 'Duck', 'Swan', 'Eagle', 'Owl', 'Parrot', 'Penguin',
  'Dolphin', 'Whale', 'Shark', 'Turtle', 'Snake', 'Butterfly'
]

// ランダムなグラデーション色を生成
interface GradientColors {
  color1: string
  color2: string
  emissive: THREE.Color
}

function generateRandomGradient(): GradientColors {
  const hue1 = Math.random() * 360
  const hue2 = (hue1 + 30 + Math.random() * 60) % 360
  const saturation = 70 + Math.random() * 30
  const lightness1 = 40 + Math.random() * 20
  const lightness2 = 60 + Math.random() * 20
  
  return {
    color1: `hsl(${hue1}, ${saturation}%, ${lightness1}%)`,
    color2: `hsl(${hue2}, ${saturation}%, ${lightness2}%)`,
    emissive: new THREE.Color(`hsl(${hue1}, ${saturation}%, ${lightness1 * 0.3}%)`)
  }
}

// カードコンポーネント
interface CardProps {
  position: [number, number, number]
  animal: string
  gradient: {
    color1: string
    color2: string
    emissive: THREE.Color
  }
  onCardClick: (animal: string) => void
}

function Card({ position, animal, gradient, onCardClick }: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [floatOffset] = useState(Math.random() * Math.PI * 2) // ランダムな浮遊オフセット

  // テクスチャを読み込み
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load('/images/dummy.png')
    
    // テクスチャの設定
    tex.wrapS = THREE.ClampToEdgeWrapping  // 正しいスペル
    tex.wrapT = THREE.ClampToEdgeWrapping  // 正しいスペル
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    
    return tex
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      // ゆっくりとした浮遊運動
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + floatOffset) * 0.2
      
      // カードは常に正面を向く（Z軸回転のみリセット）
      meshRef.current.rotation.x = 0
      meshRef.current.rotation.y = 0
      meshRef.current.rotation.z = 0
      
      // ホバー時の軽い拡大
      const targetScale = clicked ? 1.3 : hovered ? 1.1 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1)
    }
  })

  return (
    <group position={position}>
      {/* カード本体 - 平らな紙 */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          setClicked(!clicked)
          onCardClick(animal)
        }}
      >
        <planeGeometry args={[2, 1.2]} />
        <meshStandardMaterial
          color={clicked ? '#ffffff' : hovered ? gradient.color1 : gradient.color2}
          emissive={gradient.emissive}
          emissiveIntensity={clicked ? 0.8 : hovered ? 0.3 : 0.1}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* 動物の名前テキスト */}
      <Text
        position={[0, 0, 0.001]}  // カードの前面に配置
        fontSize={0.3}
        color={clicked || hovered ? '#000000' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {animal}
      </Text>
    </group>
  )
}

// カードを3D空間にランダム配置する関数
function generateCardPositions(count: number): [number, number, number][] {
  const positions: [number, number, number][] = []
  for (let i = 0; i < count; i++) {
    positions.push([
      (Math.random() - 0.5) * 20, // X: -10 から 10
      (Math.random() - 0.5) * 15, // Y: -7.5 から 7.5
      (Math.random() - 0.5) * 15  // Z: -7.5 から 7.5
    ])
  }
  return positions
}

// メインシーンコンポーネント
interface SceneProps {
  onCardClick: (animal: string) => void
}

function Scene({ onCardClick }: SceneProps) {
  // カードデータを生成（一度だけ）
  const cardData = useMemo(() => {
    const positions = generateCardPositions(30)
    return positions.map((position, index) => ({
      id: index,
      position: position as [number, number, number],
      animal: animals[index % animals.length],
      gradient: generateRandomGradient()
    }))
  }, [])

  return (
    <>
      {/* 環境光 */}
      <ambientLight intensity={0.4} />
      
      {/* メインライト */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
      />
      
      {/* 補助ライト */}
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff9999" />
      <pointLight position={[10, -10, 10]} intensity={0.3} color="#9999ff" />

      {/* カードを配置 */}
      {cardData.map((card) => (
        <Card
          key={card.id}
          position={card.position}
          animal={card.animal}
          gradient={card.gradient}
          onCardClick={onCardClick}
        />
      ))}

      {/* カメラコントロール（ズーム制限を緩和） */}
      <OrbitControls
        enablePan={true}       // パン（移動）を有効
        enableZoom={true}      // ズームを有効
        enableRotate={false}   // 回転は無効のまま
        panSpeed={1.5}         // パンの速度を少し上げる
        zoomSpeed={0.8}        // ズームの速度
        minZoom={2}            // 最小ズーム（かなり遠くまで）
        maxZoom={200}          // 最大ズーム（かなり近くまで）
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,    // 左クリック：パン
          MIDDLE: THREE.MOUSE.DOLLY, // 中クリック：ズーム
          RIGHT: THREE.MOUSE.PAN     // 右クリック：パン
        }}
      />
    </>
  )
}

export default function FloatingCardsGallery() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [cardHistory, setCardHistory] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const handleCardClick = (animal: string) => {
    setSelectedCard(animal)
    setCardHistory(prev => {
      const newHistory = [animal, ...prev.filter(a => a !== animal)]
      return newHistory.slice(0, 5) // 最新5件まで保持
    })
  }

  // 読み込み完了を検知
  React.useEffect(() => {
    // シンプルなタイマーベースのローディング
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          setLoadingProgress(100)
          setTimeout(() => setIsLoading(false), 500)
          clearInterval(timer)
          return 100
        }
        return newProgress
      })
    }, 150)

    // 最大5秒でローディングを強制終了
    const maxTimer = setTimeout(() => {
      setLoadingProgress(100)
      setIsLoading(false)
      clearInterval(timer)
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(maxTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* ローディング画面 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="text-6xl mb-4 animate-bounce">🎴</div>
              <h2 className="text-2xl font-bold mb-2">Loading 3D Cards...</h2>
              <p className="text-sm opacity-75">Preparing your magical card collection</p>
            </div>
            
            {/* プログレスバー */}
            <div className="w-80 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-sm mt-2 opacity-75">{Math.round(loadingProgress)}%</p>
            
            {/* スキップボタン */}
            <button
              onClick={() => setIsLoading(false)}
              className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-sm"
            >
              Skip Loading →
            </button>
            
            {/* ローディングのヒント */}
            <div className="mt-6 text-xs opacity-60 max-w-md">
              <p>💡 Tip: This may take a few seconds on first load</p>
              <p>🚀 Subsequent visits will be much faster!</p>
            </div>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            🎴 3D Animal Cards
          </h1>
          
          <div className="text-white text-right">
            <p className="text-lg">30 Cards Floating in Space</p>
            <p className="text-sm opacity-75">Hover to glow, Click to select</p>
          </div>
        </div>
      </header>

      {/* 3Dキャンバス */}
      <div className="h-screen">
        <Canvas
          orthographic
          camera={{ 
            position: [0, 0, 100],  // カメラをさらに遠くに配置
            zoom: 10,               // ズーム値をさらに下げて全体表示
            left: -50,              // 表示範囲をかなり拡大
            right: 50,
            top: 35,
            bottom: -35,
            near: 0.1,
            far: 2000               // 描画距離を拡大
          }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <Scene onCardClick={handleCardClick} />
        </Canvas>
      </div>

      {/* 選択されたカード情報 */}
      {selectedCard && (
        <div className="absolute top-20 left-6 bg-black/70 backdrop-blur-md text-white p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Selected Animal</h3>
          <div className="text-2xl font-bold text-yellow-300">{selectedCard}</div>
          <div className="text-sm opacity-75 mt-1">
            Click another card to change selection
          </div>
        </div>
      )}

      {/* 操作方法 */}
      <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-md text-white p-4 rounded-xl max-w-sm">
        <h3 className="text-lg font-semibold mb-3">🎮 Controls</h3>
        <div className="space-y-2 text-sm">
          <p>🖱️ <strong>Drag:</strong> Move camera (Pan)</p>
          <p>🔍 <strong>Scroll:</strong> Zoom in/out</p>
          <p>👆 <strong>Hover:</strong> Cards glow softly</p>
          <p>🎯 <strong>Click:</strong> Cards glow brightly</p>
          <p>🚫 <strong>No rotation:</strong> Always front view</p>
        </div>
      </div>

      {/* 最近選択したカード履歴 */}
      {cardHistory.length > 0 && (
        <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-md text-white p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">📝 Recent Selections</h3>
          <div className="space-y-1">
            {cardHistory.map((animal, index) => (
              <div
                key={`${animal}-${index}`}
                className={`text-sm ${index === 0 ? 'text-yellow-300 font-semibold' : 'text-gray-300'}`}
              >
                {index + 1}. {animal}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 装飾的な要素 */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white/20 text-6xl pointer-events-none">
        🌟
      </div>
      <div className="absolute top-1/4 left-4 text-white/20 text-4xl pointer-events-none">
        ✨
      </div>
      <div className="absolute bottom-1/4 right-1/4 text-white/20 text-5xl pointer-events-none">
        🌙
      </div>
    </div>
  )
}