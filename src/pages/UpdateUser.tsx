import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import User from '../model/user';
import { fetchUserData1 } from '../network/user_services';

const UpdateUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState({
    username: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    bio: '',
    profilePicture: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData1();
        setUserData(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to fetch user data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('username', user.username);
      formData.append('firstName', user.firstName);
      formData.append('lastName', user.lastName);
      formData.append('birthDate', user.birthDate);
      formData.append('bio', user.bio);
      if (file) {
        formData.append('profilePicture', file);
      }

      const response = await axios.put(`http://localhost:9090/user/update/${userData?._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('User updated successfully:', response.data);
      alert('User updated successfully');
      // Optionally, redirect or set a success message
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Update User</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={user.username} onChange={handleChange} required />
        </label>
        <br />
        <label>
          First Name:
          <input type="text" name="firstName" value={user.firstName} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" name="lastName" value={user.lastName} onChange={handleChange} required />
        </label>
        <br />
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>Update User</button>
      </form>
    </div>
  );
};

export default UpdateUser;
