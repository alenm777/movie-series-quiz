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
  getPopularSeries,
  getTvGenres,
  getSeriesCredits,
} from "../api/tmdb";

const QUESTION_TYPES = ["title", "year", "genre", "actor"];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SeriesQuiz() {
  const [series, setSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [current, setCurrent] = useState(0);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [questionType, setQuestionType] = useState("title");

  useEffect(() => {
    startGame();
  }, []);

  async function startGame() {
    const seriesData = await getPopularSeries();
    const genresData = await getTvGenres();

    setSeries(seriesData.slice(0, 10));
    setGenres(genresData);
    setCurrent(0);
    setScore(0);
    setFinished(false);
  }

  useEffect(() => {
    if (!series.length || finished) return;
    generateQuestion();
  }, [current, series, finished]);

  async function generateQuestion() {
    const item = series[current];
    const qType =
      QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];
    setQuestionType(qType);

    let correct;

    if (qType === "title") correct = item.name;
    if (qType === "year")
      correct = item.first_air_date?.split("-")[0];
    if (qType === "genre") {
      correct = genres.find(g => g.id === item.genre_ids[0])?.name;
    }
    if (qType === "actor") {
      const cast = await getSeriesCredits(item.id);
      correct = cast[0]?.name;
    }

    const incorrect = series
      .filter((_, i) => i !== current)
      .slice(0, 3)
      .map(s => {
        if (qType === "title") return s.name;
        if (qType === "year")
          return s.first_air_date?.split("-")[0];
        if (qType === "genre") {
          return genres.find(g => g.id === s.genre_ids[0])?.name;
        }
        return "Otro actor";
      });

    setOptions(shuffle([correct, ...incorrect]));
    setAnswered(false);
    setSelected(null);
  }

  function handleAnswer(option) {
    if (answered) return;
    setAnswered(true);
    setSelected(option);

    let correct;
    const item = series[current];

    if (questionType === "title") correct = item.name;
    if (questionType === "year")
      correct = item.first_air_date?.split("-")[0];
    if (questionType === "genre")
      correct = genres.find(g => g.id === item.genre_ids[0])?.name;

    if (option === correct) setScore(s => s + 1);
  }

  function next() {
    current < series.length - 1
      ? setCurrent(c => c + 1)
      : setFinished(true);
  }

  if (!series.length) return <Typography>Cargando...</Typography>;

  if (finished)
    return (
      <Card sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h4">🎉 Juego terminado</Typography>
        <Typography sx={{ mt: 2 }}>
          Puntaje: {score} / {series.length}
        </Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={startGame}>
          Jugar de nuevo
        </Button>
      </Card>
    );

  const item = series[current];
  const progress = ((current + 1) / series.length) * 100;

  return (
    <Card>
      <LinearProgress value={progress} variant="determinate" />

      <CardMedia
        component="img"
        height="400"
        image={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
      />

      <CardContent>
        <Typography sx={{ mb: 2 }}>
          {questionType === "title" && "¿Cuál es el nombre de la serie?"}
          {questionType === "year" && "¿En qué año se estrenó?"}
          {questionType === "genre" && "¿A qué género pertenece?"}
          {questionType === "actor" && "¿Quién es el actor principal?"}
        </Typography>

        <Stack spacing={1}>
          {options.map(o => (
            <Button
              key={o}
              variant="outlined"
              onClick={() => handleAnswer(o)}
            >
              {o}
            </Button>
          ))}
        </Stack>

        {answered && (
          <Button sx={{ mt: 2 }} fullWidth variant="contained" onClick={next}>
            Siguiente
          </Button>
        )}
      </CardContent>
    </Card>
  );
}