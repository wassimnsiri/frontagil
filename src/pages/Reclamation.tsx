import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, InputAdornment, IconButton } from '@mui/material';
import axios from 'axios';
import Reclamation from '../components/models/Reclamation';


const ReclamationAdmin: React.FC = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');

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
  
    const changeStatus = async () => {
        try {
            const response = await axios.post('http://localhost:3030/reclamation/changestatus', {
            status: 'done',
            });
            console.log(response.data);
        } catch (error) {
            console.error('Failed to update reclamation status', error);
        }
    }

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

  const filteredReclamations = reclamations.filter((reclamation) =>
    reclamation.message.toString().includes(search.toLowerCase())
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
              <TableBody>username</TableBody>
         
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReclamations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reclamation) => (
              <TableRow key={reclamation._id}>
                <TableCell>{reclamation._id}</TableCell>
                <TableCell>{reclamation.userId}</TableCell>
                <TableCell>{reclamation.message}</TableCell>
                <TableCell>{reclamation.username}</TableCell>
              
                <TableCell >{reclamation.status} </TableCell>
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
    </Container>
  );
};

export default ReclamationAdmin;
