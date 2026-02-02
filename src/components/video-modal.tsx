"use client";

// ============================================
// REKAIRE - Video Modal Component (Premium Design)
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
      <motion.button
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center gap-3 px-6 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-full border-2 border-gray-200 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-md"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-20" />
        </span>
        <span className="font-semibold">{buttonText}</span>
      </motion.button>

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
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-12 lg:inset-20 z-50 flex items-center justify-center"
            >
              <div className="relative w-full max-w-5xl">
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={handleClose}
                  className="absolute -top-12 right-0 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group"
                >
                  <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
                </motion.button>

                {/* Video Container */}
                <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
