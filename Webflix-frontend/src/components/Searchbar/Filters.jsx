//filter component 

const genres = [
  { id: 'action', name: 'Action', value: '28' },
  { id: 'comedy', name: 'Comedy', value: '35' },
  { id: 'drama', name: 'Drama', value: '18' },
  { id: 'sci-fi', name: 'Sci-Fi', value: '878' },
  { id: 'thriller', name: 'Thriller', value: '53' },
  { id: 'horror', name: 'Horror', value: '27' },
  { id: 'romance', name: 'Romance', value: '10749' },
  { id: 'animation', name: 'Animation', value: '16' },
  { id: 'adventure', name: 'Adventure', value: '12' },
  { id: 'fantasy', name: 'Fantasy', value: '14' },
  // tmdb genres and genre id
];

function Filters(props) {
  const handleGenreChange = (value) => {
    props.setSelectedGenres(prevGenres =>
      prevGenres.includes(value)
        ? prevGenres.filter(genre => genre !== value)
        : [...prevGenres, value]
    );
  };

  const applyFilters = (e) => {
    e.preventDefault();
    props.handleFilter(e);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 bg-opacity-90 rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Filter Movies/TVseries</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {genres.map(genre => (
            <div key={genre.id} className="flex items-center">
              <input
                type="checkbox"
                id={`genre-${genre.id}`}
                name="genre[]"
                value={genre.value}
                checked={props.selectedGenres.includes(genre.value)}
                onChange={() => handleGenreChange(genre.value)}
                className="hidden"
              />
              <label
                htmlFor={`genre-${genre.id}`}
                className={`
                  cursor-pointer px-4 py-2 rounded-full text-sm font-medium
                  transition-colors duration-200 ease-in-out
                  ${props.selectedGenres.includes(genre.value)
                    ? 'bg-primary text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                `}
              >
                {genre.name}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={applyFilters} className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors duration-200">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filters;
