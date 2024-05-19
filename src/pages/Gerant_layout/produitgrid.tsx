import React, { useEffect, useState } from "react";
import Produit from "../../components/models/Produit";
import { fetchProduit } from "../../network/produit_services";

const ProduitGrid = () => {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchProduit(); // Fetch products data
                if (data && Array.isArray(data.produits)) {
                    setProduits(data.produits);
                } else {
                    console.error('Fetched data is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="flex justify-center py-8">
            <div className="max-w-7xl w-full">
                <h1 className="text-3xl font-bold mb-8 text-center">Products</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {produits.map((produit) => (
                        <div key={produit._id} className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                            <img src={produit.image} alt={produit.name} className="w-full h-48 object-cover mb-4 rounded-md" />
                            <h2 className="text-xl font-semibold mb-2">{produit.name}</h2>
                            <p className="text-gray-600">{produit.quantite}</p>
                            <p className="text-gray-800 font-semibold mt-2">${produit.prix}</p>
                            <button className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300">
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProduitGrid;
