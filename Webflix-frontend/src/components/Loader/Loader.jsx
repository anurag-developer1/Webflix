//This is loader which activates when data is loading. 
function Loader() {
    return (
        <div className="pointer-events-none fixed z-50 bottom-0 left-0 right-0 top-0 flex items-center justify-center">
          <div
            className=
              'h-12 w-12 animate-spin rounded-full border-4 border-b-primary border-light'
           
          />
        </div>
      );
}

export default Loader
