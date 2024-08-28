import React, { useEffect, useState, useMemo } from "react";
import MovieCard from "../components/Moviecard/MovieCard";
import Loader from "../components/Loader/Loader";

import Trending from "../components/Trending/Trending";
import Footer from "../components/Footer/Footer";
import { baseurl } from "../utils/baseurl";

// Memoized MovieCard component
const MemoizedMovieCard = React.memo(MovieCard);

function Homepage() {
  const [movies, setMovies] = useState([]);
  const [tvSeries, setTvSeries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseurl}/api/popularMovies?page=1`
      );
      const data = await response.json();
      setMovies(data.results.slice(0, 14));
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTvSeries = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseurl}/api/popularTvSeries?page=1`
      );
      const data = await response.json();
      setTvSeries(data.results.slice(0, 14));
    } catch (error) {
      console.error("Error fetching TV series:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchTvSeries();
  }, []);

  // Memoize movies and TV series
  const memoizedMovies = useMemo(() => movies, [movies]);
  const memoizedTvSeries = useMemo(() => tvSeries, [tvSeries]);

  return (
    <>
      <div className=" mt-[70px] sm:mt-[100px] lg:mt-8"><Trending /></div>
      
      <div className="lg:ml-36">
        <h2 className="mb-2 p-2 text-light text-xl font-light sm:text-[32px] lg:mb-5 lg:ml-0">
          Recommended Movies For You
        </h2>
        <section className="px-2 mt- lg:mt-2 xs:grid-cols-1 grid grid-cols-2 gap-4 sm:grid-cols-3 
         sm:gap-x-7 sm:gap-y-6 xl:grid-cols-4 xl:gap-x-10 xl:gap-y-8 overflow-x-auto mx-2 my-1">
          {memoizedMovies.map((movie,index) => (
            <MemoizedMovieCard key={`${movie.id}-${3*index}`} movie={movie} mediaType="movie" />
          ))}
        </section>

        <h2 className="mb-2 p-2 text-light text-xl font-light sm:text-[32px] lg:mb-5 lg:ml-0 mt-10">
         Recommended TV Series For You
        </h2>
        <section className="px-2 mt-2 lg:mt-2 xs:grid-cols-1 grid grid-cols-2 gap-4 sm:grid-cols-3 
         sm:gap-x-7 sm:gap-y-6 xl:grid-cols-4 xl:gap-x-10 xl:gap-y-8 overflow-x-auto mx-2 my-1">
          {memoizedTvSeries.map((series,index) => (
            <MemoizedMovieCard key={`${series.id}-${2*index}`} movie={series} mediaType="tv" />
          ))}
        </section>
        <Footer/>
      </div>
      {loading && <Loader />}
    </>
  );
}

export default Homepage;