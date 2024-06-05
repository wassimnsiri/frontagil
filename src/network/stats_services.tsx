const BASE_URL = 'http://20.199.90.9:3030';

export const fetchStatsSubscriptionByDate = async () => {
    try {
      const response = await fetch(`http://localhost:3030/commande/revenue`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };

  export const fetchVerifiedUsersNumber = async () => {
    try {
      const response = await fetch('http://localhost:3030/user/stats');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };
  export const fetchTotalSubscriptionRevenue = async () => {
    try {
      const response = await fetch(`${BASE_URL}/commande/test`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };
  export const fetchTotalSubscriptionRevenueByDate = async () => {
    try {
      const response = await fetch(`${BASE_URL}/subscription/revenue`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };
  