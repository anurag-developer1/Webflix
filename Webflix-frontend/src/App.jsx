import { Routes, Route, useLocation } from 'react-router-dom';
import Movies from './pages/Movies/Movies';
import Navbar from './components/Navbar/Navbar';
import TVSeries from './pages/TVseries/TVseries';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Bookmarks from './pages/Bookmarks/Bookmarks';
import Details from './pages/Details';
import Home from './pages/Home';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  

  return (
    <div className='bg-[#10141E] selection:bg-primary'>
     <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tvseries" element={<TVSeries />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/bookmarks' element={<Bookmarks />} />
          <Route path ='/details' element={<Details />} />
          <Route path="/home" element={<Home />} />
        </Routes>
        <ToastContainer/>
        
      </main>
    </div>
  );
}

export default App;
