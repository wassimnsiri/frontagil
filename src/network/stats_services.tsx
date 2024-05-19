const BASE_URL = 'http://20.199.90.9:3030';

export const fetchStatsSubscriptionByDate = async () => {
    try {
      const response = await fetch(`${BASE_URL}/subscription/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };

  export const fetchVerifiedUsersNumber = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };
  export const fetchTotalSubscriptionRevenue = async () => {
    try {
      const response = await fetch(`${BASE_URL}/subscription/totalrevenue`);
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
  