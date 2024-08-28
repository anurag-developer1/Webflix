//This component displays the movie card by accepting the relevant data through props.

import  { useState, useEffect } from "react";
import { SvgIcon } from "../SvgIcon/SvgIcon";
import { useDispatch,useSelector } from "react-redux";
import { IconName, getIconByName } from "../../utils/getIconByName";
import MovieSlider from "../Movieslider/MovieSlider";
import Info from "../Info/Info";
import TVseriesSlider from "../TVseriesSlider/TVseriesSlider.jsx";
import TrailerPlayer from "../TrailerPlayer/TrailerPlayer.jsx";
import { setMovieBookmarks,setTvseriesBookmarks } from "../../reduxstateslices/userInfoSlice.js";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import{baseurl} from "../../utils/baseurl.jsx";

function MovieCard(props) {
  // Declare state variables
  const [isHovering, setIsHovering] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const dispatch=useDispatch();
  const {movieBookmarks,tvseriesBookmarks,isLoggedIn} = useSelector((state) => state.userInfo); 
  const navigate = useNavigate();

 //This functions navigates to details page and provides the movie data to it. 
  const handleNavigateToDetails = (e) => {
    // Prevent navigation if the click was on the bookmark button or play button
    if (e.target.closest('button') || e.target.closest('.cursor-pointer')) {
      return;
    }
    console.log(props.movie)
    navigate('/details', { state: { movieData: props.movie,mediaType:props.mediaType } });
  };

  useEffect(() => {
    //if not logged in set isBookmarked to false and return
    if(!isLoggedIn){setIsBookmarked(false);return}

    // Check if the movie is already bookmarked.The bookmark icon in ui will be updated accordingly.
    
    if(props.mediaType==="movie" && isLoggedIn){
      const isBookmarked = movieBookmarks.some((bookmark) => bookmark.details.id === props.movie.id);
    setIsBookmarked(isBookmarked);
    }

    else if(props.mediaType==="tv" && isLoggedIn){
      const isBookmarked = tvseriesBookmarks.some((bookmark) => bookmark.details.id === props.movie.id);
    setIsBookmarked(isBookmarked);
    }
    
  }, [movieBookmarks, props.movie.id, tvseriesBookmarks, isLoggedIn,props.mediaType]);


  const handleBookmark = async () => {
    
    //Bookmark adding or removing feature is available only to logged in users.
    if(!isLoggedIn){toast.error('Please login to bookmark');navigate('/login'); return}
    
    
    // Optimistically update UI
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
  
    try {
      // Determine the action
      const action = newBookmarkState ? 'add' : 'remove';
  
      // Make API request
      const response = await fetch(`${baseurl}/api/bookmark?userId=${localStorage.getItem('userId')}&action=${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Assuming you're using JWT
        },
        body: JSON.stringify({mediaType: props.mediaType, details: props.movie}),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }
  
      // If successful, update Redux store
      const actionPayload = {
        action: action,
        mediaType: props.mediaType,
        details: props.movie
      };
  
      if (props.mediaType === "movie") {
        dispatch(setMovieBookmarks(actionPayload));
      } else if (props.mediaType === "tv") {
        dispatch(setTvseriesBookmarks(actionPayload));
      }
  
    } catch (error) {
      // If there's an error, revert the optimistic update
      setIsBookmarked(!newBookmarkState);
      // Show error message to user
      console.error('Error updating bookmark:', error);
     //Show error message to user
      toast.error('An error occurred. Please try again.');
    }
  };


  return (

    <div
      className="min-w-[140px] sm:min-w-[180px] lg:min-w-[250px]  "
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowTrailer(false);}}
        onClick={handleNavigateToDetails}
        
        
    >
      <div className="relative mb-2 select-none overflow-hidden rounded-lg pt-[56.25%] ">
        <div className={`absolute bottom-0 left-0 right-0 top-0`}>
          {showTrailer ? (
            <TrailerPlayer mediaType={props.mediaType} id={props.movie.id} />
          ) : isHovering ? (
            props.mediaType === "movie" ? (
              <MovieSlider
                movieId={props.movie.id}
                isHovering={isHovering}
                posterPath={`https://image.tmdb.org/t/p/w780${props.movie.backdrop_path}`}
              />
            ) : (
              <TVseriesSlider
                tvseriesId={props.movie.id}
                isHovering={isHovering}
                posterPath={`https://image.tmdb.org/t/p/w780${props.movie.backdrop_path}`}
              />
            )
          ) : (
            <img
  src={
    props.movie.backdrop_path || props.movie.poster_path
      ? `https://image.tmdb.org/t/p/w780${props.movie.backdrop_path || props.movie.poster_path}`
      : 'https://via.placeholder.com/780x439/1a1a1a/ffffff?text=No+Image+Available'
  }
  alt="Movie poster"
  className="w-full h-full object-cover"
/>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all duration-300 hover:bg-opacity-60 hover:opacity-100">
          {/* Play button */}
          <div
            className="flex items-center justify-center w-fit cursor-pointer gap-2 sm:gap-5 rounded-full bg-white bg-opacity-25 p-1 md:p-2 md:pr-4 text-[1rem] md:text-lg transition hover:bg-opacity-50"
            onClick={() => setShowTrailer(true)}
          >
            <SvgIcon
              className="h-[1.5rem] w-[1.5rem] md:h-[30px] md:w-[30px] fill-white"
              viewBox="0 0 30 30"
            >
              {getIconByName(IconName.PLAY)}
            </SvgIcon>
            <p className="text-white">Play</p>
          </div>

          {/* Bookmark button */}
          <div className="absolute right-2 top-2 flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-black bg-opacity-50 transition hover:bg-white sm:right-4 sm:top-4">
          <button onClick={handleBookmark}>
  <SvgIcon
    className={`h-[1.5rem] w-[1.5rem] md:h-[32px] md:w-[32px] cursor-pointer 
      ${isBookmarked ? "fill-red-500 active:fill-red-500" : "fill-white"}
      stroke-white stroke-[1.5] hover:stroke-black active:fill-white`}
    viewBox="-10 -9 38 38"
  >
    {getIconByName(IconName.BOOKMARK)}
  </SvgIcon>
</button>
          </div>
        </div>
      </div>
      <Info
        year={props.movie.release_date?.slice(0, 4)}
        icon={
          props.mediaType === "movie"
            ? IconName.MOVIE
            : props.mediaType === "tv"
            ? IconName.TV
            : null
        }
        language={props.movie.original_language}
        rating={props.movie.vote_average}
      />
      <div className="mt-2 text-md font-medium text-white break-words">
        {props.mediaType === "movie" ? props.movie.title : props.movie.name}
      </div>
    </div>
  
  );
}

export default MovieCard;
