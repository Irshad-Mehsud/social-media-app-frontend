import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const StoryViewer = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);
  const progressInterval = useRef(null);

  const currentStory = stories[currentIndex];
  const isVideo = currentStory.mediaType === 'video';
  const imageDuration = 5000; // 5 seconds for images

  useEffect(() => {
    if (isPaused) return;

    if (isVideo && videoRef.current) {
      // Handle video
      videoRef.current.play();
      
      const updateProgress = () => {
        if (videoRef.current) {
          const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
          setProgress(progress);
        }
      };

      const interval = setInterval(updateProgress, 100);
      progressInterval.current = interval;

      return () => clearInterval(interval);
    } else {
      // Handle image
      setProgress(0);
      const duration = imageDuration;
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / duration) * 100;
        
        if (newProgress >= 100) {
          goToNext();
        } else {
          setProgress(newProgress);
        }
      }, 50);

      progressInterval.current = interval;

      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused, isVideo]);

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleVideoEnded = () => {
    goToNext();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'Escape') onClose();
    if (e.key === ' ') {
      e.preventDefault();
      togglePause();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isPaused]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <img
            src={currentStory.profilePicture}
            alt={currentStory.user}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-white font-semibold">{currentStory.user}</p>
            <p className="text-gray-300 text-sm">{currentStory.timestamp}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={togglePause}
            className="text-white hover:bg-white/20 p-2 rounded-full transition"
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-10"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-10"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      )}

      {/* Story content */}
      <div className="relative max-w-lg w-full h-full max-h-[90vh] flex items-center justify-center">
        {isVideo ? (
          <video
            ref={videoRef}
            src={currentStory.mediaUrl}
            className="max-w-full max-h-full rounded-lg object-contain"
            onEnded={handleVideoEnded}
            onClick={togglePause}
          />
        ) : (
          <img
            src={currentStory.mediaUrl}
            alt={currentStory.user}
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={togglePause}
          />
        )}
      </div>

      {/* Click areas for navigation */}
      <div className="absolute inset-0 flex">
        <div className="w-1/3 h-full cursor-pointer" onClick={goToPrevious} />
        <div className="w-1/3 h-full cursor-pointer" onClick={togglePause} />
        <div className="w-1/3 h-full cursor-pointer" onClick={goToNext} />
      </div>
    </div>
  );
};

export default StoryViewer;
