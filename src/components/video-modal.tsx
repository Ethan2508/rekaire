"use client";

// ============================================
// REKAIRE - Video Modal Component
// ============================================

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

interface VideoModalProps {
  videoSrc: string;
  buttonText?: string;
}

export function VideoModal({ videoSrc, buttonText = "Voir la vidéo" }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-3 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm group"
      >
        <span className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </span>
        <span className="font-medium">{buttonText}</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-12 lg:inset-24 z-50 flex items-center justify-center"
            >
              <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Video */}
                <video
                  ref={videoRef}
                  src={videoSrc}
                  controls
                  className="w-full aspect-video"
                  playsInline
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
