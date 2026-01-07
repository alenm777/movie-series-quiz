import axios from "axios";

const API_KEY = "f2621e5d97f26f52a1896518fb98c906";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: API_KEY,
    language: "es-ES",
  },
});

export async function getPopularMovies() {
  const response = await api.get("/movie/popular");
  return response.data.results;
}