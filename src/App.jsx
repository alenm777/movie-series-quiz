import { Container, Typography, Button, Stack } from "@mui/material";
import { useState } from "react";
import MovieQuiz from "./pages/MovieQuiz";
import SeriesQuiz from "./pages/SeriesQuiz";

export default function App() {
  const [mode, setMode] = useState(null);

  return (
    <Container maxWidth="sm" sx={{ mt: 6, textAlign: "center" }}>
      {!mode ? (
        <>
          <Typography variant="h4" gutterBottom>
            🎬 Movie & Series Quiz
          </Typography>

          <Stack spacing={2}>
            <Button variant="contained" onClick={() => setMode("movie")}>
              Jugar con Películas
            </Button>
            <Button variant="outlined" onClick={() => setMode("series")}>
              Jugar con Series
            </Button>
          </Stack>
        </>
      ) : mode === "movie" ? (
        <MovieQuiz />
      ) : (
        <SeriesQuiz />
      )}
    </Container>
  );
}