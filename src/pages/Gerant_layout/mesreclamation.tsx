import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Typography, Modal, Box, TextField, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import Reclamation from '../../components/models/Reclamation';
import User from '../../model/user';
import { fetchUserData1 } from '../../network/user_services';


interface Message {
  user: string;
  message: string;
  timestamp: string;
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
  const [newMessage, setNewMessage] = useState('');

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
    socket.on(' ', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const newMessage: Message = {
      user: userData?.username || 'Unknown',
      message,
      timestamp: new Date().toISOString(),
    };
    socket.emit('sendMessage', newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setNewMessage('');
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
    <div className="p-4">
      <Typography variant="h4" className="text-2xl font-bold mb-4">Liste de vos réclamations</Typography>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reclamations.map((reclamation, index) => (
            <div key={reclamation._id} className="transform transition duration-300 hover:scale-105">
              <div className="p-4 bg-white shadow-lg rounded-lg">
                <Typography variant="h6" className="text-lg font-semibold">{reclamation.message}</Typography>
                <Typography variant="body1" className="text-black">Statut: {reclamation.status}</Typography>
                <Button className="w-full mt-2 bg-blue hover:bg-blue text-white" onClick={() => handleEdit(reclamation)}>
                  Modifier
                </Button>
                <Button className="w-full mt-2 bg-red  text-white" onClick={() => handleDelete(reclamation._id)}>
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white border-2 border-gray shadow-xl p-4 rounded-lg">
          <Typography variant="h6" className="text-lg font-bold mb-2">Modifier Réclamation</Typography>
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end space-x-2">
            <Button className="bg-blue hover:bg-blue text-white" onClick={handleEditSubmit}>
              Enregistrer
            </Button>
            <Button className="bg-gray hover:bg-gray text-white" onClick={handleClose}>
              Annuler
            </Button>
          </div>
        </Box>
      </Modal>

      <div>
        <Typography variant="h6" className="text-xl font-semibold mt-4">Messages</Typography>
        <Box className="max-h-80 overflow-y-auto border border-gray p-2 my-2">
          {messages.map((msg, index) => (
            <Box key={index} className="mb-2">
              <Typography variant="body2" className={`${msg.user === userData?.username ? 'text-blue' : 'text-green'}`}>
                <strong>{msg.user}:</strong> {msg.message}
              </Typography>
              <Typography variant="caption" className="text-gray">
                {new Date(msg.timestamp).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box className="flex items-center space-x-2">
          <TextField
            label="New Message"
            fullWidth
            multiline
            rows={2}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSendMessage(newMessage);
                e.preventDefault();
              }
            }}
          />
          <IconButton color="primary" onClick={() => handleSendMessage(newMessage)}>
            <SendIcon />
          </IconButton>
        </Box>
      </div>
    </div>
  );
};

export default ReclamationList;
