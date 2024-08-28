import {useEffect,useState} from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { baseurl } from '../utils/baseurl';
import {toast} from 'react-toastify';

const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

const Loader = () => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);


function Details() {
  const location = useLocation();
  const { movieData, mediaType } = location.state || {};
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [website, setWebsite] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  console.log(movieData)
  const handleWebsite = () => {
    if(!website){toast.error("Website not available")}
    return
  }
  const handlePlayTrailer = () => {
    setIsPlayingTrailer(true);
    if(!trailerKey){toast.error("Trailer not available")}
    
    return
  };
   
  useEffect(() => {
    const fetchAdditionalDetails = async () => {
      if (!movieData || !movieData.id || !mediaType) {
        return;
      }
  
      setIsLoading(true);
      try {
        const response = await fetch(`${baseurl}/api/castandwebsite?mediaType=${mediaType}&movieId=${movieData.id}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
  
        setCast(data.cast || []);
        setWebsite(data.website || '');
        
        
  
      } catch (error) {
        console.error("Error fetching additional details:", error);
        
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTrailer = async () => {
      try {
        const response = await fetch(`${baseurl}/api/trailer?mediaType=${mediaType}&id=${movieData.id}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setTrailerKey(data.results[0].key);
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
      }
    };

  
    fetchAdditionalDetails();
    fetchTrailer();
  }, [movieData, mediaType]);


  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  if (!movieData) {
    return <div>Loading...</div>;
  }

  return (

    
    <section className="sm:mt-20 flex flex-col p-4 md:p-8 max-w-7xl mx-auto mt-16 lg:ml-40"> {/* Added mt-16 for navbar space */}
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/3 mx-auto lg:mx-0">
        <div className="relative pb-[150%] overflow-hidden rounded-lg shadow-lg">
          <img
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={`https://image.tmdb.org/t/p/w780${movieData.poster_path || movieData.backdrop_path}`}
            alt="show poster"
          />
        </div>
      </div>
      <div className="show-info text-white flex-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">
          {mediaType === 'movie' ? movieData.title : movieData.name}
        </h1>
        <p className="tagline text-base sm:text-lg md:text-xl text-gray-300 mb-4">{movieData.tagline}</p>
        <div className="rating flex items-center mb-4">
          <span className="score text-lg sm:text-xl md:text-2xl font-bold mr-2">{movieData.vote_average.toFixed(1)}</span>
          <div className="flex">{renderStars(movieData.vote_average)}</div>
        </div>
        <div className="show-metadata grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold">Language</h3>
            <p>{movieData.original_language}</p>
          </div>
          <div>
            <h3 className="font-semibold">{mediaType === 'movie' ? 'Release Date' : 'First Air Date'}</h3>
            <p>{mediaType === 'movie' ? movieData.release_date : movieData.first_air_date}</p>
          </div>
          {mediaType === 'tv' && (
            <div>
              <h3 className="font-semibold">Last Air Date</h3>
              <p>{movieData.last_air_date}</p>
            </div>
          )}
        </div>
        <div className="genres mb-6">
          <h3 className="font-semibold mb-2">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {movieData.genre_ids.map((genreId) => (
              <span key={genreId} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {genreMap[genreId] || "Unknown Genre"}
              </span>
            ))}
          </div>
        </div>
        <div className="synopsis mb-6">
          <h3 className="font-semibold mb-2">Synopsis</h3>
          <p className="text-gray-300">{movieData.overview}</p>
        </div>
        <div className="cast mb-6">
          <h3 className="font-semibold mb-2">Cast</h3>
          <div className="flex flex-wrap gap-2">
            {cast.map((actor) => (
              <span key={actor.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {actor.name}
              </span>
            ))}
          </div>
        </div>
        <button onClick={handleWebsite} className="mr-2 mb-2 website-button bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          {website ? <a href={website} target="_blank" rel="noopener noreferrer">
            Website
          </a> : <p>Website</p>}
          
        </button>
        <button className="ml-2 mt-2 website-button bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={handlePlayTrailer}>
          
            Play Trailer
          
        </button>
      </div>
    </div>
    {isLoading && <Loader />}
    {isPlayingTrailer && trailerKey && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div className="relative w-full max-w-4xl aspect-video">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; encrypted-media"
      />
      <button
        className="absolute top-4 right-4 bg-dark text-primary p-2 rounded hover:bg-gray-700"
        onClick={() => setIsPlayingTrailer(false)}
      >
        Close
      </button>
    </div>
  </div>
)}


  </section>
  );
}

export default Details;