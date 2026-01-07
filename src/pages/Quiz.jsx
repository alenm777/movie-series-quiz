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

  useEffect(() => {
    async function load() {
      const data = await getPopularMovies();
      setMovies(data.slice(0, 10));
    }
    load();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;

    const correct = movies[current].title;

    const incorrect = movies
      .filter((_, i) => i !== current)
      .map((m) => m.title)
      .slice(0, 3);

    setOptions(shuffle([correct, ...incorrect]));
    setAnswered(false);
    setSelected(null);
  }, [current, movies]);

  if (movies.length === 0) return <p>Cargando...</p>;

  const movie = movies[current];
  const progress = ((current + 1) / movies.length) * 100;

  function handleAnswer(option) {
    if (answered) return;

    setSelected(option);
    setAnswered(true);

    if (option === movie.title) {
      setScore(score + 1);
    }
  }

  function nextQuestion() {
    if (current < movies.length - 1) {
      setCurrent(current + 1);
    } else {
      alert(`Juego terminado 🎉 Puntaje final: ${score}/${movies.length}`);
    }
  }

  return (
    <Card>
      <LinearProgress variant="determinate" value={progress} />

      <CardMedia
        component="img"
        height="400"
        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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

            let color = "outlined";

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
            {current === movies.length - 1 ? "Ver resultado" : "Siguiente"}
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
