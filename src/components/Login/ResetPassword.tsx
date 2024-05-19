import React, { useState } from 'react';
import { requestPasswordReset } from '../../network/user_services'; // Importer la fonction de réinitialisation

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState(''); // État pour stocker l'email
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Message de succès
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Message d'erreur

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value); // Mettre à jour l'email dans l'état
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email); // Envoyer la demande de réinitialisation
      setSuccessMessage('Password reset link has been sent to your email.'); // Message de succès
      setErrorMessage(null); // Effacer le message d'erreur
    } catch (error) {
      setSuccessMessage(null); // Effacer le message de succès
      setErrorMessage('Failed to send reset email. Please try again.'); // Message d'erreur
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100"> {/* Centré verticalement et horizontalement */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3"> {/* Style de la carte */}
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Reset Password</h2> {/* Titre centré en bleu */}
        
        {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>} {/* Afficher le message de succès */}
        {errorMessage && <p className="text-red-600 text-center mb-4">{errorMessage}</p>} {/* Afficher le message d'erreur */}
        
        <form onSubmit={handleSubmit}> {/* Gestion du formulaire */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-bold">Email:</label> {/* Libellé de l'attribut */}
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email" 
              className="w-full p-2 border rounded-lg"
              value={email}
              onChange={handleChange} // Gérer le changement d'entrée
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"> {/* Bouton de soumission */}
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
