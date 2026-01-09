import React from "react";
import { Plus } from "lucide-react";

const StoryCard = ({ story, cardWidth = 120 }) => {
  const { user, profilePicture, mediaUrl, mediaType, isOwn, hasNewStory, timestamp } = story;
  
  // Calculate responsive heights and sizes based on card width
  const cardHeight = Math.floor(cardWidth * 1.6); // Maintain aspect ratio
  const profileSize = cardWidth < 110 ? 6 : 8; // Smaller profile pics on mobile
  const fontSize = cardWidth < 110 ? 'text-xs' : 'text-sm';
  const iconSize = cardWidth < 110 ? 12 : 16;

  if (isOwn) {
    // Your Story card
    return (
      <div className="relative cursor-pointer group">
        <div 
          className="rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 hover:scale-105 transition-transform duration-200"
          style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
        >
          {/* Profile picture background */}
          <div 
            className="bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${profilePicture})`,
              height: `${cardHeight * 0.75}px`
            }}
          />
          
          {/* Bottom section */}
          <div 
            className="bg-white flex items-end justify-center pb-2 sm:pb-4 relative"
            style={{ height: `${cardHeight * 0.25}px` }}
          >
            {/* Plus icon */}
            <div 
              className="absolute bg-blue-500 rounded-full border-2 sm:border-4 border-white flex items-center justify-center"
              style={{ 
                top: `-${cardWidth < 110 ? 8 : 10}px`,
                width: `${cardWidth < 110 ? 24 : 28}px`,
                height: `${cardWidth < 110 ? 24 : 28}px`
              }}
            >
              <Plus size={iconSize} className="text-white" />
            </div>
          </div>
        </div>
        
        {/* User name */}
        <p className={`${fontSize} font-medium text-gray-800 mt-1 sm:mt-2 text-center truncate px-1`}>
          Create Story
        </p>
      </div>
    );
  }

  return (
    <div className="relative cursor-pointer group">
      <div 
        className="rounded-lg sm:rounded-xl overflow-hidden relative hover:scale-105 transition-transform duration-200"
        style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
      >
        {/* Story content */}
        {mediaType === "image" ? (
          <img
            src={mediaUrl}
            alt={`${user}'s story`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <video
            src={mediaUrl}
            className="w-full h-full object-cover"
            muted
            loop
            preload="metadata"
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        
        {/* Profile picture */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <div className={`p-0.5 rounded-full ${hasNewStory ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' : 'bg-gray-300'}`}>
            <div className="bg-white p-0.5 rounded-full">
              <img
                src={profilePicture}
                alt={user}
                className={`w-${profileSize} h-${profileSize} rounded-full object-cover`}
                style={{ width: `${profileSize * 4}px`, height: `${profileSize * 4}px` }}
              />
            </div>
          </div>
        </div>
        
        {/* Timestamp */}
        {timestamp && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/50 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
            <span className="text-xs text-white font-medium">{timestamp}</span>
          </div>
        )}
        
        {/* User name */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
          <p className={`text-white ${fontSize} font-medium truncate drop-shadow-md`}>
            {user}
          </p>
        </div>
        
        {/* New story indicator */}
        {hasNewStory && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-t-lg sm:rounded-t-xl" />
        )}
      </div>
    </div>
  );
};

export default StoryCard;