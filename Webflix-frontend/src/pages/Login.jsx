import  { useState } from 'react';
import { SvgIcon } from "../components/SvgIcon/SvgIcon";
import { IconName, getIconByName } from "../utils/getIconByName";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { setIsLoggedIn,setAvatar,setMovieBookmarks,setTvseriesBookmarks } from '../reduxstateslices/userInfoSlice';
import { baseurl } from '../utils/baseurl';



const Loader = () => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const fetchBookmarks = async (userId, token) => {
    try {
      const response = await fetch(`${baseurl}/api/fetchbookmarks?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      

      if (response.ok) {
        dispatch(setMovieBookmarks(data.movieBookmarks || []));
        dispatch(setTvseriesBookmarks(data.tvSeriesBookmarks || []));
      } else {
        console.error('Failed to fetch bookmarks');
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${baseurl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('jwtToken', data.jwtToken);
        localStorage.setItem('userId', data.userId);
        
        dispatch(setIsLoggedIn(true));

        // Fetch profile picture
        try {
          const profilePicResponse = await fetch(`${baseurl}/api/profilepic?userId=${data.userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${data.jwtToken}`
            }
          });

          if (profilePicResponse.ok) {
            const profilePicData = await profilePicResponse.json();
            if (profilePicData.profilePicUrl) {
              dispatch(setAvatar(profilePicData.profilePicUrl));
            } else {
              console.error('profilePicUrl not found in response data');
            }
          } else {
            console.error('Failed to fetch profile picture. Status:', profilePicResponse.status);
          }
        } catch (profilePicError) {
          console.error('Error fetching profile picture:', profilePicError);
        }

        // Fetch bookmarks
        await fetchBookmarks(data.userId, data.jwtToken);

        navigate('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='mt-10 lg:mt-0  flex h-screen flex-col items-center justify-center gap-20 bg-dark'>
      {isLoading && <Loader />} {/* Display loader when isLoading is true */}
      <>
        <a href="/">
          <SvgIcon
            className="h-8 w-8 transition hover:opacity-75 fill-primary scale-150"
            viewBox="0 0 32 26"
          >
            {getIconByName(IconName.LOGO)}
          </SvgIcon>
        </a>

        <div className='font-body flex w-4/5 flex-col rounded-3xl px-8 pb-28 pt-8 text-light sm:w-1/2 lg:w-1/3 xl:w-1/4 bg-semi-dark'>
          <h1 className="font-body mb-16 text-center text-3xl">Login</h1>
          <div className="flex flex-col gap-y-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-6 text-xl">
              <input
                type="email"
                placeholder="Email address"
                className="bg-semi-dark border-b-2 border-least-dark focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="bg-semi-dark border-b-2 border-least-dark focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" className="bg-primary text-light rounded-md w-fit p-2 mx-auto" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div><p className='text-center mr-2'>Don't have an account?<span className='text-primary ml-2 '><Link to='/signup'>Sign up</Link></span> </p></div>
          </div>
        </div>
      </>
    </section>
  );
}

export default Login;