import React, { useEffect, useState } from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, TextField, InputAdornment, Button, Modal, Box, Typography, IconButton,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import io from 'socket.io-client';
import Reclamation from '../components/models/Reclamation';

const socket = io('http://localhost:3030');

interface Message {
  user: string;
  message: string;
  timestamp: string;
}

const ReclamationAdmin: React.FC = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [currentReclamation, setCurrentReclamation] = useState<Reclamation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const response = await axios.get('http://localhost:3030/reclamation/getall');
        setReclamations(response.data);
      } catch (error) {
        console.error('Failed to fetch reclamations', error);
      }
    };
    fetchReclamations();
  }, []);

  useEffect(() => {
    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && currentReclamation) {
      const messageData: Message = { user: 'Admin', message: newMessage, timestamp: new Date().toISOString() };
      socket.emit('sendMessage', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage('');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleChangeStatus = async (reclamationId: string, newStatus: "pending" | "treated") => {
    try {
      await axios.post('http://localhost:3030/reclamation/changestatus', { reclamationId, newStatus });
      setReclamations((prevReclamations) => 
        prevReclamations.map((reclamation) => 
          reclamation._id === reclamationId ? { ...reclamation, status: newStatus } : reclamation
        )
      );
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleOpenModal = (reclamation: Reclamation) => {
    setCurrentReclamation(reclamation);
    setMessages([]); // Fetch previous messages if required
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setCurrentReclamation(null);
  };

  const filteredReclamations = reclamations.filter((reclamation) =>
    reclamation.message.toString().toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <TextField
        label="Rechercher"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {/* You can add an icon here if needed */}
            </InputAdornment>
          ),
        }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReclamations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reclamation) => (
              <TableRow key={reclamation._id}>
                <TableCell>{reclamation._id}</TableCell>
                <TableCell>{reclamation.userId}</TableCell>
                <TableCell>{reclamation.message}</TableCell>
                <TableCell>{reclamation.username}</TableCell>
                <TableCell>{reclamation.status}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleChangeStatus(reclamation._id, reclamation.status === "pending" ? "treated" : "pending")}>
                    Change Status
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => handleOpenModal(reclamation)}>
                    Discuss
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredReclamations.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page"
      />
      
      <Modal open={open} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
          {currentReclamation && (
            <>
              <Typography variant="h6" component="h2">Réclamation</Typography>
              <Typography>ID: {currentReclamation._id}</Typography>
              <Typography>User ID: {currentReclamation.userId}</Typography>
              <Typography>Message: {currentReclamation.message}</Typography>
              <Typography>Username: {currentReclamation.username}</Typography>
              <Typography>Statut: {currentReclamation.status}</Typography>

              <Divider sx={{ margin: '16px 0' }} />

              <Typography variant="h6" component="h2">Messages</Typography>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 300, border: '1px solid #ccc', padding: 2, marginBottom: 2 }}>
                {messages.map((msg, index) => (
                  <Box key={index} sx={{ marginBottom: 1 }}>
                    <Typography variant="body2" color={msg.user === 'Admin' ? 'primary' : 'secondary'}>
                      <strong>{msg.user}:</strong> {msg.message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(msg.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="New Message"
                  fullWidth
                  multiline
                  rows={2}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleSendMessage();
                      e.preventDefault();
                    }
                  }}
                />
                <IconButton color="primary" onClick={handleSendMessage} sx={{ marginLeft: 1 }}>
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ReclamationAdmin;
