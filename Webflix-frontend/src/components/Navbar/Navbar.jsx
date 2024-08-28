import { SvgIcon } from "../SvgIcon/SvgIcon";
import { IconName, getIconByName } from "../../utils/getIconByName";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn, resetUserInfoState ,setAvatar} from "../../reduxstateslices/userInfoSlice";
import { baseurl } from "../../utils/baseurl";

function Navbar() {
  const dispatch = useDispatch();
  const { isLoggedIn,avatar } = useSelector((store) => store.userInfo);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);//this creates a reference to a dom element that is saved across renders

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${baseurl}/api/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.isValid) {
        
       
        return true;
      } else {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userId');
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };

  
  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        const isAuthenticated = await checkAuthStatus();
        dispatch(setIsLoggedIn(isAuthenticated));
        
       
      } catch (error) {
        console.error("Authentication error:", error);
        // Handle error appropriately
      } finally {
        setIsLoading(false);
      }
    };
  
    verifyAuth();
  }, [dispatch]);

  //delete token and userinfo on logout and reset the redux store to initial state
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    
    dispatch(resetUserInfoState());
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      const userId = localStorage.getItem('userId');
      formData.append('userId', userId);
  
      try {
        setIsLoading(true);
        const uploadResponse = await fetch(`${baseurl}/api/upload-avatar`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          },
          body: formData,
        });
  
        if (uploadResponse.ok) {
          console.log('Avatar uploaded successfully');
          
          // Fetch the updated profile picture URL
          const profilePicResponse = await fetch(`${baseurl}/api/profilepic?userId=${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
          });
  
          if (profilePicResponse.ok) {
            const profilePicData = await profilePicResponse.json();
            if (profilePicData.profilePicUrl) {
              dispatch(setAvatar(profilePicData.profilePicUrl));
              console.log('Profile picture updated in state');
            } else {
              console.error('profilePicUrl not found in response data');
            }
          } else {
            console.error('Failed to fetch profile picture. Status:', profilePicResponse.status);
          }
        } else {
          console.error('Avatar upload failed');
        }
      } catch (error) {
        console.error('Error in file upload process:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className="
      absolute left-0 right-0 top-0
      sm:left-6 sm:right-6 sm:py-6
      lg:fixed lg:bottom-0 lg:left-0 lg:top-0 lg:w-40 lg:p-8
      "
    >   
      {isLoading && <Loader />}
      <div
        className="flex h-full items-center justify-between p-4 transition duration-500 sm:rounded-xl sm:hover:shadow-md lg:flex-col lg:rounded-[20px] lg:p-7 bg-semi-dark"
      >
        <div className="flex items-center justify-end xs:gap-4 gap-8 lg:gap-16 lg:flex-col">
          <Link to="/home">
            <SvgIcon
              className="h-8 w-8 transition hover:opacity-75 fill-primary"
              viewBox="0 0 32 26"
            >
              {getIconByName(IconName.LOGO)}
            </SvgIcon>
          </Link>

          <ul className="flex xs:gap-2 gap-4 sm:gap-8 lg:relative lg:flex-col fill-light">
            <li>
              <Link to="/home">
                <SvgIcon className='h-5 w-5 fill-grey transition hover:fill-primary'>
                  {getIconByName(IconName.HOME)}
                </SvgIcon>
              </Link>
            </li>
            <li>
              <Link to="/movies">
                <SvgIcon className='h-5 w-5 fill-grey transition hover:fill-primary'>
                  {getIconByName(IconName.MOVIE)}
                </SvgIcon>
              </Link> 
            </li>
            <li>
              <Link to="/tvseries">
                <SvgIcon className='h-5 w-5 fill-grey transition hover:fill-primary'>
                  {getIconByName(IconName.TV)}
                </SvgIcon>
              </Link>
            </li>
            <li>
             <Link to="/bookmarks">
                <SvgIcon className='h-5 w-5 fill-grey transition hover:fill-primary'>
                  {getIconByName(IconName.BOOKMARK)}
                </SvgIcon>
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-4 lg:flex-col">
          <div className="relative">
            {isLoggedIn ? (
              <div className="flex items-center">
                <button
                  type="button"
                  className="flex items-center gap-2 p-1 mr-2 rounded bg-primary hover:bg-light text-dark transition-all"
                  aria-label="logout"
                  title="Logout"
                  onClick={handleLogout}
                >
                  <SvgIcon
                    className="transition-color h-6 w-6 fill-none stroke-dark p-1 sm:h-8 sm:w-8 lg:h-5 lg:w-5"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    {getIconByName(IconName.EXIT)}
                  </SvgIcon>
                </button>
                <div 
                  className="relative h-8 w-8 overflow-hidden rounded-full border border-light bg-primary sm:h-8 sm:w-8 lg:h-10 lg:w-10 cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  {avatar? <img 
      src={avatar} 
      alt="Profile" 
      className="w-full h-full object-cover"
    /> : null}
                  <SvgIcon
                    className="fill-semi-dark px-1 pt-1"
                    viewBox="0 0 24 24"
                  >
                    {getIconByName(IconName.AVATAR)}
                  </SvgIcon>
                </div>
                {!avatar && <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  formEncType="multipart/form-data"
                  accept="image/*"
                />}
              </div>
            ) : (
              <Link to="/signup">
                <button className="block">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-light bg-primary sm:h-8 sm:w-8 lg:h-10 lg:w-10">
                    <SvgIcon
                      className="fill-semi-dark px-1 pt-1"
                      viewBox="0 0 24 24"
                    >
                      {getIconByName(IconName.AVATAR)}
                    </SvgIcon>
                  </div>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;