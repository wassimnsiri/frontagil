import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from 'react-modal';
import { createTask } from '../../network/task_services';
import Task from '../../model/task';
import User from '../../model/user'; // Modèle d'utilisateur pour le type
import { fetchAdmins } from '../../network/user_services';

Modal.setAppElement('#root'); // 'root' est généralement l'élément d'application principal

const CreateTaskForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // Hook pour la navigation
  const [task, setTask] = useState<Partial<Task>>({
    title: '',
    description: '',
  });
  const [admins, setAdmins] = useState<User[]>([]); // Liste des utilisateurs

  useEffect(() => {
    // Récupérer la liste des admins pour le menu déroulant
    const fetchData = async () => {
      try {
        const adminList = await fetchAdmins(); // Appeler la fonction pour obtenir les admins
        setAdmins(adminList); // Stocker la liste des admins
      } catch (error) {
        console.error('Error fetching admins:', error); // Gérer l'erreur
      }
    };

    fetchData(); // Charger les admins au montage du composant
  }, []);

  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setTask((prev) => ({
        ...prev,
        releaseDate: dateParam, // Définir releaseDate à partir du paramètre de recherche
      }));
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(task); // Créer la tâche avec les données du formulaire
      navigate('/calendar'); // Rediriger vers le calendrier après la soumission
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen"> {/* Centrage vertical et horizontal */}
      <div className="bg-white p-6 rounded-lg w-3/4 lg:w-1/2">
        <h2 className="text-center text-blue-600 text-2xl font-bold mb-4">Create a New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg font-bold">
              Title:
            </label>
            <input
              type="text"
              name="title"
              className="block w-full border border-gray-300 rounded-lg p-2"
              value={task.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-lg font-bold">
              Description:
            </label>
            <textarea
              name="description"
              className="block w-full border border-gray-300 rounded-lg p-2"
              value={task.description}
              onChange={handleChange}
            />
          </div>

          {/* Menu déroulant pour choisir un destinataire */}
          <div className="mb-4">
            <label htmlFor="giveTo" className="block text-lg font-bold">
               Recipient
            </label>
            <select
              name="recipient"
              className="block w-full border border-gray-300 rounded-lg p-2"
              onChange={handleChange}
            >
              <option value="">Select a recipient</option> {/* Option par défaut */}
              {admins.map((admin) => (
                <option key={admin._id} value={admin._id}>
                  {admin.username} {/* Afficher le nom d'utilisateur */}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
