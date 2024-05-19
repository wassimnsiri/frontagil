import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTaskById } from '../../network/task_services';
import Task from '../../model/task';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (id) {
          const fetchedTask = await getTaskById(id);
          setTask(fetchedTask);
        }
      } catch (err) {
        setError('Error fetching task details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!task) {
    return <div className="text-center">Task not found.</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {/* Card Container */}
      <div className="bg-white rounded-lg shadow-lg p-12 w-3/4 lg:w-1/2">
        {/* Title */}
        <h1 className="text-center text-blue-600 font-bold text-4xl mb-8">
          Task Details
        </h1>

        {/* Task Details */}
        <div className="text-lg space-y-6">
          <div>
            <strong>Title:</strong> {task.title}
          </div>
          <div>
            <strong>Release Date:</strong> {task.releaseDate}
          </div>
          <div>
            <strong>Description:</strong> {task.description}
          </div>
          <div>
            <strong>Recipient:</strong> {task.recipient.username}
          </div>
          <div>
            <strong>State:</strong> {task.state}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
