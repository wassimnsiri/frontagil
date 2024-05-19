import React, { useState, useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import Movie from '../components/models/MovieModel';
import { Card, CardContent, CardMedia, Typography, IconButton, Box } from '@mui/material';
import AddModal from './AddMovieModal';

// Import the AddModal component


const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://20.199.90.9:3030/movies');
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const moviesData: Movie[] = await response.json();
        setMovies(moviesData);
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  // Placeholder function for onAddMovie
  const handleAddMovie = (newMovie: Movie) => {
    // Implement the logic to add a new movie
    console.log('Adding new movie:', newMovie);
  };

  return (
    <DefaultLayout>
      <div className={`container ${isModalOpen ? 'filter blur-sm' : ''}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-center text-lg">Available Movies</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-purple-200 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded">
            +
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            movies.map((movie) => (
              <div key={movie._id} className="col mb-4 mr-6  border border-gray-100 rounded-md shadow-md">
                <div className="flex">
                  <div className="flex-1">
                    <div>
                      <h3>{movie.title}</h3>
                      <p className="text-sm text-gray-500">{movie.director}</p>
                    </div>
                  </div>
                  <div className="w-32">
                    <img src={movie.poster} alt={movie.title} className="w-full" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Render the AddModal component */}
      <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddMovie={handleAddMovie} />
    </DefaultLayout>
  );
};

export default Movies;
