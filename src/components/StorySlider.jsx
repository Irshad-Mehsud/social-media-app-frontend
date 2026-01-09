import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import StoryCard from "./StoryCard.jsx";
import StoryViewer from "./StoryViewer.jsx";

// Keep this as fallback/default "Your Story" card
const defaultYourStory = {
  id: 0,
  user: "Your Story",
  profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
  mediaUrl: null,
  mediaType: "create",
  isOwn: true,
};

const StorySlider = () => {
  const [stories, setStories] = useState([defaultYourStory]);
  const [groupedStories, setGroupedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollX, setScrollX] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [viewingStory, setViewingStory] = useState(null);
  const sliderRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Fetch stories from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/story');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }
        
        const data = await response.json();
        
        // Transform API data to match StoryCard expected format
        const transformedStories = data.map((story, index) => ({
          id: story._id || index + 1,
          userId: story.user?._id || story.user,
          user: story.user?.name || 'Unknown User',
          profilePicture: story.user?.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg',
          mediaUrl: story.image,
          mediaType: story.image?.includes('.mp4') || story.image?.includes('.webm') ? 'video' : 'image',
          hasNewStory: true,
          timestamp: calculateTimestamp(story.createdAt),
        }));
        
        // Group stories by user
        const grouped = groupStoriesByUser(transformedStories);
        
        // Combine "Your Story" with grouped stories
        setStories([defaultYourStory, ...transformedStories]);
        setGroupedStories([defaultYourStory, ...grouped]);
        setError(null);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError(err.message);
        // Keep default "Your Story" even on error
        setStories([defaultYourStory]);
        setGroupedStories([defaultYourStory]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Group stories by user - show only the latest story per user in cards
  const groupStoriesByUser = (stories) => {
    const userStories = {};
    
    stories.forEach(story => {
      const userId = story.userId;
      if (!userStories[userId]) {
        userStories[userId] = {
          ...story,
          storyCount: 1,
          allStories: [story]
        };
      } else {
        userStories[userId].storyCount++;
        userStories[userId].allStories.push(story);
      }
    });
    
    return Object.values(userStories);
  };

  // Helper function to calculate timestamp
  const calculateTimestamp = (createdAt) => {
    if (!createdAt) return 'now';
    
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'now';
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  // Responsive breakpoints and configurations
  const getResponsiveConfig = () => {
    const width = window.innerWidth;
    if (width < 480) {
      return { cardWidth: 110, visibleCards: 3, scrollAmount: 1, gap: 12 }; // Mobile - exactly 3 cards
    } else if (width < 640) {
      return { cardWidth: 110, visibleCards: 3, scrollAmount: 1, gap: 12 }; // Small mobile - 3 cards
    } else if (width < 768) {
      return { cardWidth: 115, visibleCards: 4, scrollAmount: 2, gap: 12 }; // Large mobile/small tablet
    } else if (width < 1024) {
      return { cardWidth: 120, visibleCards: 5, scrollAmount: 2, gap: 12 }; // Tablet
    } else if (width < 1280) {
      return { cardWidth: 120, visibleCards: 6, scrollAmount: 3, gap: 12 }; // Small desktop
    } else {
      return { cardWidth: 130, visibleCards: 7, scrollAmount: 3, gap: 12 }; // Large desktop
    }
  };

  const [config, setConfig] = useState(getResponsiveConfig());

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const newConfig = getResponsiveConfig();
      setConfig(newConfig);
      setScrollX(0); // Reset scroll on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    updateScrollButtons();
  }, [scrollX, config, groupedStories]);

  const updateScrollButtons = () => {
    if (sliderRef.current) {
      const maxScrollLeft = Math.max(0, (groupedStories.length - config.visibleCards) * (config.cardWidth + config.gap));
      setCanScrollLeft(scrollX > 0);
      setCanScrollRight(scrollX < maxScrollLeft);
    }
  };

  const scrollLeft = () => {
    setScrollX((prev) => {
      const scrollAmount = config.scrollAmount * (config.cardWidth + config.gap);
      const newX = Math.max(0, prev - scrollAmount);
      return newX;
    });
  };

  const scrollRight = () => {
    setScrollX((prev) => {
      const maxScroll = Math.max(0, (groupedStories.length - config.visibleCards) * (config.cardWidth + config.gap));
      const scrollAmount = config.scrollAmount * (config.cardWidth + config.gap);
      const newX = Math.min(maxScroll, prev + scrollAmount);
      return newX;
    });
  };

  // Touch handling for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        scrollRight(); // Swipe left - scroll right
      } else {
        scrollLeft(); // Swipe right - scroll left
      }
    }
    
    // Reset touch values
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Calculate container width for mobile to ensure exact 3 cards fit
  const getContainerWidth = () => {
    if (window.innerWidth < 640) {
      return config.visibleCards * config.cardWidth + (config.visibleCards - 1) * config.gap;
    }
    return '100%';
  };

  // Handle file selection for creating story
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    
    if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
      alert('Please select a valid image or video file');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('File size should not exceed 50MB');
      return;
    }

    // Get user ID from localStorage - check multiple possible keys
    const userId = localStorage.getItem('userId') || 
                   localStorage.getItem('user_id') || 
                   localStorage.getItem('id');
    
    // Try to parse user object if stored as JSON
    if (!userId) {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          const extractedUserId = userObj._id || userObj.id || userObj.userId;
          if (extractedUserId) {
            uploadStoryWithUserId(file, extractedUserId);
            return;
          }
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }

    if (!userId) {
      alert('Please login to create a story');
      console.error('User ID not found. Please check localStorage keys.');
      console.log('Available localStorage keys:', Object.keys(localStorage));
      return;
    }

    uploadStoryWithUserId(file, userId);
  };

  const uploadStoryWithUserId = (file, userId) => {
    // Create FormData for upload
    const formData = new FormData();
    formData.append('image', file);
    formData.append('user', userId);

    // Debug: Log FormData contents
    console.log('Uploading with user ID:', userId);
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);
    
    // Debug: Check what's actually in FormData
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Upload story
    uploadStory(formData);
  };

  const uploadStory = async (formData) => {
    try {
      console.log('Uploading story...');
      
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:5000/api/story', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: headers,
      });

      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response:', responseText);

      if (!response.ok) {
        let errorMessage = 'Failed to upload story';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);
      console.log('Story uploaded successfully:', data);
      
      // Refresh stories after successful upload
      const storiesResponse = await fetch('http://localhost:5000/api/story');
      if (storiesResponse.ok) {
        const updatedStoriesData = await storiesResponse.json();
        const transformedStories = updatedStoriesData.map((story, index) => ({
          id: story._id || index + 1,
          userId: story.user?._id || story.user,
          user: story.user?.name || 'Unknown User',
          profilePicture: story.user?.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg',
          mediaUrl: story.image,
          mediaType: story.image?.includes('.mp4') || story.image?.includes('.webm') ? 'video' : 'image',
          hasNewStory: true,
          timestamp: calculateTimestamp(story.createdAt),
        }));
        
        const grouped = groupStoriesByUser(transformedStories);
        setStories([defaultYourStory, ...transformedStories]);
        setGroupedStories([defaultYourStory, ...grouped]);
      }
      
      alert('Story uploaded successfully!');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error uploading story:', error);
      alert(`Failed to upload story: ${error.message}`);
    }
  };

  const handleCreateStoryClick = () => {
    fileInputRef.current?.click();
  };

  const handleStoryClick = (index) => {
    const clickedStory = groupedStories[index];
    
    // Don't open viewer for "Your Story" create button
    if (clickedStory.isOwn) {
      handleCreateStoryClick();
    } else {
      setViewingStory(index);
    }
  };

  const closeStoryViewer = () => {
    setViewingStory(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-6">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm mb-2">Error loading stories: {error}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex justify-center">
            <div 
              className="flex-shrink-0" 
              style={{ width: `${config.cardWidth}px` }}
              onClick={handleCreateStoryClick}
            >
              <StoryCard story={defaultYourStory} cardWidth={config.cardWidth} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="relative w-full">
            {/* Slider Container */}
            <div 
              className="overflow-hidden mx-auto"
              style={{
                width: window.innerWidth < 640 ? `${getContainerWidth()}px` : '100%'
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                ref={sliderRef}
                className="flex transition-transform duration-300 ease-out"
                style={{ 
                  transform: `translateX(-${scrollX}px)`,
                  gap: `${config.gap}px`
                }}
              >
                {groupedStories.map((story, index) => (
                  <div 
                    key={story.id || index}
                    className="flex-shrink-0 relative" 
                    style={{ width: `${config.cardWidth}px` }}
                    onClick={() => handleStoryClick(index)}
                  >
                    <StoryCard story={story} cardWidth={config.cardWidth} />
                    {/* Show story count badge if user has multiple stories */}
                    {story.storyCount && story.storyCount > 1 && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {story.storyCount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Left Navigation Button - Hidden on mobile */}
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute top-1/2 left-1 sm:left-2 -translate-y-1/2 bg-white border border-gray-300 p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 z-10 hidden sm:block"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} className="text-gray-600 sm:w-[18px] sm:h-[18px]" />
              </button>
            )}
            
            {/* Right Navigation Button - Hidden on mobile */}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute top-1/2 right-1 sm:right-2 -translate-y-1/2 bg-white border border-gray-300 p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 z-10 hidden sm:block"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} className="text-gray-600 sm:w-[18px] sm:h-[18px]" />
              </button>
            )}

            {/* Mobile scroll indicators - Only show if more stories than visible */}
            {window.innerWidth < 640 && groupedStories.length > config.visibleCards && (
              <div className="flex justify-center mt-3 sm:hidden">
                <div className="flex space-x-1">
                  {Array.from({ length: Math.ceil(groupedStories.length / config.visibleCards) }).map((_, index) => {
                    const currentPage = Math.floor(scrollX / (config.visibleCards * (config.cardWidth + config.gap)));
                    const isActive = currentPage === index;
                    return (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          isActive ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Story Viewer Modal - Pass all stories for the clicked user */}
      {viewingStory !== null && groupedStories[viewingStory] && (
        <StoryViewer
          stories={groupedStories[viewingStory].allStories || [groupedStories[viewingStory]]}
          initialIndex={0}
          onClose={closeStoryViewer}
        />
      )}
    </div>
  );
};

export default StorySlider;