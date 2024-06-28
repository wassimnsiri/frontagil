// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import axios from 'axios';
import { Commande } from '../../components/models/Commande';
import User from '../../components/models/User';
import { fetchUserData1 } from '../../network/user_services';

const Mescommande: React.FC = () => {
  // Initialize state with correct type
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData1();
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Fetch commandes from API only if userData is available
    const fetchCommandes = async () => {
      if (userData?._id) {
        try {
          const response = await axios.get<Commande[]>(`http://localhost:3030/commande/getcommande/${userData._id}`);
          // Update state with fetched commandes
          setCommandes(response.data);
        } catch (error) {
          console.error('Error fetching commandes:', error);
        }
      }
    };

    // Fetch commandes when userData changes
    fetchCommandes();
  }, [userData]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Mes Commandes
      </Typography>
      <Grid container spacing={3}>
        {commandes.map((commande) => (
          <Grid item xs={12} sm={6} md={4} key={commande._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Commande ID: {commande._id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(commande.orderDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: <Chip label={commande.status} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prix: {commande.commandeprice} €
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reason: {commande.reason} 
                </Typography>
                {/* Add more fields as necessary */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Reason</TableCell>
              {/* Add more columns as necessary */}
            </TableRow>
          </TableHead>
          <TableBody>
            {commandes.map((commande) => (
              <TableRow key={commande._id}>
                <TableCell>{commande._id}</TableCell>
                <TableCell>{new Date(commande.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={commande.status} />
                </TableCell>
                <TableCell>{commande.commandeprice} €</TableCell>
                <TableCell>{commande.reason} </TableCell>
                {/* Add more cells as necessary */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Mescommande;
