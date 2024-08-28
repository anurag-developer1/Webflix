import  { useState, useEffect } from 'react';
import { baseurl } from '../../utils/baseurl';

function TrailerPlayer({ mediaType, id }) {
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await fetch(`${baseurl}/api/trailer?mediaType=${mediaType}&id=${id}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setTrailerKey(data.results[0].key);
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
      }
    };

    fetchTrailer();
  }, [mediaType, id]);

  if (!trailerKey) return null;

  return (
    <div className="absolute inset-0 z-10 bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

export default TrailerPlayer;