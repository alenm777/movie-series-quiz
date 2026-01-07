import { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
  LinearProgress,
} from "@mui/material";
import { getPopularMovies } from "../api/tmdb";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function Quiz() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    try {
      const data = await getPopularMovies();

      setMovies(data.slice(0, 10));
      setCurrent(0);
      setScore(0);
      setFinished(false);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar las películas");
    }
  }

  useEffect(() => {
    if (movies.length === 0 || finished) return;

    const correct = movies[current].title;

    const incorrect = shuffle(
      movies
        .filter((_, i) => i !== current)
        .map((m) => m.title)
    ).slice(0, 3);

    setOptions(shuffle([correct, ...incorrect]));
    setAnswered(false);
    setSelected(null);
  }, [current, movies, finished]);

  if (error) return <p>{error}</p>;
  if (movies.length === 0) return <p>Cargando...</p>;

  if (finished) {
    const percentage = Math.round((score / movies.length) * 100);

    return (
      <Card>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            🎉 Juego terminado
          </Typography>

          <Typography variant="h6">
            Puntaje: {score} / {movies.length}
          </Typography>

          <Typography sx={{ mt: 1, mb: 2 }}>
            Resultado: {percentage}%
          </Typography>

          <Typography sx={{ mb: 3 }}>
            {percentage >= 80 && "🔥 Excelente! Sos un cinéfilo"}
            {percentage >= 50 && percentage < 80 && "👏 Muy bien!"}
            {percentage < 50 && "🎬 A seguir mirando pelis"}
          </Typography>

          <Button variant="contained" onClick={loadMovies}>
            Jugar de nuevo
          </Button>
        </CardContent>
      </Card>
    );
  }

  const movie = movies[current];
  const progress = ((current + 1) / movies.length) * 100;

  function handleAnswer(option) {
    if (answered) return;

    setSelected(option);
    setAnswered(true);

    if (option === movie.title) {
      setScore((prev) => prev + 1);
    }
  }

  function nextQuestion() {
    if (current < movies.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  }

  return (
    <Card>
      <LinearProgress variant="determinate" value={progress} />

      <CardMedia
        component="img"
        height="400"
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=Sin+imagen"
        }
        alt={movie.title}
      />

      <CardContent>
        <Typography variant="h6" gutterBottom>
          Pregunta {current + 1} / {movies.length}
        </Typography>

        <Typography sx={{ mb: 2 }}>
          ¿Cuál es el título de esta película?
        </Typography>

        <Stack spacing={1}>
          {options.map((option) => {
            const isCorrect = option === movie.title;
            const isSelected = option === selected;

            let color = "primary";

            if (answered) {
              if (isCorrect) color = "success";
              else if (isSelected) color = "error";
            }

            return (
              <Button
                key={option}
                variant="outlined"
                color={color}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            );
          })}
        </Stack>

        {answered && (
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            fullWidth
            onClick={nextQuestion}
          >
            {current === movies.length - 1
              ? "Ver resultado"
              : "Siguiente"}
          </Button>
        )}

        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Puntaje: {score}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Quiz;