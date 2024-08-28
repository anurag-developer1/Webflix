import React from "react";
import MovieCard from "../../components/Moviecard/MovieCard";

import {  useSelector } from "react-redux";


const MemoizedMovieCard = React.memo(MovieCard);

function Bookmarks() {
  
  
  const { movieBookmarks, tvseriesBookmarks } = useSelector((state) => state.userInfo);

  console.log("Movie Bookmarks:", movieBookmarks);
  console.log("TV Series Bookmarks:", tvseriesBookmarks);

  

 

  if (!movieBookmarks.length && !tvseriesBookmarks.length) {
    return <p className= "text-light text-center mt-[50vh] text-2xl sm:text-3xl">No bookmarks found.</p>;
  }

  return (
    <>
    <section className="sm:mt-[100px] p-2 lg:mt-8">
      <h1 className="lg:pt-2 pt-20 sm:pt-5 text-center mb-2 p-2 text-light text-2xl font-bold sm:text-[40px] lg:mb-10 lg:ml-40 ">
        Your Bookmarks
      </h1>
      
      <div className="lg:ml-36">
        {movieBookmarks.length > 0 && (
          <>
            <h2 className="mb-2 p-2 text-light text-xl font-light sm:text-[32px] lg:mb-5">
              Movie Bookmarks
            </h2>
            <section className="px-2 mt-2 lg:mt-2 xs:grid-cols-1 grid grid-cols-2 gap-4 sm:grid-cols-3 
              sm:gap-x-7 sm:gap-y-6 xl:grid-cols-4 xl:gap-x-10 xl:gap-y-8 overflow-x-auto mx-2 my-1">
              {movieBookmarks.map((movie) => (
                <MemoizedMovieCard key={movie.details.id} movie={movie.details} mediaType={'movie'} />
              ))}
            </section>
          </>
        )}
        
        {tvseriesBookmarks.length > 0 && (
          <>
            <h2 className="mb-2 mt-10 p-2 text-light text-xl font-light sm:text-[32px] lg:mb-5">
              TV Series Bookmarks
            </h2>
            <section className="px-2 mt-2 lg:mt-2 xs:grid-cols-1 grid grid-cols-2 gap-4 sm:grid-cols-3 
              sm:gap-x-7 sm:gap-y-6 xl:grid-cols-4 xl:gap-x-10 xl:gap-y-8 overflow-x-auto mx-2 my-1">
              {tvseriesBookmarks.map((tvSeries) => (
                <MemoizedMovieCard key={tvSeries.details.id} movie={tvSeries.details} mediaType={'tv'} />
              ))}
            </section>
          </>
        )}
      </div>
      </section>
    </>
  );
}

export default Bookmarks;