import Task from '../model/task';
const BASE_URL = 'http://20.199.90.9:3030';

// Fonction pour créer une nouvelle tâche
export const createTask = async (task: Partial<Task>): Promise<Task> => {
  try {
    const response = await fetch(`${BASE_URL}/task/newtask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task), // Envoyer les détails de la tâche en JSON
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to create task');
    }

    const data: Task = await response.json(); // Assurez-vous que `Task` est correctement typé
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error to être géré dans le composant appelant
  }
};

export const fetchAllTasks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/task/tasks`); // Assurez-vous que votre endpoint est correct
    if (!response.ok) {
      throw new Error(`Error fetching tasks: ${response.statusText}`);
    }
    const data = await response.json(); // Récupérer le JSON de la réponse
    return data; // Retourner les données
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error; // Re-jeter l'erreur pour la gérer plus tard
  }
};

export const getTaskById = async (id: string): Promise<Task> => {
  try {
    const response = await fetch(`${BASE_URL}/task/${id}`); // Point de terminaison pour obtenir la tâche par ID
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to fetch task');
    }
    const task = await response.json(); // Convertir la réponse en objet
    return task; // Retourner la tâche
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    throw error; // Re-jeter l'erreur pour gérer plus tard
  }
};

export const fetchTasksByRecipe = async (userId: string): Promise<Task[]> => {
  try {
    const response = await fetch(`${BASE_URL}/task/user/${userId}`); // Appel au point de terminaison REST
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to fetch tasks'); // Gérer les erreurs d'API
    }

    const tasks: Task[] = await response.json(); // Récupérer le tableau des tâches depuis la réponse
    return tasks; // Retourner les tâches trouvées
  } catch (error) {
    console.error('Error fetching tasks by recipe:', error);
    throw error; // Re-jeter l'erreur pour la gestion par l'appelant
  }
};

export const fetchTasksByState = async (state: string): Promise<Task[]> => {
  try {
    // Effectuer une requête GET avec le paramètre d'état
    const response = await fetch(`${BASE_URL}/task/tasks/state/${state}`); 

    // Vérifiez si la réponse est correcte
    if (!response.ok) {
      const errorMessage = await response.text(); // Obtenez le message d'erreur si la réponse n'est pas correcte
      throw new Error(errorMessage || `Failed to fetch tasks by state: ${state}`); // Lancer une exception si erreur
    }

    const tasks: Task[] = await response.json(); // Convertir la réponse JSON en tableau de tâches
    return tasks; // Retourner le tableau de tâches
  } catch (error) {
    console.error('Error fetching tasks by state:', error); // Afficher l'erreur dans la console
    throw error; // Relancer l'erreur pour la gestion des erreurs au niveau supérieur
  }
};

/**
 * Met à jour l'état d'une tâche donnée.
 * @param {string} taskId - L'identifiant de la tâche à mettre à jour.
 * @param {Partial<Task>} updatedData - Les données mises à jour.
 * @returns {Promise<Task>} - La tâche mise à jour.
 */
export const updateTask = async (taskId: string, updatedData: Partial<Task>): Promise<Task> => {
  try {
    // Appel API pour mettre à jour l'état de la tâche
    const response = await fetch(`${BASE_URL}/task/${taskId}/state`, {
      method: 'PUT', // Utiliser PATCH pour indiquer qu'on met à jour partiellement une ressource
      headers: {
        'Content-Type': 'application/json', // Définir le type de contenu à JSON
      },
      body: JSON.stringify({ newState: updatedData.state }), // Inclure le nouvel état
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update task: ${errorText}`); // Lever une erreur si la réponse n'est pas OK
    }

    // Extraire la tâche mise à jour de la réponse
    const updatedTask = (await response.json()).task;

    return updatedTask; // Retourner la tâche mise à jour
  } catch (error) {
    console.error('Error updating task:', error); // Journaliser l'erreur
    throw error; // Relancer l'erreur pour être traitée par l'appelant
  }
};
