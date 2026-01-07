import { useEffect, useState } from "react";
import { getPopularMovies } from "../api/tmdb";
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";

function Quiz() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function loadMovies() {
      const data = await getPopularMovies();
      setMovies(data.slice(0, 10));
    }
    loadMovies();
  }, []);

  if (movies.length === 0) return <p>Cargando...</p>;

  const movie = movies[current];

  function handleAnswer(correct) {
    if (correct) setScore(score + 1);

    if (current < movies.length - 1) {
      setCurrent(current + 1);
    } else {
      alert(`Juego terminado 🎉 Puntaje: ${score + (correct ? 1 : 0)}`);
    }
  }

  return (
    <Card>
      <CardMedia
        component="img"
        height="400"
        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />

      <CardContent>
        <Typography variant="h6" gutterBottom>
          ¿Cuál es el título de esta película?
        </Typography>

        <Button
          fullWidth
          sx={{ mb: 1 }}
          variant="outlined"
          onClick={() => handleAnswer(true)}
        >
          {movie.title}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => handleAnswer(false)}
        >
          Opción incorrecta
        </Button>

        <Typography sx={{ mt: 2 }}>
          Puntaje: {score}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Quiz;
