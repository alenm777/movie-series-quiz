import axios from "axios";

const API_KEY = "TU_API_KEY_AQUI";

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: API_KEY,
    language: "es-ES"
  }
});

export async function getPopularMovies() {
  const res = await tmdb.get("/movie/popular");
  return res.data.results;
}