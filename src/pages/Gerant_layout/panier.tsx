import React from 'react';
import Produit from "../../components/models/Produit";
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe from '@stripe/stripe-js'

interface PanierProps {
    panier: Produit[];
    removeItem: (produit: Produit) => void;
    setPanier: React.Dispatch<React.SetStateAction<Produit[]>>;
   
}

const Panier: React.FC<PanierProps> = ({ panier = [], removeItem, setPanier }) => { // Fix the prop name here
    const calculateTotal = () => {
        return panier.reduce((total, produit) => total + produit.prix * (produit.quantite || 1), 0).toFixed(2);
    };

    const handleMakePayment = async () => {
        try {
            const response = await fetch('http://localhost:3030/produit/stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: Number(calculateTotal()) * 100 }), // Sending the total amount in cents
            });

            const { success, message } = await response.json();

            if (success) {
                alert(message); // Display a success message
            } else {
                alert(message); // Display an error message
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Error processing payment. Please try again later.');
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
                    onClick={handleMakePayment} // Invoke the onCheckout function when the button is clicked
                    className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                >
                    Proceed to Checkout
                </button>
            </div>
        );
    }

    export default Panier;
