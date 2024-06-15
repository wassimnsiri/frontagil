import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Typography, Paper, Grid, Grow, CircularProgress, Button, Modal, Box, TextField,
} from '@mui/material';
import axios from 'axios';
import Reclamation from '../../components/models/Reclamation';
import User from '../../model/user';
import { fetchUserData1 } from '../../network/user_services';

interface Message {
  user: string;
  message: string;
}

const socket = io('http://localhost:3030');

const ReclamationList = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [currentReclamation, setCurrentReclamation] = useState<Reclamation | null>(null);
  const [editedMessage, setEditedMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData1();
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        if (userData) {
          const response = await axios.get(`http://localhost:3030/reclamation/consultermesreclamation/${userData._id}`);
          setReclamations(response.data.reclamations);
        }
      } catch (error) {
        console.error('Error fetching reclamations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReclamations();
  }, [userData]);

  useEffect(() => {
    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = (message: string) => {
    socket.emit('sendMessage', { user: userData?.username, message });
  };

  const handleEdit = (reclamation: Reclamation) => {
    setCurrentReclamation(reclamation);
    setEditedMessage(reclamation.message);
    setOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!currentReclamation) return;

    const { _id } = currentReclamation;

    try {
      const response = await axios.put(`http://localhost:3030/reclamation/edit/${_id}`, {
        message: editedMessage,
      });

      if (!response.data.success) {
        throw new Error('Failed to edit reclamation');
      }

      const updatedReclamations = reclamations.map(reclamation =>
        reclamation._id === _id ? { ...reclamation, message: editedMessage } : reclamation
      );
      setReclamations(updatedReclamations);
      setShowSuccessMessage(true);
      handleClose();
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error editing reclamation:', error);
    }
  };

  const handleDelete = async (reclamationId: string) => {
    try {
      await axios.delete(`http://localhost:3030/reclamation/supprimermesreclamation/${reclamationId}`);
      setReclamations(prevReclamations =>
        prevReclamations.filter(reclamation => reclamation._id !== reclamationId)
      );
    } catch (error) {
      console.error('Error deleting reclamation:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentReclamation(null);
    setEditedMessage('');
  };

  return (
    <div style={{ flexGrow: 1, padding: '16px' }}>
      <Typography variant="h4" gutterBottom>Liste de vos réclamations</Typography>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={2}>
          {reclamations.map((reclamation, index) => (
            <Grid item xs={12} sm={6} md={4} key={reclamation._id}>
              <Grow in={true} timeout={500 * (index + 1)}>
                <Paper elevation={3} style={{ padding: '16px', textAlign: 'center', color: '#333', height: '100%', transition: 'transform 0.3s ease' }}>
                  <Typography variant="h6">{reclamation.message}</Typography>
                  <Typography variant="body1" color="textSecondary">Statut: {reclamation.status}</Typography>
                  <Button variant="outlined" color="primary" size="small" fullWidth>
                    Voir détails
                  </Button>
                  <Button variant="contained" color="primary" size="small" fullWidth onClick={() => handleEdit(reclamation)}>
                    Modifier
                  </Button>
                  <Button variant="contained" color="secondary" size="small" fullWidth onClick={() => handleDelete(reclamation._id)}>
                    Supprimer
                  </Button>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2">Modifier Réclamation</Typography>
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleEditSubmit}>
            Enregistrer
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose} style={{ marginLeft: '10px' }}>
            Annuler
          </Button>
        </Box>
      </Modal>

      <div>
        <Typography variant="h6">Messages</Typography>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
        <TextField
          label="New Message"
          fullWidth
          multiline
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const target = e.target as HTMLInputElement;
              handleSendMessage(target.value);
              target.value = '';
              e.preventDefault();
            }
          }}
        />
      </div>
    </div>
  );
};

export default ReclamationList;
