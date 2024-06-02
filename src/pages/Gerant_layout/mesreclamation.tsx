import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Grow, CircularProgress, Button } from '@mui/material';
import axios from 'axios'; // Import axios for making HTTP requests
import Reclamation from '../../components/models/Reclamation';

const ReclamationList = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const response = await axios.get('http://localhost:3030/reclamation/consultermesreclamation/6647f9f6420f66a0d5de1fdd');
        setReclamations(response.data.reclamations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reclamations:', error);
        setLoading(false);
      }
    };

    fetchReclamations();
  }, []);

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
                  {/* Add any additional actions or buttons */}
                  <Button variant="outlined" color="primary" size="small" fullWidth>
                    Voir détails
                  </Button>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ReclamationList;
