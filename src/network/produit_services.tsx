import { Produit } from "../pages/produit";

const BASE_URL = 'http://localhost:3030';

// Define a type for the produit data (without optional properties)
interface ProduitData {
  name: string;
  category: string;
  quantite: number;
  prix: number;
}

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
export const addproduit = async () =>
{
  try {
    const response = await fetch(`${BASE_URL}/produit/ajouter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Produit),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const updateProduit = async (id: string, produitData: ProduitData) => {
  try {
    const response = await fetch(`${BASE_URL}/produit/modifier/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produitData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const deleteProduit = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/produit/delete/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fetchCountCommandeByDate = async () => {
  try {
    const response = await fetch(`${BASE_URL}/commande/statC`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
