//This component shows a slideshow of movie or series images once the user hovers the mouse over the card.
import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { IconName, getIconByName } from '../../utils/getIconByName';
import { SvgIcon } from '../SvgIcon/SvgIcon';
import { baseurl } from '../../utils/baseurl';

const MovieSlider = ({ movieId, isHovering, posterPath }) => {
  //Declare necessary state variables.
  const [imagesPaths, setImagesPaths] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);


  const intervalId = useRef(null);
  
 //This useEffect fetches the image paths(array of image urls) for the movie and sets them in the state.
  useEffect(() => {
    const fetchImagePaths = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${baseurl}/api/imagePathsMovie?movieId=${movieId}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
       

        if (!data.backdrops || !Array.isArray(data.backdrops) || data.backdrops.length === 0) {
          console.error("Unexpected data format or empty backdrops array:", data);
          setImagesPaths([]);
          return;
        }

        const paths = data.backdrops.slice(0, 5);
        
        setImagesPaths(paths);
      } catch (error) {
        console.error('Error fetching image paths:', error);
        setImagesPaths([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImagePaths();
  }, [movieId]);
  
  //This use effect now uses the image paths to fetch the actual images and set them in the state.
  useEffect(() => {
    if (imagesPaths.length > 0) {
      imagesPaths.forEach((imagePath, index) => {
        const img = new Image();
        img.src = imagePath;
        img.onload = () => {
          setLoadedImages(prev => {
            const newLoadedImages = { ...prev, [imagePath]: true };
            if (index === 0) {
              setIsFirstImageLoaded(true);
            }
            return newLoadedImages;
          });
        };
      });
    }
  }, [imagesPaths]);
 
  //This useEffect starts the slideshow.
  useEffect(() => {
    const startSlideshow = () => {
      const intervalDuration = isHovering ? 3000 : 10000;
      intervalId.current = setInterval(handleSlideRight, intervalDuration);
    };

    if (isFirstImageLoaded) {
      startSlideshow();
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [movieId, isHovering, imagesPaths.length, isFirstImageLoaded]);

  const handleSlideRight = () => {
    setCurrentSlide(prev => {
      if (prev === imagesPaths.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };
 
  //slideshow logic
  const handleSlideLeft = () => {
    setCurrentSlide(prev => (prev === 0 ? imagesPaths.length - 1 : prev - 1));
  };
  //using swipeable library to handle slideshow
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      handleSlideRight();
      resetInterval();
    },
    onSwipedRight: () => {
      handleSlideLeft();
      resetInterval();
    },
    delta: 10,
    swipeDuration: 1000,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const resetInterval = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    const intervalDuration = isHovering ? 3000 : 10000;
    intervalId.current = setInterval(handleSlideRight, intervalDuration);
  };

  const hasOneImage = imagesPaths.length <= 1;

  return (
    <div className="relative w-full h-full">
      {/* Background poster image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${posterPath})` }}
      />

      {/* Overlay to ensure visibility of slider content */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="select-none rounded-lg pt-[56.25%]" {...handlers}>
          <div className="absolute bottom-0 left-0 right-0 top-0">
            { imagesPaths.length === 0&& !isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white">No images available</span>
              </div>
            ) : (
              imagesPaths.map((imageUrl, index) => (
                <div
                  key={imageUrl}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    opacity: loadedImages[imageUrl] ? (index === currentSlide ? 1 : 0) : 0,
                    transition: 'opacity 0.5s ease-in-out'
                  }}
                >
                  <img
                    className="w-full h-full object-cover"
                    alt={`movie image ${index + 1}`}
                    src={imageUrl}
                    onError={(e) => {
                      console.error(`Failed to load image: ${e.target.src}`);
                      e.target.onerror = null;
                      e.target.src = imagesPaths[0];
                    }}
                  />
                </div>
              ))
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 top-0 rounded-lg border-2 border-dark" />
        </div>

        {!hasOneImage && !isLoading && imagesPaths.length > 0 && (
          <>
            <button
              className="absolute bottom-0 left-0 top-0 hidden w-1/2 items-center justify-start bg-gradient-to-r from-dark to-transparent p-10 text-light opacity-0 transition duration-500 hover:opacity-50 sm:flex"
              onClick={() => { handleSlideLeft(); resetInterval(); }}
            >
              <SvgIcon
                className="h-10 w-10 -rotate-90 fill-semi-dark"
                viewBox="5 5 38 38"
              >
                {getIconByName(IconName.ARROW_UP)}
              </SvgIcon>
            </button>

            <button
              className="absolute bottom-0 right-0 top-0 hidden w-1/2 items-center justify-end bg-gradient-to-l from-light to-transparent p-10 opacity-0 transition duration-500 hover:opacity-100 sm:flex"
              onClick={() => { handleSlideRight(); resetInterval(); }}
            >
              <SvgIcon
                className="h-10 w-10 rotate-90 fill-semi-dark"
                viewBox="5 5 38 38"
              >
                {getIconByName(IconName.ARROW_UP)}
              </SvgIcon>
            </button>
          </>
        )}
      </div>

      
    </div>
  );
};

export default MovieSlider;