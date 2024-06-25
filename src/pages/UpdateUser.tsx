import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import User from '../model/user';
import { fetchUserData1 } from '../network/user_services';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Typography
} from '@mui/material';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

const UpdateUserModal: React.FC<Props> = ({ isOpen, closeModal }) => {
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData1(); // Pass id parameter to fetchUserData1
        setUserData(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to fetch user data. Please try again.');
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [id, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (userData) {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userData) return;

    setLoading(true);

    try {
      const response = await axios.put(`http://localhost:3030/user/update/${userData._id}`, userData);
      console.log('User updated successfully:', response.data);
      closeModal(); // Close the modal on successful update
    } catch (error) {
      console.error('Failed to update user:', error);
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {error && <Typography color="error">{error}</Typography>}
            {userData && (
              <form onSubmit={handleSubmit}>
                <TextField
                  margin="dense"
                  label="Username"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="First Name"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Last Name"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  fullWidth
                />
                <DialogActions>
                  <Button onClick={closeModal} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Update User
                  </Button>
                </DialogActions>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserModal;
