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
  totalFrames = 60,
  basePath = "/images/product/360/frame_",
  className = "",
}: Product360ViewerProps) {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastXRef = useRef(0);

  // Précharger toutes les images
  useEffect(() => {
    let mounted = true;
    const images: HTMLImageElement[] = [];

    const preloadImages = async () => {
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

    preloadImages();

    return () => {
      mounted = false;
    };
  }, [totalFrames, basePath]);

  // Quand toutes les images sont chargées
  useEffect(() => {
    if (loadedCount >= totalFrames) {
      setIsLoading(false);
    }
  }, [loadedCount, totalFrames]);

  // Auto-rotation au début
  useEffect(() => {
    if (isLoading || hasInteracted) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev % totalFrames) + 1);
    }, 100);

    // Arrêter après une rotation complète
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, totalFrames * 100);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoading, hasInteracted, totalFrames]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const deltaX = clientX - lastXRef.current;
      const sensitivity = 0.3; // Ajuster pour plus ou moins de sensibilité
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
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 rounded-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RotateCw className="w-12 h-12 text-orange-500" />
            </motion.div>
            <p className="mt-4 text-gray-600">
              Chargement... {Math.round((loadedCount / totalFrames) * 100)}%
            </p>
          </div>
        )}

        {/* Images - toutes préchargées, une seule visible */}
        {!isLoading && (
          <Image
            src={`${basePath}${String(currentFrame).padStart(3, "0")}.webp`}
            alt={`Vue 360° du RK01 - Image ${currentFrame}`}
            fill
            className="object-contain"
            priority
            draggable={false}
          />
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

      {/* Indicateur de frame (optionnel) */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <RotateCw className="w-4 h-4" />
          <span>Vue interactive 360°</span>
        </div>
      </div>
    </div>
  );
}
