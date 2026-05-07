"use client";

// ============================================
// REKAIRE - Product 360° Interactive Viewer
// ============================================

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { RotateCw, Hand } from "lucide-react";

interface Product360ViewerProps {
  totalFrames?: number;
  basePath?: string;
  className?: string;
}

export function Product360Viewer({
  totalFrames = 251,
  basePath = "/images/product/360/frame_",
  className = "",
}: Product360ViewerProps) {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastXRef = useRef(0);

  // Précharger toutes les images APRÈS le rendu initial (pour ne pas bloquer le LCP)
  useEffect(() => {
    let mounted = true;
    const images: HTMLImageElement[] = [];

    const preloadImages = () => {
      for (let i = 1; i <= totalFrames; i++) {
        const img = new window.Image();
        img.src = `${basePath}${String(i).padStart(3, "0")}.webp`;
        img.onload = () => {
          if (mounted) {
            setLoadedCount((prev) => prev + 1);
          }
        };
        images.push(img);
      }
    };

    // Différer le préchargement: attendre que le navigateur soit idle
    // pour ne pas bloquer le LCP / FCP / TBT.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    if (typeof w.requestIdleCallback === "function") {
      idleHandle = w.requestIdleCallback(() => preloadImages(), { timeout: 3000 });
    } else {
      timeoutHandle = setTimeout(preloadImages, 1500);
    }

    return () => {
      mounted = false;
      if (timeoutHandle) clearTimeout(timeoutHandle);
    };
  }, [totalFrames, basePath]);

  // Quand assez d'images sont chargées (au moins 30 frames pour permettre la rotation)
  useEffect(() => {
    if (loadedCount >= Math.min(30, totalFrames)) {
      setIsLoading(false);
    }
  }, [loadedCount, totalFrames]);

  // Auto-rotation au début (plus rapide avec 251 frames)
  useEffect(() => {
    if (isLoading || hasInteracted) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev % totalFrames) + 1);
    }, 40); // 40ms pour une rotation fluide

    // Arrêter après ~3 secondes
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoading, hasInteracted, totalFrames]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const deltaX = clientX - lastXRef.current;
      const sensitivity = 1.2; // Ajusté pour 251 frames
      const frameChange = Math.round(deltaX * sensitivity);

      if (frameChange !== 0) {
        setCurrentFrame((prev) => {
          let newFrame = prev - frameChange;
          // Boucle infinie
          while (newFrame < 1) newFrame += totalFrames;
          while (newFrame > totalFrames) newFrame -= totalFrames;
          return newFrame;
        });
        lastXRef.current = clientX;
      }
    },
    [totalFrames]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    lastXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    lastXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Conteneur principal */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-square cursor-grab select-none ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image principale toujours rendue (frame_001 sert de LCP) */}
        <Image
          src={`${basePath}${String(currentFrame).padStart(3, "0")}.webp`}
          alt={`Vue 360° du RK01 - Image ${currentFrame}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
          priority
          draggable={false}
          onLoad={() => setFirstFrameReady(true)}
        />

        {/* Loading overlay (au-dessus de l'image, pour ne pas masquer le LCP) */}
        {isLoading && firstFrameReady && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RotateCw className="w-4 h-4 text-orange-500" />
            </motion.div>
            <p className="text-sm text-gray-600">
              Chargement 360°... {Math.round((loadedCount / totalFrames) * 100)}%
            </p>
          </div>
        )}

        {/* Instruction overlay */}
        {!isLoading && !hasInteracted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black/60 text-white px-4 py-2 rounded-full flex items-center gap-2">
              <Hand className="w-5 h-5" />
              <span className="text-sm">Glissez pour faire tourner</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Slider de contrôle */}
      {!isLoading && (
        <div className="mt-4 px-4">
          <input
            type="range"
            min={1}
            max={totalFrames}
            value={currentFrame}
            onChange={(e) => {
              setCurrentFrame(Number(e.target.value));
              setHasInteracted(true);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            style={{
              background: `linear-gradient(to right, #f97316 0%, #f97316 ${((currentFrame - 1) / (totalFrames - 1)) * 100}%, #e5e7eb ${((currentFrame - 1) / (totalFrames - 1)) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <RotateCw className="w-4 h-4" />
              Vue 360°
            </span>
            <span className="text-xs">{Math.round((currentFrame / totalFrames) * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
