import MovieCard from "../../components/Moviecard/MovieCard";
import Loader from "../../components/Loader/Loader";
import Searchbar from "../../components/Searchbar/Searchbar";
import Trending from "../../components/Trending/Trending";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import React from "react";
import { baseurl } from "../../utils/baseurl";

// Memoized MovieCard component
const MemoizedMovieCard = React.memo(MovieCard);

function TVSeries() {
  const [tvSeries, setTVSeries] = useState([]);
  const [tvSeriesPage, setTVSeriesPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreTVSeries, setHasMoreTVSeries] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [prevSearchQuery, setPrevSearchQuery] = useState("");
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(true);
  const [searchResultsPage, setSearchResultsPage] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [hasMoreFilteredResults, setHasMoreFilteredResults] = useState(true);
  const [filteredResultsPage, setFilteredResultsPage] = useState(1);
  
  const handleGenreFilter = useCallback(async () => {
    if (loading || !hasMoreFilteredResults) return;
    
    setLoading(true);
    try {
      const genreQuery = selectedGenres.join("|");
      const response = await fetch(
        `${baseurl}/api/searchTVSeriesWithGenres?page=${filteredResultsPage}&with_genres=${genreQuery}`
      );
      const data = await response.json();
      
      setFilteredResults(prevResults => 
        filteredResultsPage === 1 ? data.results : [...prevResults, ...data.results]
      );
      setHasMoreFilteredResults(data.page < data.total_pages);
      setFilteredResultsPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Error filtering TV series:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMoreFilteredResults, filteredResultsPage, selectedGenres]);

  useEffect(() => {
    if (selectedGenres.length > 0) {
      setFilteredResults([]);
      setFilteredResultsPage(1);
      setHasMoreFilteredResults(true);
      handleGenreFilter();
    } else {
      setFilteredResults([]);
      setHasMoreFilteredResults(true);
    }
  }, [selectedGenres]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
        setSearchResults([]);
        setHasMoreSearchResults(true);
        setSearchResultsPage(1);
        setPrevSearchQuery('');
        return;
    }
    
    if (loading || !hasMoreSearchResults) return;
    
    setLoading(true);
    try {
        let currentPage = searchResultsPage;
        if (prevSearchQuery !== searchQuery) {
            currentPage = 1;
            setSearchResults([]);
        } else {
            currentPage = searchResultsPage + 1;
        }
        
        const response = await fetch(`${baseurl}/api/searchTVSeries?query=${searchQuery}&page=${currentPage}`);
        const data = await response.json();
        
        setSearchResults(prevResults => currentPage === 1 ? data.results : [...prevResults, ...data.results]);
        setHasMoreSearchResults(data.page < data.total_pages);
        setSearchResultsPage(currentPage);
        setPrevSearchQuery(searchQuery);
    } catch (error) {
        console.error("Error searching TV series:", error);
    } finally {
        setLoading(false);
    }
  }, [searchQuery, loading, hasMoreSearchResults, searchResultsPage, prevSearchQuery]);

  useEffect(() => {
    if (searchQuery.trim() && searchQuery !== prevSearchQuery) {
        const delayDebounce = setTimeout(() => {
            setSearchResults([]);
            setSearchResultsPage(1);
            handleSearch();
        }, 150); // 150ms delay to avoid too many API calls
    
        return () => clearTimeout(delayDebounce);
    }
  }, [searchQuery, prevSearchQuery, handleSearch]);

  const fetchTVSeries = useCallback(async () => {
    if (loading || !hasMoreTVSeries) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${baseurl}/api/popularTVSeries?page=${tvSeriesPage}`
      );
      const data = await response.json();

      if (tvSeriesPage === 1) {
        setTVSeries(data.results);
      } else {
        setTVSeries((prevTVSeries) => [...prevTVSeries, ...data.results]);
      }

      setHasMoreTVSeries(data.page < data.total_pages);
      if (data.page < data.total_pages) {
        setTVSeriesPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching TV series:", error);
    } finally {
      setLoading(false);
    }
  }, [tvSeriesPage, loading, hasMoreTVSeries]);

  useEffect(() => {
    if (tvSeriesPage === 1) {
      fetchTVSeries();
    }
  }, []);

  // Memoize all TV series except the last batch
  const memoizedTVSeries = useMemo(() => {
    const lastBatchIndex = Math.max(0, tvSeries.length - 20); // Assuming 20 TV series per page
    return tvSeries.slice(0, lastBatchIndex);
  }, [tvSeries]);

  // Get the last batch of TV series
  const lastBatchTVSeries = useMemo(() => {
    const lastBatchIndex = Math.max(0, tvSeries.length - 20);
    return tvSeries.slice(lastBatchIndex);
  }, [tvSeries]);

  // Memoize all search results except the last batch
  const memoizedSearchResults = useMemo(() => {
    const lastBatchIndex = Math.max(0, searchResults.length - 20); // Assuming 20 results per page
    return searchResults.slice(0, lastBatchIndex);
  }, [searchResults]);

  // Get the last batch of search results
  const lastBatchSearchResults = useMemo(() => {
    const lastBatchIndex = Math.max(0, searchResults.length - 20);
    return searchResults.slice(lastBatchIndex);
  }, [searchResults]);

  // Intersection Observer setup for TV series
  const observerTVSeries = useRef();
  const lastTVSeriesElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerTVSeries.current) observerTVSeries.current.disconnect();
      observerTVSeries.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreTVSeries) {
          fetchTVSeries();
        }
      });
      if (node) observerTVSeries.current.observe(node);
    },
    [loading, hasMoreTVSeries, fetchTVSeries]
  );

  // Intersection Observer setup for search results. As soon as the last search result is visible, fetch more
  const observerSearchResults = useRef();
  const lastSearchResultElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerSearchResults.current)
        observerSearchResults.current.disconnect();
      observerSearchResults.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreSearchResults) {
          handleSearch();
        }
      });
      if (node) observerSearchResults.current.observe(node);
    },
    [loading, hasMoreSearchResults, handleSearch]
  );

  const observerFilteredResults = useRef();
  const lastFilteredResultElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerFilteredResults.current) observerFilteredResults.current.disconnect();
      observerFilteredResults.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreFilteredResults) {
          handleGenreFilter();
        }
      });
      if (node) observerFilteredResults.current.observe(node);
    },
    [loading, hasMoreFilteredResults, handleGenreFilter]
  );

  return (
    <>
      <Searchbar
        filterActive={filterActive}
        setFilterActive={setFilterActive}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        setPrevSearchQuery={setPrevSearchQuery}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mediaType={'TV series'}
      />
      <Trending />
      <h2 className="mb-2 p-2 text-light text-xl font-light sm:text-[32px] lg:mb-10 lg:ml-40">
    Popular TV series
  </h2>
      <div className="lg:ml-36">
        <section
          className="px-2 mt-2 lg:mt-2 xs:grid-cols-1 grid grid-cols-2 gap-4 sm:grid-cols-3 
         sm:gap-x-7 sm:gap-y-6 xl:grid-cols-4 xl:gap-x-10 xl:gap-y-8 overflow-x-auto mx-2 my-1"
        >
          {searchQuery ? (
            <>
              {memoizedSearchResults.map((series,index) => (
                <MemoizedMovieCard  key={`${series.id}-${index}`} movie={series} mediaType={'tv'} />
              ))}
              {lastBatchSearchResults.map((series, index) => (
                <div
                  key={`${series.id}-${index}`}
                  ref={
                    index === lastBatchSearchResults.length - 1
                      ? lastSearchResultElementRef
                      : null
                  }
                >
                  <MemoizedMovieCard movie={series}  mediaType={'tv'}/>
                </div>
              ))}
            </>
          ) : selectedGenres.length > 0 ? (
            <>
              {filteredResults.slice(0, -1).map((series,index) => (
                <MemoizedMovieCard key={`${series.id}-${index}`} movie={series} mediaType={'tv'} />
              ))}
              {filteredResults.length > 0 && (
                <div ref={lastFilteredResultElementRef}>
                  <MemoizedMovieCard movie={filteredResults[filteredResults.length - 1]} mediaType={'tv'} />
                </div>
              )}
            </>
          ) : (
            <>
              {memoizedTVSeries.map((series,index) => (
                <MemoizedMovieCard key={`${series.id}-${index}`} movie={series}  mediaType={'tv'}/>
              ))}
              {lastBatchTVSeries.map((series, index) => (
                <div
                  key={`${series.id}-${index}`}
                  ref={
                    index === lastBatchTVSeries.length - 1
                      ? lastTVSeriesElementRef
                      : null
                  }
                >
                  <MemoizedMovieCard movie={series} mediaType={'tv'} />
                </div>
              ))}
            </>
          )}
        </section>
        {loading && <Loader />}
        {!hasMoreTVSeries && !searchQuery && <p>No more TV series to load</p>}
        {!hasMoreSearchResults && searchQuery && (
          <p>No more search results to load</p>
        )}
      </div>
    </>
  );
}

export default TVSeries;