import React, { useState, useEffect } from 'react';
import { FaBan, FaEnvelope, FaLock, FaSpinner, FaUser,FaIdCard  } from 'react-icons/fa';
import { MdVerified, MdDangerous } from 'react-icons/md';
import { createAdmin, fetchUserData } from '../../network/user_services';
import Modal from './NewModelMondal';
import User from '../models/User';

const TableUsers = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    matricule: '',
    role: '',
  });
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchData = async () => {
    try {
      const data = await fetchUserData();
      setUserData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Reset success message after 3 seconds

      return () => clearTimeout(timer); // Clear timer when component is unmounted or successMessage changes
    }
  }, [successMessage]); // Run this effect when successMessage changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await createAdmin(newAdmin);
      console.log('New Admin:', response);
      setNewAdmin({
        username: '',
        email: '',
        password: '',
        matricule: '',
        role: '',
      });
      setSuccessMessage('New admin successfully created!'); // Set success message
      setShowAddAdminModal(false); // Close modal after success
      fetchData(); // Refresh the user list
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };
  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3030/user/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      // Optionally handle response data here if needed
      const data = await response.json();
      console.log('User deleted successfully:', data);
      // Refetch data to update the UI
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      // Handle error state or display error message
    }
  };
  

  const filteredUsers = userData.filter((user) =>
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleBanStatus = (userId: string) => {
    setBannedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">USERS LIST</h4>
        <button
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
          onClick={() => setShowAddAdminModal(true)} // Open modal
        >
          Add New Gerant
        </button>
      </div>

      {successMessage && ( // Conditionally render alert
        <div className="p-4 mb-4 bg-green-500 text-white rounded">
          {successMessage}
        </div>
      )}

      {/* Modal to add new admin */}
      <Modal isOpen={showAddAdminModal} onClose={() => setShowAddAdminModal(false)}>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Add New Gerant
          </h2>

          <div className="relative">
            <FaUser className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full py-2 pl-8 pr-4"
              value={newAdmin.username}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full py-2 pl-8 pr-4"
              value={newAdmin.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
    <label className="block text-white text-sm font-bold mb-2" htmlFor="role">
        role
    </label>
    <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-yellow-100"
        id="role"
        type="text"
        placeholder="role"
        name="role"
        list="roles"
        value={newAdmin.role}
        onChange={handleChange}
    />
    <datalist id="roles">
        <option value="gerant" />
        <option value="intervenant" />
        <option value="chauffeur" />
    </datalist>
</div>


          <div className="relative">
            <FaLock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full py-2 pl-8 pr-4"
              value={newAdmin.password}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <FaIdCard  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="matricule"
              name="matricule"
              placeholder="matricule"
              className="w-full py-2 pl-8 pr-4"
              value={newAdmin.matricule}
              onChange={handleChange}
            />
          </div>


          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </Modal>

      <input
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        placeholder="Type to search..."
        className="w-full mb-4"
      />
      {loading && (
        <div className="flex items-center justify-center h-20">
          <FaSpinner className="animate-spin text-gray-500" size={30} />
        </div>
      )}

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Username
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase">
              Full Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase">
              Status
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase">
              Email
            </h5>
          </div>
          <div className="hidden sm:block p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase">
              Actions
            </h5>
          </div>
        </div>

        {filteredUsers.map((user, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${key === userData.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <img
                  height={50}
                  width={50}
                  src={user.profilePicture}
                  alt="User"
                  style={{ borderRadius: '50%' }}
                />
              </div>
              <p className="text-black dark:text-white sm:block">
                {user.username}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <>
                <p className="text-black dark:text-white">
                  {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'N/A'}
                </p>
              </>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              {user.isVerified ? (
                <MdVerified className="text-green-500" title="Verified Account" />
              ) : (
                <MdDangerous className="text-red-500" title="Needs Verification" />
              )}
            </div>

            <div className="hidden sm:block p-2.5 text-center xl:p-5">
              <p className="text-black dark:text-white">{user.email}</p>
            </div>
            <button
              className="flex items-center justify-center size-10xp xl:p-5 bg-red-200 text-white rounded hover:bg-red-600 transition"
              onClick={() => deleteUser(user._id)}
            >
              Remove User
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TableUsers;
