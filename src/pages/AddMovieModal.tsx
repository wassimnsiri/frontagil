import React, { useState } from 'react';
import Movie from '../components/models/MovieModel';
import { storage } from './firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable, getMetadata } from 'firebase/storage';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMovie: (movie: Movie) => void;
}

const AddModal: React.FC<AddModalProps> = ({ isOpen, onClose }) => {

  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [country, setCountry] = useState('');
  const [director, setDirector] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [link, setLink] = useState('');
  const [poster, setPoster] = useState('');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState('');
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleAddMovie = async () => {
    if (!posterFile || !videoFile) {
      console.error('Both poster and video must be selected');
      return;
    }

    // Upload poster
    const posterRef = ref(storage, `posters/${posterFile.name}`);
    await uploadBytesResumable(posterRef, posterFile);
    const posterUrl = await getDownloadURL(posterRef);


    // Upload video
    const videoRef = ref(storage, `movies/${videoFile.name}`);
    const uploadTask = uploadBytesResumable(videoRef, videoFile);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Get upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Error uploading video:', error);
      },
      async () => {
        // Upload complete, get video download URL
        const videoUrl = await getDownloadURL(videoRef);
        const posterUrl = await getDownloadURL(posterRef);

        setPoster(posterUrl);
        setLink(videoUrl);

        // Add movie to database
        const newMovie: Movie = {
          title,
          releaseDate,
          country,
          director,
          synopsis,
          poster: posterUrl,
          link: videoUrl,
          genre,
          duration: parseInt(duration),
          rating: [],
        };
        addMovieEndpoint(newMovie);
  
      }
    );
  };

  const addMovieEndpoint = async (newMovie: Movie) => {
    try {
      const response = await fetch('http://20.199.90.9:3030/movies/addMovie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie),
      });

      if (!response.ok) {
        throw new Error('Failed to add movie');
      }

      // Movie added successfully
      // You can handle further actions here, such as closing the modal or showing a success message
      onClose();
      alert('Movie added successfully!');
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  }
  

  const handleCancel = () => {
    // Reset all fields to empty and close the modal
    setPosterFile(null);
    setVideoFile(null);
    setUploadProgress(0);
    onClose();
  };

  return (
    <div className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex justify-center items-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Add New Movie</h3>

                <div className="mt-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" name="title" id="title" onChange={(e) => setTitle(e.target.value)} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md" />
                </div>
                <div className="mt-4">
                  <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700">Release Date</label>
                  <input type="date" name="releaseDate" id="releaseDate" onChange={(e) => setReleaseDate(e.target.value)} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md" />
                </div>
                <div className="mt-4">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <input type="text" name="country" id="country" onChange={(e) => setCountry(e.target.value)} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md" />
                </div>
                <div className="mt-4">
                  <label htmlFor="director" className="block text-sm font-medium text-gray-700">Director</label>
                  <input type="text" name="director" id="director" onChange={(e) => setDirector(e.target.value)} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md" />
                </div>
                <div className="mt-4">
                  <label htmlFor="synopsis" className="block text-sm font-medium text-gray-700">Synopsis</label>
                  <textarea name="synopsis" id="synopsis" onChange={(e) => setSynopsis(e.target.value)} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md"></textarea>
                </div>
                <div className="mt-4">
                  <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                  <input type="text" name="genre" id="genre" onChange={(e) => setGenre(e.target.value)} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md" />
                </div>
                <div className="mt-4">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                  <input type="text" name="duration" id="duration" onChange={(e) => setDuration(e.target.value)} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md" />
                </div>
                <div className="mt-2">
                  <div className="mt-4">
                    <label htmlFor="poster" className="block text-sm font-medium text-gray-700">Poster</label>
                    <input type="file" name="poster" id="poster" onChange={(e) => setPosterFile(e.target.files ? e.target.files[0] : null)} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md text-center" />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="video" className="block text-sm font-medium text-gray-700">Video</label>
                    <input type="file" name="video" id="video" onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md text-center" />
                  </div>
                  {uploadProgress > 0 && (
                    <div className="mt-4">
                      <progress className="w-full" value={uploadProgress} max="100" />
                      <p>{`${uploadProgress.toFixed(2)}% uploaded`}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button onClick={handleAddMovie} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">Add Movie</button>
            <button onClick={handleCancel} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
