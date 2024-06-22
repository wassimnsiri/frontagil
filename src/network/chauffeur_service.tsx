import axios from "axios";

const BASE_URL = 'http://localhost:3030';
export const fetchChauffeur = async () => {
    try {
      const response = await fetch(`${BASE_URL}/chauffeur/getchauffeurs`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };
  export const assignCommandeToChauffeur = async (chauffeurId: string, commande: any) => {
    try {
        const response = await axios.post(`http://localhost:3030/chauffeur/${chauffeurId}`, { commande });
        return response.data; // Assuming backend returns updated chauffeur data
    } catch (error) {
        throw error; // Throw the error to handle it in the component
    }
};

  