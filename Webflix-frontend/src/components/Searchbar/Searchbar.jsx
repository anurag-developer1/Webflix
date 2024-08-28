import { SvgIcon } from "../SvgIcon/SvgIcon";
import { IconName, getIconByName } from "../../utils/getIconByName";

import Filters from "./Filters";

function Searchbar(props) {
  const handleFilter = (e) => {
    e.preventDefault();
    props.setFilterActive(prevState => !prevState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // We don't need to call onSearch here anymore
  };

  const handleInputChange = (e) => {
    props.setSearchQuery(e.target.value);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <label
          className="
            flex cursor-text items-center
            gap-4 py-4 sm:mb-6 sm:gap-6 sm:py-2
            sm:text-2xl lg:mt-0 mt-[70px] sm:mt-[98px]
            lg:pt-8 ml-10 mr-10
            bg-dark rounded-lg
            lg:ml-[145px]
          "
        >
          <SvgIcon
            className="h-6 w-6 sm:h-8 sm:w-8 fill-light"
            viewBox="0 0 24 24"
          >
            {getIconByName(IconName.SEARCH)}
          </SvgIcon>
          <input
            value={props.searchQuery}
            onChange={handleInputChange}
            type="text"
            placeholder={`Search for ${props.mediaType}`}
            className="
              w-full border-b border-opacity-0 p-2 font-light
              placeholder-dark caret-primary outline-none
              placeholder:opacity-50 focus:border-b-grey
              border-b-dark bg-dark text-light placeholder:text-light
            "
          />
          
          <button onClick={handleFilter} type="button" className="cursor-pointer">
            <SvgIcon
              className="h-6 w-6 sm:h-8 sm:w-8 fill-light stroke-width-1"
              viewBox="0 0 24 24"
            >
              {getIconByName(IconName.FILTER)}
            </SvgIcon>
          </button>
        </label>
      </form>
      {props.filterActive && (
        <Filters 
          handleFilter={handleFilter} 
          selectedGenres={props.selectedGenres} 
          setSelectedGenres={props.setSelectedGenres} 
          setFilterActive={props.setFilterActive} 
        />
      )}
    </div>
  );
}

export default Searchbar;