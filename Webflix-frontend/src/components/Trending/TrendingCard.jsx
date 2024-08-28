import { SvgIcon } from "../SvgIcon/SvgIcon";
import { IconName, getIconByName } from "../../utils/getIconByName";
import Info from "../Info/Info";
import { useSelector,useDispatch } from "react-redux";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { baseurl } from "../../utils/baseurl";
import { setMovieBookmarks,setTvseriesBookmarks } from "../../reduxstateslices/userInfoSlice.js";
import { useNavigate } from "react-router-dom";

function TrendingCard(props) {
  const [isBookmarked, setIsBookmarked] = useState(false);  
  const {movieBookmarks,tvseriesBookmarks,isLoggedIn} = useSelector((state) => state.userInfo);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  useEffect(() => {
     //if not logged in set isBookmarked to false and return
    if(!isLoggedIn){setIsBookmarked(false)}

    // Check if the movie is already bookmarked
    
    if(props.trendingitem.media_type==="movie" && isLoggedIn){
      const isBookmarked = movieBookmarks.some((bookmark) => bookmark.details.id === props.trendingitem.id);
    setIsBookmarked(isBookmarked);
    }

    else if(props.trendingitem.media_type==="tv" && isLoggedIn){
      const isBookmarked = tvseriesBookmarks.some((bookmark) => bookmark.details.id === props.trendingitem.id);
    setIsBookmarked(isBookmarked);
    }
    
  }, [movieBookmarks, props.trendingitem.id, tvseriesBookmarks, isLoggedIn,props.trendingitem.media_type]);
  const handleBookmark = async () => {
    if(!isLoggedIn){toast.error('Please login to bookmark');navigate('/login');return}
    
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
        body: JSON.stringify({mediaType: props.trendingitem.media_type, details: props.trendingitem}),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }
  
      // If successful, update Redux store
      const actionPayload = {
        action: action,
        mediaType: props.trendingitem.media_type,
        details: props.trendingitem
      };
  
      if (props.trendingitem.media_type === "movie") {
        dispatch(setMovieBookmarks(actionPayload));
      } else if (props.trendingitem.media_type === "tv") {
        dispatch(setTvseriesBookmarks(actionPayload));
      }
  
    } catch (error) {
      // If there's an error, revert the optimistic update
      setIsBookmarked(!newBookmarkState);
      // Show error message to user
      console.error('Error updating bookmark:', error);
      // You might want to show a toast or some other UI element to inform the user
    }
  };


  const handleNavigateToDetails = (e) => {
    // Prevent navigation if the click was on the bookmark button or play button
    if (e.target.closest('button') || e.target.closest('.cursor-pointer')) {
      return;
    }
    console.log(props.trendingitem)
    navigate('/details', { state: { movieData: props.trendingitem,mediaType:props.trendingitem.media_type } });
  };

    return (
        <div className="relative min-w-[230px] snap-start sm:min-w-[410px] lg:min-w-[470px]">
      <div
       onClick={handleNavigateToDetails}
        className="min-w-[230px] snap-start sm:min-w-[410px] lg:min-w-[470px]"
      >
        <div className="relative overflow-hidden rounded-lg " >
          <>
            <img
              className="object-cover duration-1000 hover:scale-110 w-full h-full max-w-[470px]  "
              alt="movie image"
             

            
              
              src={`https://image.tmdb.org/t/p/w780${props.trendingitem.backdrop_path}`}
            />

            <div className="absolute bottom-2 left-2 rounded-md bg-dark bg-opacity-50 p-2">
             <Info 
             year={props.trendingitem.release_date?.slice(0, 4)}
             icon={props.trendingitem.media_type=== 'movie' ? IconName.MOVIE :props.trendingitem.media_type=== 'tv' ? IconName.TV : null}
             language={props.trendingitem.original_language}
             rating={props.trendingitem.vote_average} />

              <h3 className="text-sm font-medium leading-[18px] text-light sm:text-lg sm:leading-6">
                {props.trendingitem.media_type=== 'movie' ?`${props.trendingitem.title}`:`${props.trendingitem.name}`}
              </h3>
            </div>
          </>
        </div>
      </div>

      <div
        className=
          'hover: absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-dark bg-opacity-50 opacity-100 transition hover:bg-light  sm:right-4 sm:top-4  '
            
      >
        <button onClick={handleBookmark} >
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
    )
}

export default TrendingCard
