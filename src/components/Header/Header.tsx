// Header.tsx

import { Link } from 'react-router-dom';
import logo from '../../images/logo_dark.png'; // Make sure to replace this with your logo path

import DropdownNotification from './DropdownNotification1';

const Header = () => {
  return (
  
        <header className="bg-black text-white shadow-md py-4">
          <div className="container mx-auto flex justify-between items-center px-4">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Logo" className="w-10 h-10" />
              <h1 className="text-xl font-bold">Agil</h1>
         
            </div>
            <nav className="flex space-x-6">
       
              <Link 
                to="/mesreclamation" 
                className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition duration-300 ease-in-out"
              >
                Home
              </Link>
              <Link 
                to="/reclamation" 
                className="text-sm font-medium text-gray-300 hover:text-yellow- transition duration-300 ease-in-out"
              >
                reclamation
              </Link>
              <Link 
                to="/mescommande" 
                className="text-sm font-medium text-gray-300 hover:text-yellow- transition duration-300 ease-in-out"
              >
                Mes Commandes
              </Link>
              <Link 
                to="/mesreclamation" 
                className="text-sm font-medium text-gray-300 hover:text-yellow- transition duration-300 ease-in-out"
              >
              Consulter votre reclamation
              </Link>
              <DropdownNotification/>
             
            </nav>
          </div>
        </header>
      );
};

export default Header;
