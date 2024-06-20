import React, { useEffect, useState } from 'react';
import Produit from "../../components/models/Produit";
import User from '../../model/user';
import { fetchUserData1 } from '../../network/user_services';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import stripePromise from './stripePromise';

interface PanierProps {
    panier: Produit[];
    removeItem: (produit: Produit) => void;
    setPanier: React.Dispatch<React.SetStateAction<Produit[]>>;
}

const Panier: React.FC<PanierProps> = ({ panier = [], removeItem, setPanier }) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUserData1();
                setUserData(userData);
                setLoading(false);
            } catch (error) {
                // Handle data fetching errors
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    const calculateTotal = () => {
        return panier.reduce((total, produit) => total + produit.prix * (produit.quantite || 1), 0).toFixed(2);
    };

    const handleMakePayment = async () => {
        const invalidQuantity = panier.some(item => item.quantite === 0 || isNaN(item.quantite));
        if (invalidQuantity) {
            alert('Invalid quantity for product');
            return;
        }

        if (!stripe || !elements) {
            console.error('Stripe.js not loaded properly');
            return;
        }

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement as StripeCardElement,
            });

            if (error) {
                console.error('Error creating payment method:', error);
                return;
            }

            const priceInCents = parseInt(calculateTotal());
            const paymentData = {
                paymentMethod: paymentMethod?.id,
                userId: userData?._id,
                price: priceInCents * 100,
            };

            const response = await fetch('http://localhost:3030/produit/stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk_test_51PLDifP9wsPPbHmQFCf93rrDeIHCdSeuXKSzvohrBx8eQcrVr0KK09iuuIWkw8wQ6oX5U4jdXSCA5SMznCeFutRh004AHkZYYQ',
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
            const userId = userData?._id;
            const commandeprice = priceInCents;

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
                // Optionally reset the cart after successful order
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
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Card details</label>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
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
};

const PanierWrapper: React.FC<PanierProps> = (props) => {
    return (
        <Elements stripe={stripePromise}>
            <Panier {...props} />
        </Elements>
    );
};

export default PanierWrapper;
