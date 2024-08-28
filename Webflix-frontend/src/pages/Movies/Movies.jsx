import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import debounce from 'lodash/debounce';
import MovieCard from "../../components/Moviecard/MovieCard";
import Loader from "../../components/Loader/Loader";
import Searchbar from "../../components/Searchbar/Searchbar";
import Trending from "../../components/Trending/Trending";
import { baseurl } from "../../utils/baseurl";


// Memoized MovieCard component
const MemoizedMovieCard = React.memo(MovieCard);

function Movies() {
  const [movies, setMovies] = useState([]);
  const [moviesPage, setMoviesPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsPage, setSearchResultsPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(true);
  
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [hasMoreFilteredResults, setHasMoreFilteredResults] = useState(true);
  
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const filteredResultsPageRef = useRef(1);
  

  const handleSearch = useCallback(async (query, page) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasMoreSearchResults(true);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(`${baseurl}/api/searchMovies?query=${query}&page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      
      setSearchResults(prevResults => 
        page === 1 ? data.results : [...prevResults, ...data.results]
      );
      setHasMoreSearchResults(data.page < data.total_pages);
      setSearchResultsPage(data.page);
    } catch (error) {
      setSearchError(error.message);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setSearchResultsPage(1);
      handleSearch(query, 1);
    }, 300),
    [handleSearch]
  );

  useEffect(() => {
    if (searchInputValue.trim()) {
      debouncedSearch(searchInputValue);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [searchInputValue, debouncedSearch]);

  const handleGenreFilter = useCallback(async (page) => {
    if (loading || !hasMoreFilteredResults || isLoadingMore) return;
    
    setIsLoadingMore(true);
    setLoading(true);
    try {
      const genreQuery = selectedGenres.join("|");
      const response = await fetch(
        `${baseurl}/api/searchMoviesWithGenres?page=${page}&with_genres=${genreQuery}`
      );
      const data = await response.json();
      
      setFilteredResults(prevResults => 
        page === 1 ? data.results : [...prevResults, ...data.results]
      );
      setHasMoreFilteredResults(data.page < data.total_pages);
      filteredResultsPageRef.current = data.page; // Update the ref instead of state
    } catch (error) {
      console.error("Error filtering movies:", error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [selectedGenres]);
  
  // Effect to handle genre changes
  useEffect(() => {
    if (selectedGenres.length > 0) {
      setFilteredResults([]);
      setHasMoreFilteredResults(true);
      filteredResultsPageRef.current = 1; // Reset the ref instead of state
      handleGenreFilter(1);
    } else {
      setFilteredResults([]);
      setHasMoreFilteredResults(true);
      filteredResultsPageRef.current = 1; // Reset the ref instead of state
    }
  }, [selectedGenres]);
  
  // Separate useEffect for pagination
  useEffect(() => {
    if (selectedGenres.length > 0 && filteredResultsPageRef > 1) {
      handleGenreFilter(filteredResultsPageRef);
    }
  }, [filteredResultsPageRef, selectedGenres, handleGenreFilter]);
  
  
  const fetchMovies = useCallback(async () => {
    if (loading || !hasMoreMovies) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${baseurl}/api/popularMovies?page=${moviesPage}`
      );
      const data = await response.json();

      if (moviesPage === 1) {
        setMovies(data.results);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      }

      setHasMoreMovies(data.page < data.total_pages);
      if (data.page < data.total_pages) {
        setMoviesPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }, [moviesPage, loading, hasMoreMovies]);

  useEffect(() => {
    if (moviesPage === 1) {
      fetchMovies();
    }
  }, []);

  // Memoize all movies except the last batch
  const memoizedMovies = useMemo(() => {
    const lastBatchIndex = Math.max(0, movies.length - 20); // Assuming 20 movies per page
    return movies.slice(0, lastBatchIndex);
  }, [movies]);

  // Get the last batch of movies
  const lastBatchMovies = useMemo(() => {
    const lastBatchIndex = Math.max(0, movies.length - 20);
    return movies.slice(lastBatchIndex);
  }, [movies]);

  // Intersection Observer setup for movies
  const observerMovies = useRef();
  const lastMovieElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerMovies.current) observerMovies.current.disconnect();
      observerMovies.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreMovies) {
          fetchMovies();
        }
      });
      if (node) observerMovies.current.observe(node);
    },
    [loading, hasMoreMovies, fetchMovies]
  );

  // Intersection Observer setup for search results
  const observerSearchResults = useRef();
  const lastSearchResultElementRef = useCallback(
    (node) => {
      if (isSearching) return;
      if (observerSearchResults.current) observerSearchResults.current.disconnect();
      observerSearchResults.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreSearchResults) {
          handleSearch(searchQuery, searchResultsPage + 1);
        }
      });
      if (node) observerSearchResults.current.observe(node);
    },
    [isSearching, hasMoreSearchResults, handleSearch, searchQuery, searchResultsPage]
  );

  const observerFilteredResults = useRef();
  const lastFilteredResultElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerFilteredResults.current) observerFilteredResults.current.disconnect();
      observerFilteredResults.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreFilteredResults && !isLoadingMore) {
          handleGenreFilter(filteredResultsPageRef.current + 1);
        }
      });
      if (node) observerFilteredResults.current.observe(node);
    },
    [loading, hasMoreFilteredResults, isLoadingMore, handleGenreFilter]
  );

  return (
    <>
      <Searchbar
        filterActive={filterActive}
        setFilterActive={setFilterActive}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        searchQuery={searchInputValue}
        setSearchQuery={setSearchInputValue}
        mediaType={'movies'}
      />
      <Trending />
      <h2 className="mb-2 p-2 text-light text-xl font-light sm:text-[32px] lg:mb-10 lg:ml-40">
        Popular Movies
      </h2>
      <div className="lg:ml-36">
        <section
          className="px-2 mt-2 lg:mt-2 xs:grid-cols-1 grid grid-cols-2 gap-4 sm:grid-cols-3 
         sm:gap-x-7 sm:gap-y-6 xl:grid-cols-4 xl:gap-x-10 xl:gap-y-8 overflow-x-auto mx-2 my-1"
        >
          {searchQuery ? (
            <>
              {searchResults.map((movie, index) => (
                <div
                  key={`${movie.id}-${index}`}
                  ref={index === searchResults.length - 1 ? lastSearchResultElementRef : null}
                >
                  <MemoizedMovieCard movie={movie} mediaType={'movie'} />
                </div>
              ))}
              {isSearching && <Loader />}
              {searchError && <p>Error: {searchError}</p>}
              {!hasMoreSearchResults && <p>No more search results to load</p>}
            </>
          ) : selectedGenres.length > 0 ? (
            <>
              {filteredResults.map((movie, index) => (
                <div
                  key={`${movie.id}-${index}`}
                  ref={index === filteredResults.length - 1 ? lastFilteredResultElementRef : null}
                >
                  <MemoizedMovieCard movie={movie} mediaType={'movie'} />
                </div>
              ))}
            </>
          ) : (
            <>
              {memoizedMovies.map((movie) => (
                <MemoizedMovieCard key={movie.id} movie={movie} mediaType={'movie'} />
              ))}
              {lastBatchMovies.map((movie, index) => (
                <div
                  key={`${movie.id}-${index}`}
                  ref={index === lastBatchMovies.length - 1 ? lastMovieElementRef : null}
                >
                  <MemoizedMovieCard movie={movie} mediaType={'movie'} />
                </div>
              ))}
            </>
          )}
        </section>
        {loading && <Loader />}
        {!hasMoreMovies && !searchQuery && !selectedGenres.length && <p>No more movies to load</p>}
        {!hasMoreFilteredResults && selectedGenres.length > 0 && <p>No more filtered results to load</p>}
      </div>
    </>
  );
}

export default Movies;
