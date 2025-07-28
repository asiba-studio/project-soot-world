import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TrackpadControlsProps {
  zoomSpeed?: number;
  panSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  targetZ?: number;
}

const TrackpadControls = ({
  zoomSpeed = 3.0,
  panSpeed = 1.0,
  minDistance = 5,
  maxDistance = 500,
  enableZoom = true,
  enablePan = true,
  targetZ = -30
}: TrackpadControlsProps) => {
  const { camera, gl, size } = useThree();
  const currentDistance = useRef(60);

  useEffect(() => {
    // 初期カメラ位置を設定
    camera.position.set(0, 0, targetZ + currentDistance.current);
    
    // カメラの向きを強制的に正面に固定
    camera.rotation.set(0, 0, 0);
    camera.up.set(0, 1, 0);
  }, [camera, targetZ]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (camera instanceof THREE.PerspectiveCamera) {
        if (event.ctrlKey && enableZoom) {
          if (event.deltaY > 0) {
            currentDistance.current = Math.min(
              currentDistance.current + zoomSpeed,
              maxDistance
            );
          } else {
            currentDistance.current = Math.max(
              currentDistance.current - zoomSpeed,
              minDistance
            );
          }
          
          // Z位置のみ更新、XYは維持
          camera.position.z = targetZ + currentDistance.current;
          
        } else if (enablePan) {
          const panFactor = currentDistance.current * panSpeed * 0.0008;
          
          const deltaX = event.deltaX * panFactor;
          const deltaY = -event.deltaY * panFactor;
          
          // XY位置のみ更新、Zは固定距離を保持
          camera.position.x += deltaX;
          camera.position.y += deltaY;
        }
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [camera, gl, size, zoomSpeed, panSpeed, enableZoom, enablePan, minDistance, maxDistance, targetZ]);

  // カメラの向きを毎フレーム強制的に正面に固定
  useFrame(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      // 回転を常に (0, 0, 0) に固定
      camera.rotation.set(0, 0, 0);
      
      // 上方向ベクトルも固定
      camera.up.set(0, 1, 0);
      
      // プロジェクション行列を更新
      camera.updateProjectionMatrix();
    }
  });

  return null;
};

export default TrackpadControls;