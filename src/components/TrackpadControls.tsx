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
    onTrackpadEvent?: (isTrackpad: boolean) => void;
}

const TrackpadControls = ({
    onTrackpadEvent,
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
        camera.rotation.set(0, 0, 0);
        camera.up.set(0, 1, 0);
    }, [camera, targetZ]);

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            onTrackpadEvent?.(true);
            
            // タイマーをここで直接管理
            setTimeout(() => onTrackpadEvent?.(false), 100);

            event.preventDefault();
            event.stopPropagation();

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
                    camera.position.z = targetZ + currentDistance.current;
                } else if (enablePan) {
                    const panFactor = currentDistance.current * panSpeed * 0.0008;
                    const deltaX = event.deltaX * panFactor;
                    const deltaY = -event.deltaY * panFactor;
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
    }, [camera, gl, size, zoomSpeed, panSpeed, enableZoom, enablePan, minDistance, maxDistance, targetZ, onTrackpadEvent]);

    useFrame(() => {
        if (camera instanceof THREE.PerspectiveCamera) {
            camera.rotation.set(0, 0, 0);
            camera.up.set(0, 1, 0);
            camera.updateProjectionMatrix();
        }
    });

    return null;
};

export default TrackpadControls;