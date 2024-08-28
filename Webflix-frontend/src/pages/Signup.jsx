import  { useState } from 'react';
import { SvgIcon } from "../components/SvgIcon/SvgIcon";
import { IconName, getIconByName } from "../utils/getIconByName";
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { baseurl } from '../utils/baseurl';
const Loader = () => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setError('');
    setIsLoading(true);

    

    try {
      const response = await fetch(`${baseurl}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password,username }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Redirect to login page or dashboard
         navigate('/login');

      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.')
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='mt-12 lg:mt-0 flex h-screen flex-col items-center justify-center gap-20 bg-dark'>
      <>
      {isLoading && <Loader />}
          <SvgIcon
            className="h-8 w-8 transition hover:opacity-75 fill-primary scale-150"
            viewBox="0 0 32 26"
          >
            {getIconByName(IconName.LOGO)}
          </SvgIcon>
       

        <div className='font-body flex w-4/5 flex-col rounded-3xl px-8 pb-28 pt-8 text-light sm:w-1/2 lg:w-1/3 xl:w-1/4 bg-semi-dark'>
          <h1 className="font-body mb-16 text-center text-3xl">Sign Up</h1>
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
              <input
                type="text"
                placeholder="username"
                className="bg-semi-dark border-b-2 border-least-dark focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" className="bg-primary text-light rounded-md w-fit p-2 mx-auto">
                Create an account
              </button>
            </form>
            <div><p className='text-center mr-2'>Already have an account?<span className='text-primary ml-2'><Link to='/login'>Login</Link></span></p ></div>
          </div>
        </div>
      </>
    </section>
  );
}

export default Signup;
