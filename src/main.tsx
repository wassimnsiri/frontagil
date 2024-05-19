import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import LoginP from './components/Login/login';

const isAuthenticated = () => {
  // Implémente ta logique d'authentification ici
  // Par exemple, vérifie si l'utilisateur a un token valide dans le stockage local
  return localStorage.getItem('token') !== null;
};

ReactDOM.render(
  <React.StrictMode>
  <Router>
      {isAuthenticated() ? (
        <App/>
      ) : (
        <LoginP/>
      )}
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
