import axios from "axios";
import User from "../model/user";


const BASE_URL = 'http://localhost:3030';
export interface CreateAdminResponse {
  token: string;
  user: User;
}
export const updateUser = async (id:String, formData:User) => {
  try {
    const response = await axios.put(`${BASE_URL}/user/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
export const fetchUserData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Re-throw the error to be handled in the calling component
    }
  };

  export interface LoginResponse {
    token: string;
    user: User;
  }
  export const login = async (credentials: { email?: string; username?: string; password: string }) => {
    try {
      const { email, username, password } = credentials;
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to login');
      }
  
      const data = await response.json();
      
      // Handle redirection based on user role
      const { token, user } = data;
      if (user.role === 'admin') {
        window.location.href = 'http://localhost:5173/';
      } else if (user.role === 'gerant') {
        window.location.href = 'http://localhost:5173/welcome';
      } else {
        // handle other roles or default redirection
      }
  
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Re-throw the error to be handled in the calling component
    }
  };

  export const logout = () => {
    // Vide le localStorage
    localStorage.removeItem('token');
  };

  export const fetchUserData1 = async () => {
    try {
      // Récupérer le nom d'utilisateur depuis le localStorage
      const username = localStorage.getItem('username'); // Assurez-vous que la clé est correcte
  
      // Utiliser le nom d'utilisateur pour construire l'URL
      const response = await fetch(`${BASE_URL}/user/test/${username}`); // Utilisez `${BASE_URL}/user/test/${username}` si "/test/" fait partie de l'URL
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Re-throw the error to be handled in the calling component
    }
  };
  export const createAdmin = async (credentials: { email?: string; username?: string; password: string, role?: string }): Promise<CreateAdminResponse> => {
    try {
      const token = localStorage.getItem('token'); // Récupérez le token depuis le localStorage
      if (!token) {
        throw new Error("Authorization token is missing");
      }
  
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Ajoutez le token d'autorisation
          'Content-Type': 'application/json', // Utilisez le bon type de contenu
        },
        body: JSON.stringify(credentials), // Utilisez le paramètre credentials pour le corps de la requête
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Obtenez le message d'erreur si possible
        throw new Error(`Failed to create admin: ${errorText}`); // Lancez une erreur avec plus de contexte
      }
  
      const data: CreateAdminResponse = await response.json(); // Parsez la réponse JSON
      return data; // Retournez les données
  
    } catch (error) {
      console.error('Error:', error); // Affichez l'erreur dans la console
      throw error; // Relancez l'erreur pour que le composant puisse la gérer

    };
  }
  export const fetchAdmins = async (): Promise<User[]> => {
    try {
      const response = await fetch(`${BASE_URL}/user/role/admin`); // Point de terminaison pour obtenir les admins
      
      if (!response.ok) {
        const errorMessage = await response.text(); // Obtenir le message d'erreur
        throw new Error(`Failed to fetch admins: ${errorMessage}`);
      }
      
      const admins = await response.json(); // Convertir la réponse en objet
      return admins; // Retourner les admins récupérés
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error; // Relancer l'erreur pour gérer ultérieurement
    }
  };

  export const requestPasswordReset = async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/user/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Envoyer l'email au corps de la requête
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error; // Relancer l'erreur pour la gestion par le composant appelant
    }
  };
