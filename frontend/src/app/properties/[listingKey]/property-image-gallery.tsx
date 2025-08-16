// src/app/properties/[listingKey]/property-image-gallery.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, Share2, Check } from "lucide-react";
import { MediaItem } from "@/types/property";

interface PropertyImageGalleryProps {
  images: MediaItem[];
  title: string;
  address?: string;
  price?: string;
}

export function PropertyImageGallery({ 
  images, 
  title,
  address,
  price
}: PropertyImageGalleryProps) {
  // Core state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [thumbnailImages, setThumbnailImages] = useState<MediaItem[]>([]);
  
  // Refs
  const preloadedImages = useRef<Set<number>>(new Set([0]));
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  
  // Filter medium images for main carousel and thumbnail images for the thumbnail carousel
  useEffect(() => {
    if (!images.length) return;
    
    // Find thumbnail images that match the order of our medium images
    const thumbnails: MediaItem[] = [];
    
    // For each medium image, find its corresponding thumbnail
    images.forEach(mediumImage => {
      const matchingThumbnail = images.find(img => 
        img.order === mediumImage.order && 
        img.image_size_description === "Thumbnail"
      );
      
      // If found, add it; otherwise, use the medium image
      if (matchingThumbnail) {
        thumbnails.push(matchingThumbnail);
      } else {
        thumbnails.push(mediumImage);
      }
    });
    
    setThumbnailImages(thumbnails);
  }, [images]);

  // Simple navigation functions
  function goToNext() {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
  }
  
  function goToPrev() {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
  }
  
  // Open the lightbox
  function openLightbox() {
    setLightboxOpen(true);
    // Lock the body scroll
    document.body.style.overflow = 'hidden';
  }
  
  // Close the lightbox
  function closeLightbox() {
    setLightboxOpen(false);
    // Restore scrolling
    document.body.style.overflow = '';
  }
  
  // Share the listing
  function shareListing() {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `${title}${price ? ` - ${price}` : ''}${address ? ` - ${address}` : ''}`,
        url: window.location.href
      }).catch(() => {
        // Fallback if share fails
        copyToClipboard();
      });
    } else {
      // Fallback for browsers that don't support share API
      copyToClipboard();
    }
  }
  
  // Copy listing URL to clipboard
  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    });
  }
  
  // Preload an image
  function preloadImage(index: number) {
    if (index < 0 || index >= images.length) return;
    if (preloadedImages.current.has(index)) return;
    
    const img = new window.Image();
    img.src = images[index].media_url || "";
    img.onload = () => {
      preloadedImages.current.add(index);
    };
  }
  
  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!thumbnailsRef.current || images.length <= 1) return;
    
    try {
      // Get the active thumbnail element directly
      const activeThumb = document.getElementById(`thumbnail-${currentImageIndex}`);
      if (!activeThumb) return;
      
      // Use scrollIntoView with behavior: 'smooth' and block: 'nearest' for best mobile experience
      activeThumb.scrollIntoView({ 
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    } catch (e) {
      console.error('Error scrolling thumbnail into view:', e);
    }
  }, [currentImageIndex, images.length]);
  
  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          closeLightbox();
          break;
      }
    }
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentImageIndex, images.length]);
  
  // Preload images when current image changes
  useEffect(() => {
    if (images.length <= 1) return;
    
    // Preload next and previous
    const nextIndex = (currentImageIndex + 1) % images.length;
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    
    preloadImage(nextIndex);
    preloadImage(prevIndex);
  }, [currentImageIndex, images.length]);
  
  // Clean up when unmounting
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  // Preload first few images on mount
  useEffect(() => {
    // Preload the first 3 images
    for (let i = 0; i < Math.min(3, images.length); i++) {
      preloadImage(i);
    }
  }, [images.length]);
  
  // Handle empty state
  if (images.length === 0) {
    return (
      <div className="h-96 lg:h-[500px] bg-gray-200 flex items-center justify-center">
        <div className="text-gray-400">No images available</div>
      </div>
    );
  }

  // Make sure we have medium images for the main carousel
  const mediumImages = images.filter(img => img.image_size_description === "Medium");
  const displayImages = mediumImages.length > 0 ? mediumImages : images;

  return (
    <>
      {/* Main gallery */}
      <div className="relative">
        <div 
          className="relative h-96 lg:h-[500px] overflow-hidden bg-gray-100"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Current image - using medium image */}
          <div className="absolute inset-0 bg-gray-200">
            <Image
              src={displayImages[currentImageIndex]?.media_url || ""}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
              priority={currentImageIndex === 0}
              onError={(e) => {
                // Hide the image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Navigation arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Image counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full z-10">
              {currentImageIndex + 1} / {displayImages.length}
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex space-x-2 z-10">
            <button
              onClick={openLightbox}
              className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
              aria-label="View larger image"
            >
              <ZoomIn className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={shareListing}
              className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors relative"
              aria-label="Share property listing"
            >
              {copiedToClipboard ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Share2 className="h-5 w-5 text-gray-600" />
              )}
              
              {/* Copy toast notification */}
              {copiedToClipboard && (
                <div className="absolute right-0 top-12 bg-black/80 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-20">
                  Link copied to clipboard!
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Thumbnail navigation - using thumbnail images */}
        {displayImages.length > 1 && (
          <div className="mt-4 relative">
            {/* Thumbnail container with hidden scrollbar for cleaner look */}
            <div 
              ref={thumbnailsRef} 
              className="overflow-x-auto py-2 scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
              }}
            >
              {/* Fixed-width container to ensure consistent spacing */}
              <div className="flex px-4 mx-auto" style={{ width: 'max-content' }}>
                {thumbnailImages.map((image, index) => {
                  const isActive = currentImageIndex === index;
                  return (
                    <button
                      id={`thumbnail-${index}`}
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 mx-2 rounded overflow-hidden transition-all duration-200 ${
                        isActive 
                          ? "border-2 border-primary-600 scale-105 shadow-md" 
                          : "border border-transparent opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`View image ${index + 1}`}
                      aria-current={isActive ? "true" : "false"}
                    >
                      <div className="bg-gray-200 w-full h-full">
                        <Image
                          src={image.media_url || ""}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                          onError={(e) => {
                            // Show fallback content when thumbnail fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Gradient fades on edges to indicate scrollability */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          </div>
        )}
      </div>

      {/* Lightbox - with better overlay and swipe support */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-30"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Share button */}
          <button
            onClick={(e) => { e.stopPropagation(); shareListing(); }}
            className="absolute top-4 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-30 flex items-center"
            aria-label="Share property listing"
          >
            {copiedToClipboard ? (
              <>
                <Check className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-white text-sm">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-6 w-6 text-white mr-2" />
                <span className="text-white text-sm">Share Listing</span>
              </>
            )}
          </button>

          {/* Lightbox container with touch support */}
          <div 
            className="relative flex-1 flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Image container */}
            <div className="relative w-full h-full max-w-7xl max-h-[80vh] mx-auto bg-gray-200">
              <Image
                src={displayImages[currentImageIndex]?.media_url || ""}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
                onError={(e) => {
                  // Show fallback content when image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* Navigation arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                  className="absolute left-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  className="absolute right-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-20"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox footer with property info - improved styling */}
          <div className="bg-black w-full py-4 px-4 flex flex-col items-center z-20">
            <div className="mb-2 text-white">{currentImageIndex + 1} / {displayImages.length}</div>
            {(title || price || address) && (
              <div className="bg-black/90 px-4 py-2 rounded-lg max-w-2xl w-full text-center text-white">
                {title && <div className="font-semibold">{title}</div>}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm mt-1">
                  {price && <span className="opacity-90">{price}</span>}
                  {address && <span className="bg-gray-800 px-2 py-1 rounded text-gray-200 w-full sm:w-auto text-center">{address}</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}