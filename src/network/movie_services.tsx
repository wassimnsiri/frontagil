const BASE_URL = 'http://20.199.90.9:3030';

export const fetchAllMovie = async () => {
    try {
      const response = await fetch(`${BASE_URL}/movie/movie`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };
  
  export const fetchmoviesStatsparRapportRating = async () => {
    try {
      const response = await fetch(`${BASE_URL}/movie/stats/ratings`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };