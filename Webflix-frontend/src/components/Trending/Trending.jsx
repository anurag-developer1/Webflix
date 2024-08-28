
import React, { useEffect,useState,useMemo,useCallback,useRef } from "react"
import TrendingCard from "./TrendingCard";
import Loader from "../Loader/Loader";
import { baseurl } from "../../utils/baseurl";

const MemoizedTrendingCard = React.memo(TrendingCard);
function Trending() {
  const [trending, setTrending] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
     const scrollContainerRef = useRef(null);
     useEffect(() => {
        const handleWheel = (event) => {
          event.preventDefault();
          if (scrollContainerRef.current) {
            // Prioritize horizontal scrolling
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
              scrollContainerRef.current.scrollLeft += event.deltaX;
            } else {
              scrollContainerRef.current.scrollLeft += event.deltaY*2;
            }
          }
        };
      
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
          // Use the 'wheel' event instead of 'mousewheel'
          scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
      
          return () => {
            scrollContainer.removeEventListener('wheel', handleWheel);
          };
        }
      }, []);


    const fetchTrending = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await fetch(`${baseurl}/api/trending?page=${page}`);
            const data = await response.json();
            setTrending(prevTrending => [...prevTrending, ...data.results]);
            setHasMore(data.page < data.total_pages);
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error("Error fetching Trending:", error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
       
        fetchTrending();
    }, []);

    // Memoize all movies except the last batch
    const memoizedTrending = useMemo(() => {
        const lastBatchIndex = Math.max(0, trending.length - 20); // Assuming 20 trending per page
        return trending.slice(0, lastBatchIndex);
    }, [trending]);

    // Get the last batch of movies
    const lastBatchTrending = useMemo(() => {
        const lastBatchIndex = Math.max(0, trending.length - 20);
        return trending.slice(lastBatchIndex);
    }, [trending]);

    // Intersection Observer setup
    const observer = useRef();
    const lastTrendingElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchTrending();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchTrending]);
   // useEffect(() => {
   
    return (
        <>
      
      <section className="relative p-2 mt-0 mb-2 sm:mb-16 lg:ml-[145px] max-w-full overflow-x-hidden">
  <h2 className="mb-2 text-light text-xl font-light sm:text-[32px] lg:mb-10">
    Trending last week
  </h2>
  
  <div className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-scroll pb-2 sm:gap-10  " ref={scrollContainerRef}  >
  {memoizedTrending.map((trendingitem,index) => (
                    <MemoizedTrendingCard key={`${trendingitem.id}-${index}`} trendingitem={trendingitem} />
                ))}
                {lastBatchTrending.map((trendingitem, index) => (
                    <div key={`${trendingitem.id}-${index}`} ref={index === lastBatchTrending.length - 1 ? lastTrendingElementRef : null}>
                        <MemoizedTrendingCard trendingitem={trendingitem}  />
                    </div>
                ))}
  </div>
  {loading && <Loader />}
  {!hasMore && <p>No more Trending to load</p>}
</section>
    </>
    )
}

export default Trending
