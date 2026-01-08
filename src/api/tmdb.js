import axios from "axios";

const API_URL = "https://api.themoviedb.org/3";

// 👉 Token de lectura TMDB
const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjYyMWU1ZDk3ZjI2ZjUyYTE4OTY1MThmYjk4YzkwNiIsIm5iZiI6MTc2NzgyMzg1Ny41OTYsInN1YiI6IjY5NWVkOWYxYzYxZTRiM2UwNGY5ZTE1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-RDTUqvOoPaL6gFcELLwHHV-UG4CUMZ726lcXsXWzUw";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 🎬 Películas populares
export async function getPopularMovies() {
  const res = await api.get("/movie/popular?language=es-ES");
  return res.data.results;
}

// 📺 Series populares
export async function getPopularSeries() {
  const res = await api.get("/tv/popular?language=es-ES");
  return res.data.results;
}

// 🎭 Géneros (movies)
export async function getMovieGenres() {
  const res = await api.get("/genre/movie/list?language=es-ES");
  return res.data.genres;
}

// 🎭 Géneros (series)
export async function getTvGenres() {
  const res = await api.get("/genre/tv/list?language=es-ES");
  return res.data.genres;
}

// 👤 Créditos de películas
export async function getMovieCredits(movieId) {
  const res = await api.get(`/movie/${movieId}/credits?language=es-ES`);
  return res.data.cast;
}

// 👤 Créditos de series 
export async function getSeriesCredits(seriesId) {
  const res = await api.get(`/tv/${seriesId}/credits?language=es-ES`);
  return res.data.cast;
}