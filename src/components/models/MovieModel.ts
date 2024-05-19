interface Movie {
    _id?: string;
    title: string;
    releaseDate: string;
    country: string;
    director: string;
    synopsis: string;
    poster: string;
    link: string;
    genre: string;
    duration: number;
    rating: { user: string; rating: number; date: string }[];
  }
  export default Movie;
  