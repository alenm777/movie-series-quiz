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
import {
  getPopularMovies,
  getMovieCredits,
  getGenres,
} from "../api/tmdb";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const QUESTION_TYPES = ["year", "genre", "actor"];

function Quiz() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [current, setCurrent] = useState(0);
  const [options, setOptions] = useState([]);
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    loadGame();
  }, []);

  async function loadGame() {
    const moviesData = await getPopularMovies();
    const genresData = await getGenres();

    setMovies(moviesData.slice(0, 10));
    setGenres(genresData);
    setCurrent(0);
    setScore(0);
    setFinished(false);
  }

  useEffect(() => {
    if (movies.length === 0 || finished) return;
    generateQuestion();
  }, [current, movies, finished]);

  async function generateQuestion() {
    const movie = movies[current];
    const type = QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];

    // 🎬 AÑO
    if (type === "year") {
      const year = movie.release_date.split("-")[0];
      setQuestion("¿En qué año se estrenó esta película?");
      setCorrectAnswer(year);

      const years = shuffle([
        year,
        `${Number(year) - 1}`,
        `${Number(year) + 1}`,
        `${Number(year) - 2}`,
      ]);

      setOptions(years);
    }

    // 🎭 GÉNERO
    if (type === "genre") {
      const movieGenreId = movie.genre_ids[0];
      const genre = genres.find((g) => g.id === movieGenreId);

      setQuestion("¿A qué género pertenece esta película?");
      setCorrectAnswer(genre.name);

      const otherGenres = shuffle(
        genres.filter((g) => g.id !== genre.id).slice(0, 3)
      ).map((g) => g.name);

      setOptions(shuffle([genre.name, ...otherGenres]));
    }

    // 🎤 ACTOR
    if (type === "actor") {
      const cast = await getMovieCredits(movie.id);
      const mainActor = cast[0]?.name;

      setQuestion("¿Quién es el actor principal de esta película?");
      setCorrectAnswer(mainActor);

      const otherActors = shuffle(
        cast.slice(1, 6).map((a) => a.name)
      ).slice(0, 3);

      setOptions(shuffle([mainActor, ...otherActors]));
    }

    setAnswered(false);
    setSelected(null);
  }

  function handleAnswer(option) {
    if (answered) return;

    setSelected(option);
    setAnswered(true);

    if (option === correctAnswer) {
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

  if (movies.length === 0) return <p>Cargando...</p>;

  if (finished) {
    return (
      <Card>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h4">🎉 Juego terminado</Typography>
          <Typography variant="h6">
            Puntaje: {score} / {movies.length}
          </Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={loadGame}>
            Jugar de nuevo
          </Button>
        </CardContent>
      </Card>
    );
  }

  const movie = movies[current];
  const progress = ((current + 1) / movies.length) * 100;

  return (
    <Card>
      <LinearProgress variant="determinate" value={progress} />

      <CardMedia
        component="img"
        height="400"
        image={
          movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }
        alt={movie.title}
      />

      <CardContent>
        <Typography variant="h6" gutterBottom>
          Pregunta {current + 1} / {movies.length}
        </Typography>

        <Typography sx={{ mb: 2 }}>{question}</Typography>

        <Stack spacing={1}>
          {options.map((option) => {
            let color = "primary";

            if (answered) {
              if (option === correctAnswer) color = "success";
              else if (option === selected) color = "error";
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