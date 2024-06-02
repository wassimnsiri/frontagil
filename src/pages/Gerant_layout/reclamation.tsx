import React, { useState } from 'react';

const Reclamation: React.FC = () => {
  const [reclamationText, setReclamationText] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Réclamation envoyée:', reclamationText);
    setReclamationText('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Formulaire de Réclamation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Saisissez votre réclamation..."
            value={reclamationText}
            onChange={(e) => setReclamationText(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reclamation;
