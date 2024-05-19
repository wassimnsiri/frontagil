const BASE_URL = 'http://localhost:3030';

export const fetchDepot = async () => {
    try {
      const response = await fetch(`${BASE_URL}/depot/getdepots`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };