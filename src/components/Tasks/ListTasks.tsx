import React, { useEffect, useState } from 'react';

import Task from '../../model/task';

import {
  fetchAllTasks,
  fetchTasksByState,
  fetchTasksByRecipe,
} from '../../network/task_services';

const ListTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // Stocker les tâches

  const [currentFilter, setCurrentFilter] = useState<string>(''); // Filtre courant

  const userId = localStorage.getItem('id'); // ID de l'utilisateur connecté

  // Charger les tâches selon le filtre

  useEffect(() => {
    const loadTasks = async () => {
      try {
        let loadedTasks: Task[] | undefined;

        if (currentFilter) {
          loadedTasks = await fetchTasksByState(currentFilter); // Charger les tâches par état
        } else if (userId) {
          loadedTasks = await fetchTasksByRecipe(userId); // Charger les tâches de l'utilisateur connecté
        } else {
          console.error('User ID is missing in localStorage');
        }

        if (loadedTasks) {
          setTasks(loadedTasks); // Assigner les tâches au composant
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadTasks(); // Charger les tâches
  }, [currentFilter, userId]); // Recharger lors du changement de filtre ou d'utilisateur

  const handleFilterChange = (newFilter: string) => {
    setCurrentFilter(newFilter); // Mettre à jour le filtre
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-12 bg-gray-100">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        List of Tasks
      </h2>

      <div className="mb-6 flex space-x-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            currentFilter === '' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleFilterChange('')}
        >
          All
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            currentFilter === 'to do' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleFilterChange('to do')}
        >
          To Do
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            currentFilter === 'in progress'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
          onClick={() => handleFilterChange('in progress')}
        >
          In Progress
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            currentFilter === 'done' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => handleFilterChange('done')}
        >
          Done
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-4 py-2">Title</th>

              <th className="px-4 py-2">Release Date</th>

              <th className="px-4 py-2">State</th>

              <th className="px-4 py-2">Description</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{task.title}</td>

                <td className="px-4 py-2">{task.releaseDate}</td>

                <td className="px-4 py-2">{task.state}</td>

                <td className="px-4 py-2">{task.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListTasks;
