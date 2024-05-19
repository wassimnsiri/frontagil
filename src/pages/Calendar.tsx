import React, { useState, useEffect } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { fetchAllTasks, fetchTasksByRecipe, updateTask } from '../network/task_services';
import Task from '../model/task';
import Swal from 'sweetalert2';
import Modal from 'react-modal';

// Définissez l'élément pour le modal
Modal.setAppElement('#root');

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'ouverture du modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Tâche sélectionnée

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const userRole = localStorage.getItem('role');
        const userId = localStorage.getItem('id');

        let loadedTasks;

        if (userRole === 'admin') {
          loadedTasks = await fetchTasksByRecipe(userId as string);
        } else {
          loadedTasks = await fetchAllTasks();
        }

        setTasks(loadedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadTasks();
  }, []);

  const handleDayClick = (day: Date) => {
    const normalizedDay = new Date(day).setHours(0, 0, 0, 0);
    const userRole = localStorage.getItem('role');

    const task = tasks.find(
      (t) =>
        new Date(t.releaseDate as string).setHours(0, 0, 0, 0) ===
        normalizedDay,
    );

    if (task) {
      // Ouvrir le modal avec les détails de la tâche
      setSelectedTask(task);
      setIsModalOpen(true); // Ouvrir le modal
    } else {
      if (userRole === 'superadmin') {
        const formattedDate = format(day, 'yyyy-MM-dd');
        navigate(`/newtask?date=${formattedDate}`); // Naviguer vers le formulaire de création
      } else {
        Swal.fire({
          title: 'No Task',
          text: "You haven't any task on this day.",
          icon: 'info',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const handleUpdateTask = async () => {
    if (selectedTask && selectedTask._id) {
      try {
        await updateTask(selectedTask._id, { state: selectedTask.state });
        setIsModalOpen(false); // Fermer le modal après mise à jour
        setSelectedTask(null); // Réinitialiser la tâche sélectionnée
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false); // Fermer le modal
    setSelectedTask(null); // Réinitialiser la tâche sélectionnée
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  

  const getTaskColor = (taskState: string): string => {
    switch (taskState) {
      case 'to do':
        return 'bg-red-500 text-white';
      case 'in progress':
        return 'bg-yellow-500 text-black';
      case 'done':
        return 'bg-green-500 text-white';
      default:
        return 'hover:bg-gray';
    }
  };

  const startMonth = startOfMonth(currentMonth);
  const endMonth = endOfMonth(currentMonth);
  const startWeek = startOfWeek(startMonth);
  const endWeek = endOfWeek(endMonth);

  const daysInMonth = eachDayOfInterval({ start: startWeek, end: endWeek });

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Calendar" />

      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={() => navigate('/listtasks')}
        >
          My tasks
        </button>
      </div>

      <br />

      <div className="flex justify-between">
        <button
          onClick={handlePreviousMonth}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Previous Month
        </button>
        <h2 className="text-xl font-semibold text-center">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={handleNextMonth}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Next Month
        </button>
      </div>

      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              {[
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ].map((day) => (
                <th
                  key={day}
                  className="flex justify-center p-1 text-xs font-semibold"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(
              { length: Math.ceil(daysInMonth.length / 7) },
              (_, row) => (
                <tr key={row} className="grid grid-cols-7">
                  {Array.from({ length: 7 }, (_, col) => {
                    const dayIndex = row * 7 + col;
                    const day = daysInMonth[dayIndex];

                    if (!day) {
                      return <td key={col}></td>; // Cellule vide si pas de jour
                    }

                    const normalizedDay = new Date(day).setHours(0, 0, 0, 0);

                    const task = tasks.find(
                      (t) =>
                        new Date(t.releaseDate as string).setHours(0, 0, 0, 0) ===
                        normalizedDay,
                    );

                    const cellColor = task
                      ? getTaskColor(task.state as string)
                      : 'hover:bg-gray'; // Choisir la couleur de la case

                    return (
                      <td
                        key={dayIndex}
                        className={`ease h-20 cursor-pointer border p-2 transition duration-500 ${cellColor}`}
                        onClick={() => handleDayClick(day)}
                      >
                        {format(day, 'd')}
                      </td>
                    );
                  })}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* Modal pour afficher les détails de la tâche */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Task Details"
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        {selectedTask ? (
          <div>
            <h2 className="text-xl font-semibold">Task Details</h2>
            <br></br>
            <p><strong>Title:</strong> {selectedTask.title}</p>
            <p><strong>Release Date:</strong> {format(new Date(selectedTask.releaseDate!), 'dd/MM/yyyy')}</p>
            <p><strong>Description:</strong> {selectedTask.description}</p>
            <p><strong>Recipient:</strong> {selectedTask.recipient.username}</p>
            <p>
              <strong>State:</strong>
              <select
                value={selectedTask.state}
                onChange={(e) => {
                  setSelectedTask((prev) => {
                    if (!prev) return prev;
                    const updatedTask = { ...prev, state: e.target.value };
                    updateTask(updatedTask._id as string, updatedTask); // Sauvegarder le changement d'état
                    return updatedTask;
                  });
                }}
                className="ml-2 px-2 py-1 border rounded"
              >
                <option value="to do">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={handleCloseModal}
            >
              Close
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2"
              onClick={() => {
                handleUpdateTask(); // Mettre à jour la tâche
                window.location.reload(); // Recharger la page
              }}
              
            >
              Submit
            </button>


          </div>
        ) : (
          <p>No task details available</p>
        )}
      </Modal>
    </DefaultLayout>
  );
};

export default Calendar;