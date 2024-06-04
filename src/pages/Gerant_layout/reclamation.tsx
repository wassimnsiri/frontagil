import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import axios from 'axios'; // Import axios
import User from '../../model/user';
import { fetchUserData1 } from '../../network/user_services';

const Reclamation: React.FC = () => {
  const [reclamationText, setReclamationText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Make sure userData is not null before accessing its properties
      if (userData) {
        // Make API request to submit reclamation
        await axios.post('http://localhost:3030/reclamation/addreclamation', {
          userId: userData._id, // Use userData only if it's not null
          message: reclamationText,
          username: userData.username,
        });

        console.log('Réclamation envoyée:', reclamationText);
        setIsSubmitting(false);
        setReclamationText('');
        setAlertMessage('Réclamation envoyée avec succès!');
        setTimeout(() => setAlertMessage(null), 3000); // Clear the alert after 3 seconds
      } else {
        console.error('User data not available');
      }
    } catch (error) {
      console.error('Error submitting reclamation:', error);
      setIsSubmitting(false);
    }
  };

  // Disable the submit button if userData is null or form is submitting
  const isSubmitDisabled = !userData || isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <animated.div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Formulaire de Réclamation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full h-32 p-2 border border-yellow-500 rounded-md focus:outline-none focus:border-blue-500 text-black"
            placeholder="Saisissez votre réclamation..."
            value={reclamationText}
            onChange={(e) => setReclamationText(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className={`w-full bg-yellow text-black py-2 px-4 rounded-md transition duration-300 ${
              isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
            }`}
            disabled={isSubmitDisabled}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </form>
        {alertMessage && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{alertMessage}</span>
          </div>
        )}
      </animated.div>
    </div>
  );
};

export default Reclamation;
