const BASE_URL = 'http://localhost:3030';

export const fetchProduit = async () => {
    try {
      const response = await fetch(`${BASE_URL}/produit/getproduits`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };
  