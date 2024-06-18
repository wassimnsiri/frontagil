import React, { useEffect, useState } from 'react';
import Produit from "../../components/models/Produit";
import User from '../../model/user';
import { fetchUserData1 } from '../../network/user_services';

interface PanierProps {
    panier: Produit[];
    removeItem: (produit: Produit) => void;
    setPanier: React.Dispatch<React.SetStateAction<Produit[]>>;
}

const Panier: React.FC<PanierProps> = ({ panier = [], removeItem, setPanier }) => {
    const calculateTotal = () => {
        return panier.reduce((total, produit) => total + produit.prix * (produit.quantite || 1), 0).toFixed(2);
    };
    const [userData, setUserData] = useState<User | null>(null);  const [loading, setLoading] = useState(true); // Add loading state


    useEffect(() => {
      const fetchData = async () => {
        try {
          const userData = await fetchUserData1();
          setUserData(userData);
          setLoading(false); // Set loading to false when data is fetched
        } catch (error) {
          // Handle data fetching errors
        }
      };
  
      fetchData();
    }, []);
    const handleMakePayment = async () => {
        const invalidQuantity = panier.some(item => item.quantite === 0 || isNaN(item.quantite));
        if (invalidQuantity) {
            alert('Invalid quantity for product');
            return; // Stop payment process if there are invalid quantities
        }
    
        const priceInCents = parseInt(calculateTotal()); 
        try {
            const paymentData = {
                paymentToken: 'pm_card_visa',
                userId: userData?._id,
                price: priceInCents * 100,
            };
    
            const response = await fetch('http://localhost:3030/produit/stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk_test_51PLDifP9wsPPbHmQFCf93rrDeIHCdSeuXKSzvohrBx8eQcrVr0KK09iuuIWkw8wQ6oX5U4jdXSCA5SMznCeFutRh004AHkZYYQ' ,
                },
                body: JSON.stringify(paymentData),
            });
    
            if (response.ok) {
                // Payment successful
                alert('Payment successful');
            } else {
                throw new Error('Failed to make payment');
            }
        } catch (error) {
            console.error('Error making payment:', error);
        }
    };
    
    
    const passCommande = async () => {
        try {
            const priceInCents = parseInt(calculateTotal());
            const userId = userData?._id ; 
            const commandeprice = priceInCents; // L'ID de l'utilisateur, assurez-vous de l'obtenir correctement
            const commandes = panier.map(produit => ({
                productId: produit._id,
                quantity: produit.quantite || 1,
            }));
    
            const response = await fetch('http://localhost:3030/commande/addcommande', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, produits: commandes, commandeprice }),
            });
    
            if (response.status === 400) {
                // Invalid quantity for product
                alert('Invalid quantity for product');
            } else if (response.ok) {
                // Command passed successfully
                alert('Command passed successfully');
                // Réinitialisez éventuellement le panier après avoir passé la commande avec succès
                setPanier([]);
            } else {
                throw new Error('Failed to make command');
            }
        } catch (error) {
            console.error('Error making command:', error);
        }
    };
    

    return (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Cart</h2>
            <ul>
                {panier.map((item) => (
                    <li key={item._id} className="flex justify-between items-center mb-2">
                        <span>{item.name}</span>
                        <span>
                            <input
                                type="number"
                                min="1"
                                value={item.quantite || 1}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    const newPanier = [...panier];
                                    const index = newPanier.findIndex((prod) => prod._id === item._id);
                                    if (index !== -1) {
                                        newPanier[index].quantite = value;
                                        setPanier(newPanier);
                                    }
                                }}
                                className="w-16 text-center border rounded"
                            />
                        </span>
                        <span>${(item.prix * (item.quantite || 1)).toFixed(2)}</span>
                        <button
                            onClick={() => removeItem(item)}
                            className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline transition duration-300"
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between items-center mt-4 font-bold">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
            </div>
            <button
        onClick={() => {
            handleMakePayment();
            passCommande();
        }}
                className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
                Proceed to Checkout
            </button>
        </div>
    );
}

export default Panier;
