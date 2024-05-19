import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserData1, logout } from '../../network/user_services';
import User from '../models/User';

const DropdownUser: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData1();
        setUserData(userData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleLogout = () => {
    // Appelle la fonction de logout pour vider le localStorage
    logout();
    // Redirige vers la page de connexion après la déconnexion
    window.location.href = '/login';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {userData?.username}
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img src={userData?.profilePicture} alt="User" />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              to={`/profile`}
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <svg
                className="fill-current"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 8.09999C12.5156 8.09999 13.75 6.86561 13.75 5.34999C13.75 3.83437 12.5156 2.59999 11 2.59999C9.48438 2.59999 8.25 3.83437 8.25 5.34999C8.25 6.86561 9.48438 8.09999 11 8.09999ZM21.75 22H0.25C0.109375 22 0 21.8919 0 21.75V20.0687C0 19.9281 0.109375 19.8187 0.25 19.8187H21.75C21.8906 19.8187 22 19.9281 22 20.0687V21.75C22 21.8919 21.8906 22 21.75 22ZM17.0625 16.8999C16.2812 15.8062 14.9062 14.8999 13.3906 14.8999H8.60938C7.09375 14.8999 5.71875 15.8062 4.9375 16.8999C3.26562 19.1156 1.04688 20.3999 1.04688 20.3999V21.75C1.04688 21.8906 1.15625 22 1.29688 22H20.7031C20.8438 22 20.9531 21.8906 20.9531 21.75V20.3999C20.9531 20.3999 18.7344 19.1156 17.0625 16.8999Z"
                  fill=""
                />
              </svg>
              <span>Profil</span>
            </Link>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="text-left text-sm font-medium px-6 py-7.5 dark:text-white duration-300 ease-in-out hover:text-primary lg:text-base"
        >
          Se déconnecter
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;
